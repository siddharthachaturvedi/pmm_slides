import { motion } from 'framer-motion';

export function StarkDataSlide({ slide, isBackward }: { slide: any; isBackward?: boolean }) {
    // Expects `chartData` to be an array: [{ label: 'Q1', value: 45, suffix: '%' }, { label: 'Q2', value: 75, suffix: '%' }]
    const data = slide.chartData || [];
    const skip = isBackward;

    // Find max value to determine relative heights of the bars
    const maxValue = Math.max(...data.map((d: any) => d.value), 1); // Avoid division by zero

    return (
        <div className="flex flex-col h-full w-full justify-center max-w-5xl mx-auto pt-8 pb-12">

            {/* The severe, no-Y-axis Bar Chart */}
            <div className="flex w-full h-[50vh] md:h-[500px] items-end border-b-[2px] border-ink space-x-2 md:space-x-6 pb-0">
                {data.map((item: any, i: number) => {
                    const heightPercent = (item.value / maxValue) * 100;

                    return (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative">

                            {/* Data Value Label (Top of Bar) */}
                            <motion.div
                                initial={skip ? false : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 + (i * 0.07), ease: "easeOut" }}
                                className="mb-3 text-lg sm:text-2xl md:text-4xl lg:text-5xl font-serif font-black text-ink whitespace-nowrap"
                            >
                                {item.prefix || ''}{item.value}{item.suffix || ''}
                            </motion.div>

                            {/* The Bar */}
                            <motion.div
                                initial={skip ? false : { height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.07 }}
                                className="w-full bg-ink relative"
                            >
                                {/* Micro-interaction overlay just to make it barely reactive */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex w-full space-x-2 md:space-x-6 pt-4 md:pt-6">
                {data.map((item: any, i: number) => (
                    <div key={i} className="flex-1 text-center">
                        <span className="text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-widest text-ink-soft block leading-tight">
                            {item.label}
                        </span>
                        {item.sublabel && (
                            <span className="text-[10px] font-sans text-ink-soft/70 block mt-1">
                                {item.sublabel}
                            </span>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}
