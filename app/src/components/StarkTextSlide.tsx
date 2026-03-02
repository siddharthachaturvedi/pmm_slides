import { motion } from 'framer-motion';

export function StarkTextSlide({ slide }: { slide: any }) {
    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-16 h-auto md:h-full items-start md:items-center py-8 md:py-0">
            {/* Title / Premise (Left 5 cols) */}
            <div className="w-full md:col-span-5 flex flex-col md:pr-8 h-auto md:h-full justify-start md:justify-center">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black font-serif leading-tight mb-6 md:mb-8"
                >
                    {slide.title}
                </motion.h1>
                {slide.subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-xl sm:text-2xl text-ink-soft font-sans border-l-4 border-ink pl-4 sm:pl-6"
                    >
                        {slide.subtitle}
                    </motion.p>
                )}
                {slide.link && (
                    <motion.a
                        href={slide.link}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-8 text-sm md:text-base font-mono uppercase tracking-widest text-ink font-bold border-b border-ink self-start hover:text-ink-soft hover:border-ink-soft transition-colors"
                    >
                        View External Source ↗
                    </motion.a>
                )}
            </div>

            {/* Supporting Evidence / Bullets (Right 7 cols) */}
            <div className="w-full md:col-span-7 h-auto md:h-full flex flex-col justify-start md:justify-center border-t-[1.5px] md:border-t-0 md:border-l-[1.5px] border-ink pt-8 md:pt-0 md:pl-16 mt-4 md:mt-0">
                {slide.bullets && slide.bullets.length > 0 && (
                    <div className="space-y-8 md:space-y-12">
                        {slide.bullets.map((bullet: string | any, i: number) => {
                            const isString = typeof bullet === 'string';
                            const title = isString ? bullet.split(':')[0] : bullet.title || bullet.name;
                            const description = isString ? bullet.split(':').slice(1).join(':').trim() : bullet.description || bullet.detail;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                                    className="flex items-start"
                                >
                                    <div className="mr-4 md:mr-6 font-mono font-bold text-ink rounded-full border border-ink w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 mt-1 text-sm sm:text-base">
                                        {i + 1}
                                    </div>
                                    <div>
                                        {isString && title && bullet.includes(':') && (
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink mb-2">
                                                {title}:
                                            </h3>
                                        )}
                                        {description && (
                                            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-ink-soft">
                                                {description}
                                            </p>
                                        )}
                                        {/* If it was a string without colon, just render it beautifully large */}
                                        {isString && !bullet.includes(':') && (
                                            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-serif text-ink mt-1 md:mt-2">
                                                {bullet}
                                            </p>
                                        )}
                                        {/* If it's an object without description */}
                                        {!description && !isString && (
                                            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-ink">
                                                {title}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
