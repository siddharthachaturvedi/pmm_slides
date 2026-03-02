import { useState } from 'react';
import type { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentPanel } from './CommentPanel';

export function Layout({
    children,
    currentSlide,
    totalSlides,
    phase = "INTRO",
    slide
}: {
    children: ReactNode,
    currentSlide: number,
    totalSlides: number,
    phase?: string,
    slide?: any
}) {
    const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);

    return (
        <div className="flex flex-col w-screen h-[100dvh] bg-white overflow-hidden">
            {/* Top Navigation Bar: Severe, Data-driven */}
            <header className="flex justify-between items-center px-6 md:px-16 py-4 md:py-8 border-b-[2px] border-ink shrink-0">
                <div className="flex items-baseline space-x-4 md:space-x-6">
                    <span className="font-serif text-lg md:text-2xl font-bold tracking-tight">The PMM's Hippocratic Oath</span>
                    <span className="font-sans text-xs md:text-sm tracking-widest uppercase text-vermillion font-bold border-l border-ink pl-4 md:pl-6">
                        {phase}
                    </span>
                </div>
                <div className="font-mono text-xs md:text-sm tracking-widest shrink-0 ml-4">
                    Page {currentSlide + 1} / {totalSlides}
                </div>
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
                    <span className="uppercase">
                        © 2026 Built with <a href="https://www.atlassian.com/software/rovo-dev" target="_blank" rel="noreferrer" className="hover:text-vermillion transition-colors border-b border-transparent hover:border-vermillion">RovoDev</a> &amp; <a href="https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design" target="_blank" rel="noreferrer" className="hover:text-vermillion transition-colors border-b border-transparent hover:border-vermillion">Claude Skills</a>
                    </span>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
                    <button
                        onClick={() => setCommentsPanelOpen(true)}
                        className="flex items-center gap-2 uppercase whitespace-nowrap hover:text-vermillion transition-colors border-b border-ink-soft hover:border-vermillion py-1 cursor-pointer"
                        aria-label="Open comments"
                    >
                        <MessageSquare size={14} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Comments</span>
                    </button>
                    <a href="https://sidc.ai" target="_blank" rel="noreferrer" className="uppercase whitespace-nowrap hover:text-vermillion transition-colors border-b border-ink-soft hover:border-vermillion">
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
    );
}
