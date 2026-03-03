import { motion } from 'framer-motion';

export function StarkTitleSlide({ slide, isBackward }: { slide: any; isBackward?: boolean }) {
    const skip = isBackward;
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center px-4 py-8 md:py-0">
            <motion.h1
                initial={skip ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif text-ink tracking-tight leading-none mb-8 md:mb-12"
            >
                {slide.title}
            </motion.h1>

            {slide.subtitle && (
                <motion.p
                    initial={skip ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="text-xl sm:text-2xl md:text-3xl font-sans text-ink-soft max-w-3xl leading-relaxed"
                >
                    {slide.subtitle}
                </motion.p>
            )}

            {/* Brutalist Divider */}
            <motion.div
                initial={skip ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="w-24 md:w-32 h-[2px] bg-ink mt-12 mb-12 md:mt-16 md:mb-16"
            />

            {slide.bullets && slide.bullets.length > 0 && (
                <motion.div
                    initial={skip ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                    className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0 text-sm md:text-lg font-mono tracking-widest uppercase text-ink-soft"
                >
                    {slide.bullets.map((b: string, i: number) => (
                        <span key={i}>{b}</span>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
