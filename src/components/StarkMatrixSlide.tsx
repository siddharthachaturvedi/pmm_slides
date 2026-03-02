import { motion } from 'framer-motion';

export function StarkMatrixSlide({ slide }: { slide: any }) {
    // Expects slide to have a `matrix` object with axes and quadrants
    // matrix: { xAxis: string, yAxis: string, q1: string, q2: string, q3: string, q4: string }
    const m = slide.matrix || { xAxis: 'X Axis', yAxis: 'Y Axis', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4' };

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
                    <div className="grid grid-cols-2 grid-rows-2 w-full aspect-square md:aspect-video border-[2px] border-ink">

                        {/* Top Left - Q2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="border-r-[1px] border-b-[1px] border-ink p-6 md:p-12 flex items-center justify-center text-center bg-gray-50/50"
                        >
                            <span className="text-lg md:text-2xl font-serif text-ink">{m.q2}</span>
                        </motion.div>

                        {/* Top Right - Q1 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="border-b-[1px] border-l-[1px] border-ink p-6 md:p-12 flex items-center justify-center text-center"
                        >
                            <span className="text-lg md:text-2xl font-serif font-bold text-ink">{m.q1}</span>
                        </motion.div>

                        {/* Bottom Left - Q3 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="border-r-[1px] border-t-[1px] border-ink p-6 md:p-12 flex items-center justify-center text-center"
                        >
                            <span className="text-lg md:text-2xl font-serif text-ink-soft">{m.q3}</span>
                        </motion.div>

                        {/* Bottom Right - Q4 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="border-l-[1px] border-t-[1px] border-ink p-6 md:p-12 flex items-center justify-center text-center bg-gray-50/50"
                        >
                            <span className="text-lg md:text-2xl font-serif text-ink">{m.q4}</span>
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
