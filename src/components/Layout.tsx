import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import CommentIcon from '@atlaskit/icon/core/comment';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import CrossIcon from '@atlaskit/icon/core/cross';
import { RovoDevIcon, TrelloIcon } from '@atlaskit/logo';
import { Linkedin } from 'lucide-react'; // Atlassian doesn't have a specific LinkedIn icon in core, keeping this one for now unless a brand icon is better
import { CommentPanel } from './CommentPanel';
import type { Comment } from './CommentPanel';
import { LinkedInShareModal } from './LinkedInShareModal';
import { toPng } from 'html-to-image';

export function Layout({
    children,
    currentSlide,
    totalSlides,
    phase = "INTRO",
    slide,
    onOpenSorter,
    onNext,
    onPrev,
    preloadedComments = [],
}: {
    children: ReactNode,
    currentSlide: number,
    totalSlides: number,
    phase?: string,
    slide?: any,
    onOpenSorter?: () => void,
    onNext?: () => void,
    onPrev?: () => void,
    preloadedComments?: Comment[],
}) {
    const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [capturedSlideUrl, setCapturedSlideUrl] = useState<string | null>(null);
    const [isPreparingShare, setIsPreparingShare] = useState(false);

    const slideRef = useRef<HTMLDivElement>(null);
    // Seed badge count from preloaded data; onCountChange overrides when panel opens
    const [commentCount, setCommentCount] = useState(0);
    useEffect(() => { setCommentCount(preloadedComments.length); }, [preloadedComments]);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    // Phase tracking for pulse animation
    const prevPhaseRef = useRef(phase);
    const [phasePulse, setPhasePulse] = useState(false);
    useEffect(() => {
        if (phase !== prevPhaseRef.current) {
            prevPhaseRef.current = phase;
            setPhasePulse(true);
            const t = setTimeout(() => setPhasePulse(false), 600);
            return () => clearTimeout(t);
        }
    }, [phase]);

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

    // Capture the slide visually BEFORE opening the modal so the modal doesn't exist in DOM
    const handleShareClick = async () => {
        if (!slideRef.current || isPreparingShare) return;
        setIsPreparingShare(true);
        // Ensure scale is factored in by taking the raw unscaled bounds
        const target = slideRef.current;
        const unscaledWidth = target.offsetWidth;
        const unscaledHeight = target.offsetHeight;

        try {
            const url = await toPng(target, {
                cacheBust: true,
                pixelRatio: 2, // retina quality
                backgroundColor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: `${unscaledWidth}px`,
                    height: `${unscaledHeight}px`
                },
                filter: (node: HTMLElement) => {
                    const exclusionClasses = ['print:hidden', 'print-hidden'];
                    if (node.classList && typeof node.classList.contains === 'function') {
                        return !exclusionClasses.some(c => node.classList.contains(c));
                    }
                    return true;
                }
            });

            setCapturedSlideUrl(url);
            setShareModalOpen(true);
        } catch (error) {
            console.error("Failed to capture slide for sharing", error);
        } finally {
            setIsPreparingShare(false);
        }
    };

    const progressPct = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 100;

    const phaseColorClass = phase?.toLowerCase() === 'peril'
        ? 'text-vermillion'
        : (phase?.toLowerCase() === 'path' || phase?.toLowerCase() === 'promise')
            ? 'text-forest'
            : 'text-ink-soft';

    return (
        <div className="w-screen h-[100dvh] overflow-hidden bg-white">
            <div
                ref={slideRef}
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
                        <span
                            className={`
                                font-sans text-xs md:text-sm tracking-widest uppercase font-bold border-l border-ink pl-4 md:pl-6
                                transition-all duration-300
                                ${phaseColorClass}
                                ${phasePulse ? 'scale-110 tracking-[0.2em]' : 'scale-100'}
                            `}
                            style={{ display: 'inline-block', transformOrigin: 'left center' }}
                        >
                            {phase}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 ml-4 shrink-0">
                        {/* Keyboard shortcuts help — #3 */}
                        <button
                            onClick={() => setShortcutsOpen(true)}
                            className="text-ink-soft/40 hover:text-ink-soft transition-colors print:hidden flex items-center justify-center w-6 h-6"
                            aria-label="Keyboard shortcuts"
                            title="Keyboard shortcuts"
                        >
                            <QuestionCircleIcon label="Help" size="small" />
                        </button>
                        <button
                            onClick={onOpenSorter}
                            className="font-mono text-xs md:text-sm tracking-widest shrink-0 hover:text-vermillion transition-colors border-b border-transparent hover:border-vermillion cursor-pointer"
                            aria-label="Open slide sorter"
                        >
                            Slide {currentSlide + 1} / {totalSlides}
                        </button>
                    </div>
                </header>

                {/* Slide Lead / Kicker: Hard Synthesizing Assertion */}
                {slide?.lead && (
                    <div className="px-6 md:px-16 py-3 md:py-5 border-b-[1.5px] border-ink shrink-0 bg-white z-10">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black leading-tight text-ink max-w-6xl">
                            {slide.lead}
                        </h2>
                        {slide?.leadSub && (
                            <p className="mt-1 text-sm md:text-base font-serif text-ink-soft/70 italic">
                                {slide.leadSub}
                            </p>
                        )}
                    </div>
                )}

                {/* Progress Bar — #2 */}
                <div className="w-full h-[2px] bg-line shrink-0 relative overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-ink transition-all duration-300 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

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
                            <ChevronLeftIcon label="Previous" size="medium" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-24 lg:hidden flex items-stretch justify-end z-20 pointer-events-auto">
                        <button
                            onClick={onNext}
                            disabled={currentSlide === totalSlides - 1}
                            className="w-full h-full flex items-center justify-end pr-4 group bg-transparent hover:bg-zinc-900/5 active:bg-zinc-900/10 transition-all disabled:opacity-0"
                            aria-label="Next slide"
                        >
                            <ChevronRightIcon label="Next" size="medium" />
                        </button>
                    </div>
                </main>

                {/* Footer: Date, Citations, and Author — #5 improved hierarchy */}
                <footer className="flex justify-between items-end px-6 md:px-16 py-3 md:py-4 border-t border-line text-[10px] md:text-xs font-mono tracking-widest text-ink-soft shrink-0 z-10 bg-white">
                    <div className="flex flex-col space-y-1.5 max-w-3xl">
                        {slide?.footnotes && slide.footnotes.length > 0 && (
                            <div className="flex flex-col space-y-1 text-ink-soft/80 pr-8">
                                {slide.footnotes.map((fn: string, i: number) => (
                                    <span key={i}>* {fn}</span>
                                ))}
                            </div>
                        )}
                        {slide?.source && (
                            <div className="uppercase font-bold text-ink mb-0.5">
                                SOURCE: {slide.source}
                            </div>
                        )}
                        <span className="uppercase flex items-center flex-wrap gap-x-1 text-ink-soft/60">
                            © 2026 Built with <a href="https://trello.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-forest transition-colors border-b border-transparent hover:border-forest"><TrelloIcon size="small" appearance="brand" /> Trello</a>, <a href="https://www.atlassian.com/software/rovo-dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-forest transition-colors border-b border-transparent hover:border-forest"><RovoDevIcon size="small" appearance="brand" /> RovoDev</a> &amp; <a href="https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design" target="_blank" rel="noreferrer" className="hover:text-forest transition-colors border-b border-transparent hover:border-forest">Claude Skills</a>
                        </span>
                    </div>

                    {/* Right side actions — higher visual weight for Comments and Export */}
                    <div className="flex items-center gap-3 md:gap-5 ml-4 shrink-0">
                        {/* LinkedIn Share */}
                        <button
                            onClick={handleShareClick}
                            disabled={isPreparingShare}
                            className={`flex items-center gap-1.5 uppercase whitespace-nowrap font-bold transition-colors border-b-2 border-transparent py-1 cursor-pointer print:hidden text-[11px] md:text-xs ${isPreparingShare ? 'text-ink-soft/30 cursor-wait' : 'hover:text-[#0A66C2] hover:border-[#0A66C2] text-ink-soft/60'}`}
                            aria-label="Share to LinkedIn"
                            title="Share this slide to LinkedIn"
                        >
                            {isPreparingShare ? (
                                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Linkedin size={13} strokeWidth={2.5} />
                            )}
                            <span className="hidden sm:inline">{isPreparingShare ? 'Capturing...' : 'Share'}</span>
                        </button>

                        {currentSlide === totalSlides - 1 && (
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 uppercase whitespace-nowrap text-forest font-bold hover:text-forest/70 transition-colors border-b-2 border-forest hover:border-forest/70 py-1 cursor-pointer print:hidden text-[11px] md:text-xs"
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

                        {/* Comments button with badge — #10 */}
                        <button
                            onClick={() => setCommentsPanelOpen(true)}
                            className="relative flex items-center gap-2 uppercase whitespace-nowrap font-bold hover:text-vermillion transition-colors border-b-2 border-ink-soft/50 hover:border-vermillion py-1 cursor-pointer print:hidden text-[11px] md:text-xs"
                            aria-label="Open comments"
                        >
                            <CommentIcon label="Comments" size="small" />
                            <span className="hidden sm:inline">Comments</span>
                            {commentCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-vermillion text-white text-[9px] font-bold font-mono min-w-[16px] h-[16px] flex items-center justify-center px-0.5 leading-none">
                                    {commentCount > 99 ? '99' : commentCount}
                                </span>
                            )}
                        </button>

                        <a href="https://sidc.ai" target="_blank" rel="noreferrer" className="uppercase whitespace-nowrap hover:text-forest transition-colors border-b border-ink-soft hover:border-forest print:hidden">
                            Siddhartha Chaturvedi
                        </a>
                    </div>
                </footer>
            </div>

            {/* Modals & Overlays (Outside of the scaled slide presentation to prevent html2canvas recursive capture and scaling issues) */}
            {/* Comment Panel Overlay */}
            <CommentPanel
                slideIndex={currentSlide}
                isOpen={commentsPanelOpen}
                onClose={() => setCommentsPanelOpen(false)}
                onCountChange={(count) => setCommentCount(count)}
                preloadedComments={preloadedComments}
            />

            {/* LinkedIn Share Modal */}
            <LinkedInShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                slideNumber={currentSlide + 1}
                capturedUrl={capturedSlideUrl}
            />

            {/* Keyboard Shortcuts Modal — #3 */}
            {shortcutsOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center print:hidden"
                    onClick={() => setShortcutsOpen(false)}
                >
                    <div
                        className="bg-white border-2 border-ink p-8 min-w-[320px] max-w-sm relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-xl font-bold">Keyboard Shortcuts</h2>
                            <button
                                onClick={() => setShortcutsOpen(false)}
                                className="p-1 hover:bg-ink hover:text-white transition-colors"
                                aria-label="Close shortcuts"
                            >
                                <CrossIcon label="Close" size="small" />
                            </button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            {[
                                ['→ / Space', 'Next slide'],
                                ['←', 'Previous slide'],
                                ['G', 'Open slide sorter'],
                                ['Esc', 'Close panel'],
                            ].map(([key, desc]) => (
                                <div key={key} className="flex items-center justify-between gap-8">
                                    <kbd className="bg-ink text-white text-xs px-2 py-1 font-mono tracking-wider shrink-0">{key}</kbd>
                                    <span className="text-ink-soft text-xs tracking-widest uppercase text-right">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
