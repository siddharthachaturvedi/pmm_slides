import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { StarkTitleSlide } from './components/StarkTitleSlide';
import { StarkTextSlide } from './components/StarkTextSlide';
import { StarkMatrixSlide } from './components/StarkMatrixSlide';
import { StarkPillarSlide } from './components/StarkPillarSlide';
import { StarkGridSlide } from './components/StarkGridSlide';
import { StarkDataSlide } from './components/StarkDataSlide';
import { StarkCardSlide } from './components/StarkCardSlide';
import { StarkSplitSlide } from './components/StarkSplitSlide';
import { SlideSorter } from './components/SlideSorter';
import { MobileOverlay } from './components/MobileOverlay';
import type { Comment } from './components/CommentPanel';

// @ts-ignore
import rawSlidesData from '../pipelines/common/slides.json';
const slidesData = rawSlidesData.slides;

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [sorterOpen, setSorterOpen] = useState(false);
  // Trello comment preload — fetched once on mount, grouped by slide index
  const [commentsBySlide, setCommentsBySlide] = useState<Record<number, Comment[]>>({});
  const directionRef = useRef<1 | -1>(1);

  const goTo = (idx: number) => {
    directionRef.current = idx >= currentSlideIndex ? 1 : -1;
    setCurrentSlideIndex(idx);
  };

  // On mount: fetch ALL Trello cards and group by slide index
  useEffect(() => {
    const key = import.meta.env.VITE_TRELLO_KEY;
    const token = import.meta.env.VITE_TRELLO_TOKEN;
    const listId = import.meta.env.VITE_TRELLO_LIST_ID;
    if (!key || !token || !listId) return;

    fetch(`https://api.trello.com/1/lists/${listId}/cards?key=${key}&token=${token}&fields=id,name,desc`)
      .then(r => r.json())
      .then((cards: { id: string; name: string; desc: string }[]) => {
        const grouped: Record<number, Comment[]> = {};
        for (const card of cards) {
          const lines = card.desc?.split('\n') ?? [];
          const slideRaw = lines.find(l => l.startsWith('SLIDE:'))?.slice(6);
          const author = lines.find(l => l.startsWith('AUTHOR:'))?.slice(7) ?? 'Anonymous';
          const at = lines.find(l => l.startsWith('AT:'))?.slice(3) ?? new Date().toISOString();
          const bodyStart = lines.findIndex(l => l === '---');
          // Strict format check — ignore cards that don't match exactly
          if (slideRaw === undefined || isNaN(parseInt(slideRaw, 10)) || bodyStart === -1) continue;
          const idx = parseInt(slideRaw, 10);
          const body = lines.slice(bodyStart + 1).join('\n');
          if (!body.trim()) continue;
          const comment: Comment = { id: card.id, slide_index: idx, author_name: author, body, created_at: at };
          grouped[idx] = [...(grouped[idx] ?? []), comment];
        }
        // Sort each slide's comments by created_at
        for (const k of Object.keys(grouped)) {
          grouped[+k].sort((a, b) => a.created_at.localeCompare(b.created_at));
        }
        setCommentsBySlide(grouped);
      })
      .catch(() => { }); // silently fail — panel will fetch on open as fallback
  }, []);

  const goNext = () => {
    const event = new CustomEvent('requestNextSlide', { cancelable: true });
    window.dispatchEvent(event);
    if (event.defaultPrevented) return; // allows slides to prevent immediate transition to proceed with animation steps

    directionRef.current = 1;
    setCurrentSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1));
  };

  const goPrev = () => {
    directionRef.current = -1;
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sorterOpen) {
        if (e.key === 'Escape') setSorterOpen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'g' || e.key === 'G') {
        setSorterOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sorterOpen, currentSlideIndex]);

  // Use URL hash for routing
  useEffect(() => {
    const hash = window.location.hash.replace('#/', '');
    const num = parseInt(hash, 10);
    if (!isNaN(num) && num >= 1 && num <= slidesData.length) {
      setCurrentSlideIndex(num - 1);
    } else if (hash === '0') {
      setCurrentSlideIndex(0);
    }
  }, []);

  useEffect(() => {
    window.location.hash = `/${currentSlideIndex + 1}`;
  }, [currentSlideIndex]);

  const currentSlide = slidesData[currentSlideIndex];

  // Routing Logic based on Slide Content
  const renderSlideContent = (index: number, slide: any, isBackward: boolean) => {
    const props = { slide, isBackward };
    if (index === 0) return <StarkTitleSlide {...props} />;
    const slideType = slide.type;
    if (slideType === 'matrix') return <StarkMatrixSlide {...props} />;
    if (slideType === 'pillar') return <StarkPillarSlide {...props} />;
    if (slideType === 'grid') return <StarkGridSlide {...props} />;
    if (slideType === 'data') return <StarkDataSlide {...props} />;
    if (slideType === 'card') return <StarkCardSlide {...props} />;
    if (slideType === 'split') return <StarkSplitSlide {...props} />;
    return <StarkTextSlide {...props} />;
  };

  // Slide transition variants — direction-aware, spring-based for snappy rapid clicks (#9)
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 14 : -14 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -14 : 14 }),
  };
  const slideTransition = { type: 'spring' as const, stiffness: 500, damping: 38, mass: 0.8 };

  return (
    <>
      <div className="print:hidden h-[100dvh]">
        <MobileOverlay />
        <Layout
          currentSlide={currentSlideIndex}
          totalSlides={slidesData.length}
          phase={currentSlide.phase?.toUpperCase() || "PRESENTATION"}
          slide={currentSlide}
          onOpenSorter={() => setSorterOpen(true)}
          onNext={goNext}
          onPrev={goPrev}
          preloadedComments={commentsBySlide[currentSlideIndex] ?? []}
        >
          <AnimatePresence custom={directionRef.current} mode="wait" initial={false}>
            <motion.div
              key={currentSlideIndex}
              custom={directionRef.current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="w-full h-full"
            >
              {renderSlideContent(currentSlideIndex, currentSlide, directionRef.current < 0)}
            </motion.div>
          </AnimatePresence>
        </Layout>
        <SlideSorter
          slides={slidesData}
          isOpen={sorterOpen}
          onClose={() => setSorterOpen(false)}
          onSelectSlide={(idx: number) => goTo(idx)}
          currentSlideIndex={currentSlideIndex}
        />
      </div>

      {/* Hidden container that only shows during printing */}
      <div className="hidden print:block">
        {slidesData.map((slide: any, idx: number) => (
          <div key={idx} style={{ pageBreakAfter: 'always', width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <Layout
              currentSlide={idx}
              totalSlides={slidesData.length}
              phase={slide.phase?.toUpperCase() || "PRESENTATION"}
              slide={slide}
            >
              {renderSlideContent(idx, slide, false)}
            </Layout>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
