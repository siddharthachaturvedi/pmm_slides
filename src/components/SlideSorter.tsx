import { X } from 'lucide-react';

// Define the slide content structure properly
interface SlideContent {
    title?: string;
    lead?: string;
    phase?: string;
    subtitle?: string;
    type?: string;
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

export function SlideSorter({ slides, isOpen, onClose, onSelectSlide, currentSlideIndex }: SlideSorterProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-ink/10 shrink-0 bg-white">
                <h2 className="font-serif text-2xl font-bold text-ink">Slide Sorter</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-ink-soft/10 rounded-full transition-colors opacity-70 hover:opacity-100"
                    aria-label="Close Slide Sorter"
                >
                    <X size={24} />
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
                  relative flex flex-col items-start text-left h-32 md:h-40 p-4 border transition-all duration-200 group
                  ${isCurrent
                                        ? 'border-vermillion bg-vermillion/5 shadow-sm'
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

                                {/* Slide Title */}
                                <div className="font-serif text-sm md:text-base font-bold text-ink leading-tight line-clamp-2 mt-1 w-full relative z-10 group-hover:text-ink transition-colors">
                                    {slide.title || "Untitled Slide"}
                                </div>

                                {/* Phase Indicator */}
                                {slide.phase && (
                                    <div className={`
                    text-[9px] uppercase tracking-widest font-bold mt-auto pt-2
                    ${slide.phase.toLowerCase() === 'peril' ? 'text-vermillion/70' :
                                            slide.phase.toLowerCase() === 'path' || slide.phase.toLowerCase() === 'promise' ? 'text-forest/70' :
                                                'text-ink-soft/70'}
                  `}>
                                        {slide.phase}
                                    </div>
                                )}

                                {/* Thumbnail Visual Hint (Abstract representation) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity bg-gradient-to-br from-transparent to-ink/20" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
