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

// @ts-ignore
import rawSlidesData from '../pipelines/common/slides.json';
const slidesData = rawSlidesData.slides;

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [sorterOpen, setSorterOpen] = useState(false);
  const directionRef = useRef<1 | -1>(1); // 1 = forward, -1 = backward

  const goTo = (idx: number) => {
    directionRef.current = idx >= currentSlideIndex ? 1 : -1;
    setCurrentSlideIndex(idx);
  };

  const goNext = () => {
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
