import { motion } from 'framer-motion';

// Helper component for a single Harvey Ball
function HarveyBall({ score }: { score: number }) {
    // Score should be 0, 1, 2, 3, or 4 (empty to full)
    const normalizedScore = Math.max(0, Math.min(4, Math.floor(score)));

    return (
        <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full border-[2px] border-ink bg-white overflow-hidden flex-shrink-0">
            {/* Shading logic via simple absolute divs */}
            {normalizedScore >= 1 && (
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-ink" />
            )}
            {normalizedScore >= 2 && (
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-ink" />
            )}
            {normalizedScore >= 3 && (
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-ink" />
            )}
            {normalizedScore === 4 && (
                <div className="absolute inset-0 bg-ink" />
            )}
            {/* Crosshairs to maintain the rigid structural look */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-ink opacity-20" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-ink opacity-20" />
        </div>
    );
}

export function StarkGridSlide({ slide }: { slide: any }) {
    // Expects slide to have a `gridData` object:
    // { columns: ['Crit 1', 'Crit 2'], rows: [ { name: 'Vendor 1', scores: [4, 2] } ] }
    const gd = slide.gridData || { columns: [], rows: [] };

    return (
        <div className="flex flex-col h-full w-full justify-center pt-8 pb-12 max-w-6xl mx-auto">

            <div className="w-full border-t-[2px] border-l-[2px] border-r-[2px] border-ink overflow-x-auto">
                <table className="w-full text-left border-collapse">

                    {/* Header Row */}
                    <thead>
                        <tr>
                            <th className="p-4 md:p-6 border-b-[2px] border-r-[1.5px] border-ink bg-gray-50/50 min-w-[200px]">
                                <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-ink-soft">
                                    Capability / Dimension
                                </span>
                            </th>
                            {gd.columns.map((col: string, i: number) => (
                                <th key={i} className={`p-4 md:p-6 border-b-[2px] border-ink text-center align-bottom ${i < gd.columns.length - 1 ? 'border-r-[1.5px]' : ''}`}>
                                    <span className="text-sm md:text-lg font-serif font-bold text-ink leading-tight block transform -rotate-45 md:rotate-0 origin-bottom-left md:origin-center whitespace-nowrap md:whitespace-normal">
                                        {col}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Data Rows */}
                    <tbody>
                        {gd.rows.map((row: any, i: number) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * i }}
                                className="border-b-[1.5px] border-ink hover:bg-gray-50/30 transition-colors"
                            >
                                <td className="p-4 md:p-6 border-r-[1.5px] border-ink font-serif text-lg md:text-2xl text-ink font-bold">
                                    {row.name}
                                </td>
                                {row.scores.map((score: number, j: number) => (
                                    <td key={j} className={`p-4 md:p-6 text-center ${j < row.scores.length - 1 ? 'border-r-[1.5px] border-ink' : ''}`}>
                                        <div className="flex justify-center items-center w-full h-full">
                                            <HarveyBall score={score} />
                                        </div>
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Grid Legend */}
            <div className="flex justify-end space-x-6 mt-6 mr-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-ink-soft uppercase tracking-wide">
                    <HarveyBall score={0} /> <span>None</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-ink-soft uppercase tracking-wide">
                    <HarveyBall score={2} /> <span>Partial</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-ink-soft uppercase tracking-wide">
                    <HarveyBall score={4} /> <span>Full</span>
                </div>
            </div>

        </div>
    );
}
