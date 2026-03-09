import { AnimatePresence, motion } from 'framer-motion';
import CrossIcon from '@atlaskit/icon/core/cross';

// Define the slide content structure properly
interface SlideContent {
    title?: string;
    lead?: string;
    phase?: string;
    subtitle?: string;
    type?: string;
    imageSrc?: string;
    roof?: string;
    foundation?: string;
    preamble?: string;
    preambleBody?: string;
    source?: string;
    link?: string;
    leftTheme?: string;
    rightTheme?: string;
    bullets?: Array<any>;
    footnotes?: Array<string>;
    matrix?: {
        xAxis?: string;
        yAxis?: string;
        q1?: string;
        q2?: string;
        q3?: string;
        q4?: string;
    };
    pillars?: Array<{ title: string, items: string[] }>;
    gridData?: {
        columns: string[];
        rows: Array<{ name: string, scores: number[] }>;
    };
    split?: {
        left: any;
        right: any;
    };
    card?: any;
}

interface SlideSorterProps {
    slides: SlideContent[];
    isOpen: boolean;
    onClose: () => void;
    onSelectSlide: (index: number) => void;
    currentSlideIndex: number;
}

/** Returns an abstract visual "silhouette" representing the slide type */
function SlideThumbnail({ slide }: { slide: SlideContent }) {
    const type = slide.type || 'text';

    if (type === 'image') {
        return (
            <div className="flex items-center justify-center h-10 w-14 border border-ink/30 shrink-0 overflow-hidden bg-ink/5">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-ink/30">
                    <rect x="0.5" y="0.5" width="15" height="11" rx="1" stroke="currentColor" />
                    <circle cx="5" cy="4" r="1.5" fill="currentColor" />
                    <path d="M2 10l3.5-4 2.5 3 2-2L14 10H2z" fill="currentColor" />
                </svg>
            </div>
        );
    }
    if (type === 'title') {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-1 py-2">
                <div className="w-10 h-1.5 bg-ink/30 mb-1" />
                <div className="w-16 h-1 bg-ink/20" />
                <div className="w-10 h-0.5 bg-ink/10 mt-1" />
            </div>
        );
    }
    if (type === 'matrix') {
        return (
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-14 h-10 border border-ink/30 shrink-0">
                <div className="bg-ink/10 border-r border-b border-ink/20" />
                <div className="bg-ink/25 border-b border-ink/20" />
                <div className="bg-ink/10 border-r border-ink/20" />
                <div className="bg-ink/10" />
            </div>
        );
    }
    if (type === 'pillar') {
        const n = slide.pillars?.length || 3;
        return (
            <div className="flex items-end gap-0.5 h-10 w-14 shrink-0">
                {Array.from({ length: Math.min(n, 5) }).map((_, i) => (
                    <div key={i} className="flex-1 bg-ink/25 border border-ink/20" style={{ height: `${60 + (i % 3) * 15}%` }} />
                ))}
            </div>
        );
    }
    if (type === 'grid') {
        const cols = slide.gridData?.columns?.length || 4;
        const rows = slide.gridData?.rows?.length || 4;
        return (
            <div className="border border-ink/30 w-14 h-10 shrink-0 overflow-hidden">
                <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${Math.min(cols + 1, 6)}, 1fr)`, gridTemplateRows: `repeat(${Math.min(rows + 1, 5)}, 1fr)` }}>
                    {Array.from({ length: (Math.min(cols + 1, 6)) * (Math.min(rows + 1, 5)) }).map((_, i) => (
                        <div key={i} className={`border-r border-b border-ink/10 ${i < Math.min(cols + 1, 6) || i % Math.min(cols + 1, 6) === 0 ? 'bg-ink/10' : ''}`} />
                    ))}
                </div>
            </div>
        );
    }
    if (type === 'split') {
        return (
            <div className="flex h-10 w-14 border border-ink/30 shrink-0 overflow-hidden">
                <div className="w-1/2 border-r border-ink/20 flex flex-col gap-0.5 p-1">
                    <div className="h-1 bg-vermillion/40 w-full" />
                    <div className="h-0.5 bg-ink/20 w-3/4" />
                    <div className="h-0.5 bg-ink/15 w-1/2" />
                </div>
                <div className="w-1/2 flex flex-col gap-0.5 p-1">
                    <div className="h-1 bg-forest/40 w-full" />
                    <div className="h-0.5 bg-ink/20 w-3/4" />
                    <div className="h-0.5 bg-ink/15 w-1/2" />
                </div>
            </div>
        );
    }
    if (type === 'data') {
        return (
            <div className="flex items-end gap-1 h-10 w-14 shrink-0 border-b border-l border-ink/30 px-1">
                {[40, 65, 50, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-ink/20" style={{ height: `${h}%` }} />
                ))}
            </div>
        );
    }
    if (type === 'card') {
        return (
            <div className="grid grid-cols-2 gap-0.5 w-14 h-10 shrink-0">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="border border-ink/20 bg-ink/5 flex flex-col gap-0.5 p-0.5">
                        <div className="h-0.5 w-full bg-ink/25" />
                        <div className="h-0.5 w-2/3 bg-ink/15" />
                    </div>
                ))}
            </div>
        );
    }
    // text (default)
    return (
        <div className="flex h-10 w-14 shrink-0 gap-1">
            <div className="w-1/3 flex flex-col gap-0.5 py-0.5">
                <div className="h-1.5 w-full bg-ink/30" />
                <div className="h-0.5 w-full bg-ink/15" />
            </div>
            <div className="flex-1 border-l border-ink/20 pl-1 flex flex-col gap-0.5 py-0.5">
                <div className="h-0.5 w-full bg-ink/15" />
                <div className="h-0.5 w-3/4 bg-ink/15" />
                <div className="h-0.5 w-full bg-ink/15" />
                <div className="h-0.5 w-2/3 bg-ink/15" />
            </div>
        </div>
    );
}

export function SlideSorter({ slides, isOpen, onClose, onSelectSlide, currentSlideIndex }: SlideSorterProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-ink/10 shrink-0 bg-white">
                        <h2 className="font-serif text-2xl font-bold text-ink">Slide Sorter</h2>
                        {/* #8: square close button — no rounded-full */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-ink hover:text-white transition-colors opacity-70 hover:opacity-100"
                            aria-label="Close Slide Sorter"
                        >
                            <CrossIcon label="Close" size="medium" />
                        </button>
                    </div>

                    {/* Grid Container */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-16">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                            {slides.map((slide, index) => {
                                const isCurrent = index === currentSlideIndex;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            onSelectSlide(index);
                                            onClose();
                                        }}
                                        className={`
                      relative flex flex-col items-start text-left h-36 md:h-44 p-4 border transition-all duration-200 group
                      ${isCurrent
                                                ? 'border-vermillion bg-vermillion/5'
                                                : 'border-line bg-white hover:border-ink/30 hover:shadow-md'
                                            }
                    `}
                                    >
                                        {/* Slide Number */}
                                        <div className={`
                      text-[10px] font-mono mb-2
                      ${isCurrent ? 'text-vermillion font-bold' : 'text-ink-soft'}
                    `}>
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        {/* Type-aware visual thumbnail — #1 */}
                                        <div className={`mb-2 transition-opacity ${isCurrent ? 'opacity-80' : 'opacity-40 group-hover:opacity-70'}`}>
                                            <SlideThumbnail slide={slide} />
                                        </div>

                                        {/* Slide Title */}
                                        <div className="font-serif text-xs md:text-sm font-bold text-ink leading-tight line-clamp-2 mt-auto w-full relative z-10 group-hover:text-ink transition-colors">
                                            {slide.title || "Untitled Slide"}
                                        </div>

                                        {/* Phase Indicator */}
                                        {slide.phase && (
                                            <div className={`
                        text-[9px] uppercase tracking-widest font-bold mt-1
                        ${slide.phase.toLowerCase() === 'peril' ? 'text-vermillion/70' :
                                                    slide.phase.toLowerCase() === 'path' || slide.phase.toLowerCase() === 'promise' ? 'text-forest/70' :
                                                        'text-ink-soft/70'}
                      `}>
                                                {slide.phase}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
