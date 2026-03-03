import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { RovoDevIcon } from '@atlaskit/logo';
import { CommentPanel } from './CommentPanel';

export function Layout({
    children,
    currentSlide,
    totalSlides,
    phase = "INTRO",
    slide,
    onOpenSorter,
    onNext,
    onPrev
}: {
    children: ReactNode,
    currentSlide: number,
    totalSlides: number,
    phase?: string,
    slide?: any,
    onOpenSorter?: () => void,
    onNext?: () => void,
    onPrev?: () => void
}) {
    const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);

    const [scale, setScale] = useState(1);
    const [dimensions, setDimensions] = useState({ width: '100vw', height: '100dvh' });

    useEffect(() => {
        const updateScale = () => {
            const hasTouch = navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches);
            const isLandscape = window.innerWidth > window.innerHeight;

            // If on mobile landscape and vertical real-estate is small, render as a taller display and scale down
            if (hasTouch && isLandscape && window.innerHeight < 800) {
                const idealHeight = 800;
                const newScale = window.innerHeight / idealHeight;
                setScale(newScale);
                setDimensions({
                    width: `${window.innerWidth / newScale}px`,
                    height: `${idealHeight}px`
                });
            } else {
                setScale(1);
                setDimensions({ width: '100vw', height: '100dvh' });
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('orientationchange', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, []);

    return (
        <div className="w-screen h-[100dvh] overflow-hidden bg-white">
            <div
                className="flex flex-col bg-white overflow-hidden origin-top-left"
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    transform: `scale(${scale})`,
                }}
            >
                {/* Top Navigation Bar: Severe, Data-driven */}
                <header className="flex justify-between items-center px-6 md:px-16 py-4 md:py-8 border-b-[2px] border-ink shrink-0">
                    <div className="flex items-baseline space-x-4 md:space-x-6">
                        <span className="font-serif text-lg md:text-2xl font-bold tracking-tight">The PMM's Hippocratic Oath</span>
                        <span className={`font-sans text-xs md:text-sm tracking-widest uppercase font-bold border-l border-ink pl-4 md:pl-6 ${phase?.toLowerCase() === 'peril' ? 'text-vermillion' : phase?.toLowerCase() === 'path' || phase?.toLowerCase() === 'promise' ? 'text-forest' : 'text-ink-soft'}`}>
                            {phase}
                        </span>
                    </div>
                    <button
                        onClick={onOpenSorter}
                        className="font-mono text-xs md:text-sm tracking-widest shrink-0 ml-4 hover:text-vermillion transition-colors border-b border-transparent hover:border-vermillion cursor-pointer"
                        aria-label="Open slide sorter"
                    >
                        Slide {currentSlide + 1} / {totalSlides}
                    </button>
                </header>

                {/* Slide Lead / Kicker: Hard Synthesizing Assertion */}
                {slide?.lead && (
                    <div className="px-6 md:px-16 py-4 border-b-[1.5px] border-ink shrink-0 bg-white z-10">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black leading-tight text-ink max-w-6xl">
                            {slide.lead}
                        </h2>
                    </div>
                )}

                {/* Main Content Area: 12-column grid */}
                <main className="flex-1 w-full relative min-h-0">
                    <div className="absolute inset-0 grid grid-cols-12 gap-4 md:gap-8 px-6 md:px-16 h-full border-x border-line opacity-5 pointer-events-none hidden md:grid">
                        {/* Visualizing the Grid for pure structure, visible faintly to reinforce the aesthetic */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-full border-x border-ink col-span-1" />
                        ))}
                    </div>
                    <div className="absolute inset-0 px-6 md:px-16 py-8 md:py-12 flex flex-col justify-start md:justify-center overflow-y-auto">
                        {children}
                    </div>

                    {/* Mobile Navigation Controls */}
                    <div className="absolute inset-y-0 left-0 w-24 lg:hidden flex items-stretch justify-start z-20 pointer-events-auto">
                        <button
                            onClick={onPrev}
                            disabled={currentSlide === 0}
                            className="w-full h-full flex items-center justify-start pl-4 group bg-transparent hover:bg-zinc-900/5 active:bg-zinc-900/10 transition-all disabled:opacity-0"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={36} strokeWidth={1} className="text-ink/10 group-hover:text-ink/60 transition-colors" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-24 lg:hidden flex items-stretch justify-end z-20 pointer-events-auto">
                        <button
                            onClick={onNext}
                            disabled={currentSlide === totalSlides - 1}
                            className="w-full h-full flex items-center justify-end pr-4 group bg-transparent hover:bg-zinc-900/5 active:bg-zinc-900/10 transition-all disabled:opacity-0"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={36} strokeWidth={1} className="text-ink/10 group-hover:text-ink/60 transition-colors" />
                        </button>
                    </div>
                </main>

                {/* Footer: Date, Citations, and Author */}
                <footer className="flex justify-between items-end px-6 md:px-16 py-4 md:py-6 border-t border-line text-[10px] md:text-xs font-mono tracking-widest text-ink-soft shrink-0 z-10 bg-white">
                    <div className="flex flex-col space-y-2 max-w-3xl">
                        {slide?.footnotes && slide.footnotes.length > 0 && (
                            <div className="flex flex-col space-y-1 text-ink-soft/80 pr-8">
                                {slide.footnotes.map((fn: string, i: number) => (
                                    <span key={i}>* {fn}</span>
                                ))}
                            </div>
                        )}
                        {slide?.source && (
                            <div className="uppercase font-bold text-ink mb-1">
                                SOURCE: {slide.source}
                            </div>
                        )}
                        <span className="uppercase flex items-center flex-wrap gap-x-1">
                            © 2026 Built with <a href="https://www.atlassian.com/software/rovo-dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-forest transition-colors border-b border-transparent hover:border-forest"><RovoDevIcon size="small" appearance="brand" /> RovoDev</a> &amp; <a href="https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design" target="_blank" rel="noreferrer" className="hover:text-forest transition-colors border-b border-transparent hover:border-forest">Claude Skills</a>
                        </span>
                    </div>
                    <div className="flex items-center gap-4 ml-4 shrink-0">
                        {currentSlide === totalSlides - 1 && (
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 uppercase whitespace-nowrap hover:text-forest transition-colors border-b border-ink-soft hover:border-forest py-1 cursor-pointer text-forest font-bold print:hidden"
                                aria-label="Export to PDF"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span className="hidden sm:inline">Export PDF</span>
                            </button>
                        )}
                        <button
                            onClick={() => setCommentsPanelOpen(true)}
                            className="flex items-center gap-2 uppercase whitespace-nowrap hover:text-vermillion transition-colors border-b border-ink-soft hover:border-vermillion py-1 cursor-pointer print:hidden"
                            aria-label="Open comments"
                        >
                            <MessageSquare size={14} strokeWidth={2.5} />
                            <span className="hidden sm:inline">Comments</span>
                        </button>
                        <a href="https://sidc.ai" target="_blank" rel="noreferrer" className="uppercase whitespace-nowrap hover:text-forest transition-colors border-b border-ink-soft hover:border-forest print:hidden">
                            Siddhartha Chaturvedi
                        </a>
                    </div>
                </footer>

                {/* Comment Panel Overlay */}
                <CommentPanel
                    slideIndex={currentSlide}
                    isOpen={commentsPanelOpen}
                    onClose={() => setCommentsPanelOpen(false)}
                />
            </div>
        </div>
    );
}
