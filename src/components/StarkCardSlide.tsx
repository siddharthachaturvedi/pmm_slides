import { motion } from 'framer-motion';

export function StarkCardSlide({ slide }: { slide: any }) {
    const card = slide.card || {};
    const fields = card.fields || [];

    return (
        <div className="flex flex-col h-full w-full justify-center items-center py-8">
            {/* The Claim Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl border-[2px] border-ink bg-white"
            >
                {/* Card Header */}
                <div className="bg-ink text-white px-8 py-5 flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-mono uppercase tracking-widest font-bold">
                        {card.type || 'Claim Card'}
                    </h3>
                    <span className="text-sm md:text-base font-mono uppercase tracking-wider opacity-70">
                        {card.id || 'CC-001'}
                    </span>
                </div>

                {/* Card Claim */}
                <div className="px-8 py-6 border-b-[1.5px] border-ink">
                    <div className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-2">Claim</div>
                    <p className="text-lg md:text-2xl font-serif font-bold text-ink leading-snug">
                        {card.claim || 'No claim specified'}
                    </p>
                </div>

                {/* Card Fields Grid */}
                <div className="grid grid-cols-2">
                    {fields.map((field: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + (i * 0.08) }}
                            className={`px-8 py-5 border-b-[1px] border-ink ${i % 2 === 0 ? 'border-r-[1px]' : ''}`}
                        >
                            <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-ink-soft mb-1">
                                {field.label}
                            </div>
                            <div className={`text-sm md:text-lg font-sans text-ink ${field.highlight ? 'font-bold' : ''} ${field.danger ? 'text-red-700 font-bold' : ''}`}>
                                {field.value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Card Verdict */}
                {card.verdict && (
                    <div className={`px-8 py-5 text-center font-mono uppercase tracking-widest text-sm md:text-base font-bold ${card.verdictPass ? 'bg-green-50 text-green-900 border-t-[2px] border-green-900' : 'bg-red-50 text-red-900 border-t-[2px] border-red-900'}`}>
                        {card.verdict}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
