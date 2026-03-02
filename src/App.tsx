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
    const idx = parseInt(hash, 10);
    if (!isNaN(idx) && idx >= 0 && idx < slidesData.length) {
      setCurrentSlideIndex(idx);
    }
  }, []);

  useEffect(() => {
    window.location.hash = `/${currentSlideIndex}`;
  }, [currentSlideIndex]);

  const currentSlide = slidesData[currentSlideIndex];

  // Routing Logic based on Slide Content
  const renderSlideContent = () => {
    if (currentSlideIndex === 0) {
      return <StarkTitleSlide slide={currentSlide} />;
    }

    const slideType = (currentSlide as any).type;

    if (slideType === 'matrix') {
      return <StarkMatrixSlide slide={currentSlide} />;
    }

    if (slideType === 'pillar') {
      return <StarkPillarSlide slide={currentSlide} />;
    }

    if (slideType === 'grid') {
      return <StarkGridSlide slide={currentSlide} />;
    }

    if (slideType === 'data') {
      return <StarkDataSlide slide={currentSlide} />;
    }

    if (slideType === 'card') {
      return <StarkCardSlide slide={currentSlide} />;
    }

    if (slideType === 'split') {
      return <StarkSplitSlide slide={currentSlide} />;
    }

    // Default to the versatile Text Slide for now
    return <StarkTextSlide slide={currentSlide} />;
  };

  return (
    <>
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
        {renderSlideContent()}
      </Layout>
      <SlideSorter
        slides={slidesData}
        isOpen={sorterOpen}
        onClose={() => setSorterOpen(false)}
        onSelectSlide={(idx: number) => setCurrentSlideIndex(idx)}
        currentSlideIndex={currentSlideIndex}
      />
    </>
  );
}

export default App;
