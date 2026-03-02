import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StarkTitleSlide } from './components/StarkTitleSlide';
import { StarkTextSlide } from './components/StarkTextSlide';
import { StarkMatrixSlide } from './components/StarkMatrixSlide';
import { StarkPillarSlide } from './components/StarkPillarSlide';
import { StarkGridSlide } from './components/StarkGridSlide';
import { StarkDataSlide } from './components/StarkDataSlide';

// @ts-ignore
import rawSlidesData from '../../pipelines/common/slides.json';
const slidesData = rawSlidesData.slides;

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

    // Default to the versatile Text Slide for now
    return <StarkTextSlide slide={currentSlide} />;
  };

  return (
    <Layout
      currentSlide={currentSlideIndex}
      totalSlides={slidesData.length}
      phase={currentSlide.phase?.toUpperCase() || "PRESENTATION"}
      slide={currentSlide}
    >
      {renderSlideContent()}
    </Layout>
  );
}

export default App;
