import { motion } from 'framer-motion';

// Splits a quadrant string on the first ':' into {label, desc}
function splitQuadrant(text: string) {
    const idx = text.indexOf(':');
    if (idx === -1) return { label: text, desc: '' };
    return { label: text.slice(0, idx).trim(), desc: text.slice(idx + 1).trim() };
}

export function StarkMatrixSlide({ slide }: { slide: any }) {
    const m = slide.matrix || { xAxis: 'X Axis', yAxis: 'Y Axis', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4' };
    const q1 = splitQuadrant(m.q1);
    const q2 = splitQuadrant(m.q2);
    const q3 = splitQuadrant(m.q3);
    const q4 = splitQuadrant(m.q4);

    return (
        <div className="flex flex-col h-full w-full justify-center items-center py-12 px-8">
            <div className="relative w-full max-w-4xl">

                {/* Flex row: Y-axis label OUTSIDE the matrix, then the matrix */}
                <div className="flex items-center w-full">

                    {/* Y Axis Label — sits completely outside the box */}
                    <div className="shrink-0 mr-6 md:mr-10">
                        <div className="transform -rotate-90 origin-center text-sm md:text-lg font-mono tracking-widest uppercase text-ink-soft whitespace-nowrap">
                            {m.yAxis} &rarr;
                        </div>
                    </div>

                    {/* Matrix Grid Core */}
                    <div className="grid grid-cols-2 grid-rows-2 w-full aspect-[4/3] md:aspect-video border-[2px] border-ink">

                        {/* Top Left - Q2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="border-r-[1px] border-b-[1px] border-ink p-4 md:p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 overflow-hidden"
                        >
                            <span className="text-sm md:text-lg font-mono uppercase tracking-wider text-ink-soft mb-1">{q2.label}</span>
                            {q2.desc && <span className="text-xs md:text-base font-sans text-ink-soft/70 leading-snug">{q2.desc}</span>}
                        </motion.div>

                        {/* Top Right - Q1 (Target) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="border-b-[1px] border-l-[1px] border-ink p-4 md:p-8 flex flex-col items-center justify-center text-center overflow-hidden"
                        >
                            <span className="text-sm md:text-lg font-mono uppercase tracking-wider font-bold text-ink mb-1">{q1.label}</span>
                            {q1.desc && <span className="text-xs md:text-base font-serif font-bold text-ink leading-snug">{q1.desc}</span>}
                        </motion.div>

                        {/* Bottom Left - Q3 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="border-r-[1px] border-t-[1px] border-ink p-4 md:p-8 flex flex-col items-center justify-center text-center overflow-hidden"
                        >
                            <span className="text-sm md:text-lg font-mono uppercase tracking-wider text-ink-soft mb-1">{q3.label}</span>
                            {q3.desc && <span className="text-xs md:text-base font-sans text-ink-soft/70 leading-snug">{q3.desc}</span>}
                        </motion.div>

                        {/* Bottom Right - Q4 (Danger) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="border-l-[1px] border-t-[1px] border-ink p-4 md:p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 overflow-hidden"
                        >
                            <span className="text-sm md:text-lg font-mono uppercase tracking-wider text-ink-soft mb-1">{q4.label}</span>
                            {q4.desc && <span className="text-xs md:text-base font-sans text-ink-soft/70 leading-snug">{q4.desc}</span>}
                        </motion.div>

                    </div>
                </div>

                {/* X Axis Label — centered below the matrix */}
                <div className="text-center mt-8 text-sm md:text-lg font-mono tracking-widest uppercase text-ink-soft">
                    {m.xAxis} &rarr;
                </div>
            </div>
        </div>
    );
}
