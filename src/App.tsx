import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger slide navigation if sorter is open
      if (sorterOpen) {
        if (e.key === 'Escape') {
          setSorterOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'g' || e.key === 'G') {
        // Optional quick shortcut to open sorter
        setSorterOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sorterOpen]);

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
  const renderSlideContent = (index: number, slide: any) => {
    if (index === 0) {
      return <StarkTitleSlide slide={slide} />;
    }

    const slideType = slide.type;

    if (slideType === 'matrix') {
      return <StarkMatrixSlide slide={slide} />;
    }

    if (slideType === 'pillar') {
      return <StarkPillarSlide slide={slide} />;
    }

    if (slideType === 'grid') {
      return <StarkGridSlide slide={slide} />;
    }

    if (slideType === 'data') {
      return <StarkDataSlide slide={slide} />;
    }

    if (slideType === 'card') {
      return <StarkCardSlide slide={slide} />;
    }

    if (slideType === 'split') {
      return <StarkSplitSlide slide={slide} />;
    }

    // Default to the versatile Text Slide for now
    return <StarkTextSlide slide={slide} />;
  };

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
          onNext={() => setCurrentSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1))}
          onPrev={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
        >
          {renderSlideContent(currentSlideIndex, currentSlide)}
        </Layout>
        <SlideSorter
          slides={slidesData}
          isOpen={sorterOpen}
          onClose={() => setSorterOpen(false)}
          onSelectSlide={(idx: number) => setCurrentSlideIndex(idx)}
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
              {renderSlideContent(idx, slide)}
            </Layout>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
