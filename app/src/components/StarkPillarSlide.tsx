import { motion } from 'framer-motion';

export function StarkPillarSlide({ slide }: { slide: any }) {
    // Expects slide to have a `pillars` array
    const pillars = slide.pillars || [];
    const roof = slide.roof;

    return (
        <div className="flex flex-col h-full w-full pt-8 pb-12">

            {/* The Roof (Overarching Strategy / Goal) */}
            {roof && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full border-[2px] border-ink py-6 md:py-8 px-8 text-center bg-white z-10 relative mb-8"
                >
                    <h2 className="text-2xl md:text-4xl font-black font-serif text-ink uppercase tracking-wide">
                        {roof}
                    </h2>
                </motion.div>
            )}

            {/* The Pillars */}
            <div className={`grid gap-6 md:gap-12 flex-1 w-full`}
                style={{ gridTemplateColumns: `repeat(${pillars.length || 3}, minmax(0, 1fr))` }}>
                {pillars.map((pillar: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                        className="flex flex-col border-[1.5px] border-ink h-full p-6 md:p-8 bg-white relative"
                    >
                        {/* Number Indicator */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full border-2 border-ink bg-white flex items-center justify-center font-mono font-bold text-ink text-sm">
                            {i + 1}
                        </div>

                        {/* Pillar Header */}
                        <div className="border-b-[1.5px] border-ink pb-4 mb-6 mt-2">
                            <h3 className="text-xl md:text-2xl font-serif font-black text-ink">{pillar.title}</h3>
                        </div>

                        {/* Pillar Content Line Items */}
                        <div className="flex flex-col space-y-4">
                            {pillar.items?.map((item: string, j: number) => (
                                <div key={j} className="flex items-start text-ink-soft text-lg md:text-xl">
                                    <span className="mr-3 font-bold text-ink">&bull;</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* The Foundation (Optional) */}
            {slide.foundation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-full border-t-[2px] border-b-[2px] border-ink py-4 px-8 text-center bg-gray-50 mt-8"
                >
                    <h3 className="text-lg md:text-xl font-sans uppercase tracking-widest font-bold text-ink-soft">
                        {slide.foundation}
                    </h3>
                </motion.div>
            )}
        </div>
    );
}
