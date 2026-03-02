import { motion } from 'framer-motion';

interface SplitSide {
    label: string;
    body: string;
    details?: string[];
}

export function StarkSplitSlide({ slide }: { slide: any }) {
    const left: SplitSide = slide.split?.left || { label: '✗', body: '' };
    const right: SplitSide = slide.split?.right || { label: '✓', body: '' };
    const leftTheme = slide.leftTheme || 'default'; // 'tension' or 'default'
    const rightTheme = slide.rightTheme || 'default'; // 'resolution' or 'default'

    return (
        <div className="flex flex-col md:flex-row h-full w-full">

            {/* LEFT — Danger / Before */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`flex-1 flex flex-col justify-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-ink ${leftTheme === 'tension' ? 'bg-vermillion/5 border-t-2 border-t-vermillion md:border-t-0 md:border-l-2 md:border-l-vermillion' : 'bg-gray-50'
                    }`}
            >
                <div className="text-5xl md:text-7xl font-mono font-bold text-ink-soft/30 mb-4 md:mb-6">✗</div>
                <h3 className={`text-sm md:text-base font-mono uppercase tracking-widest mb-4 md:mb-6 ${leftTheme === 'tension' ? 'text-vermillion' : 'text-ink-soft'}`}>
                    {left.label}
                </h3>
                <p className="text-lg md:text-2xl font-serif text-ink leading-snug mb-6">
                    "{left.body}"
                </p>
                {left.details && left.details.length > 0 && (
                    <ul className="space-y-2">
                        {left.details.map((d: string, i: number) => (
                            <li key={i} className="text-xs md:text-sm font-mono text-ink-soft/70 flex items-start gap-2">
                                <span className="text-ink-soft/40 mt-0.5">—</span>
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>

            {/* RIGHT — Correct / After */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className={`flex-1 flex flex-col justify-center p-8 md:p-16 ${rightTheme === 'resolution' ? 'bg-forest/5 border-t-2 border-t-forest md:border-t-0 md:border-r-2 md:border-r-forest' : 'bg-white'
                    }`}
            >
                <div className="text-5xl md:text-7xl font-mono font-bold text-ink/20 mb-4 md:mb-6">✓</div>
                <h3 className={`text-sm md:text-base font-mono uppercase tracking-widest mb-4 md:mb-6 font-bold ${rightTheme === 'resolution' ? 'text-forest' : 'text-ink'}`}>
                    {right.label}
                </h3>
                <p className="text-lg md:text-2xl font-serif font-bold text-ink leading-snug mb-6">
                    "{right.body}"
                </p>
                {right.details && right.details.length > 0 && (
                    <ul className="space-y-2">
                        {right.details.map((d: string, i: number) => (
                            <li key={i} className="text-xs md:text-sm font-mono text-ink/70 flex items-start gap-2">
                                <span className="text-ink/40 mt-0.5">—</span>
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </div>
    );
}
