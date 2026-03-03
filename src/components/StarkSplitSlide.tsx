import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { RovoIcon } from '@atlaskit/logo';

interface SplitSide {
    label: string;
    body: string;
    details?: string[];
}

export function StarkSplitSlide({ slide, isBackward }: { slide: any; isBackward?: boolean }) {
    const left: SplitSide = slide.split?.left || { label: 'Danger', body: '' };
    const right: SplitSide = slide.split?.right || { label: 'Safe', body: '' };
    const skip = isBackward;

    const [step, setStep] = useState(skip ? 4 : 0);

    // Auto-advance the sequence but pause at step 2
    useEffect(() => {
        if (skip) return;

        let timer: ReturnType<typeof setTimeout>;
        if (step === 0) {
            timer = setTimeout(() => setStep(1), 800);
        } else if (step === 1) {
            timer = setTimeout(() => setStep(2), 1400);
        } else if (step === 3) {
            timer = setTimeout(() => setStep(4), 600);
        }

        return () => clearTimeout(timer);
    }, [step, skip]);

    const advanceSequence = useCallback(() => {
        if (step < 2) {
            setStep(2); // Fast forward to the danger state
        } else if (step === 2) {
            setStep(3); // Triggers the auto-advance to step 4
        }
    }, [step]);

    // Intercept presentation forward navigation to advance animation steps instead of changing slides
    useEffect(() => {
        if (skip || step >= 4) return;

        const handleNextRequest = (e: Event) => {
            e.preventDefault(); // stops the slide from changing in App.tsx
            advanceSequence();
        };

        window.addEventListener('requestNextSlide', handleNextRequest);
        return () => window.removeEventListener('requestNextSlide', handleNextRequest);
    }, [step, skip, advanceSequence]);

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto py-4 cursor-pointer" onClick={advanceSequence}>

            {/* AI Generator Header */}
            <motion.div
                initial={{ opacity: skip ? 1 : 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-brand/5 border border-brand/20 p-4 rounded-card mb-6 shrink-0"
            >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
                    <RovoIcon size="small" />
                </div>
                <div className="flex-1 font-mono text-sm md:text-base text-ink font-medium">
                    {/* Simulated Prompt Typing */}
                    {step === 0 ? (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block"
                        >
                            Generating response matching brand guidelines... <span className="animate-pulse">|</span>
                        </motion.span>
                    ) : (
                        <span>Generate: {left.label.replace('Fails ', '').replace('Ships without ', '')}</span>
                    )}
                </div>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                {/* DANGER / INITIAL GENERATION */}
                <AnimatePresence>
                    {(step >= 1) && (
                        <motion.div
                            initial={skip ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, filter: step >= 3 ? 'blur(2px) grayscale(100%)' : 'none' }}
                            transition={{ duration: 0.4 }}
                            className={`flex-1 flex flex-col p-6 md:p-8 rounded-card border-2 relative overflow-hidden transition-all duration-700
                                ${step >= 3 ? 'bg-gray-50 border-line opacity-40' : 'bg-white border-line shadow-raised'}
                            `}
                        >
                            {/* Intervention overlay */}
                            <AnimatePresence>
                                {step >= 2 && step < 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute top-4 right-4 bg-vermillion text-white px-3 py-1.5 rounded-badge font-bold font-sans text-xs flex items-center gap-1 shadow-overlay z-10"
                                    >
                                        <AlertTriangle size={14} />
                                        FLAGGED: {left.label}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-2 mb-4 text-ink-soft opacity-60">
                                <span className="w-6 h-6 rounded-full bg-ink/10 flex items-center justify-center text-xs">AI</span>
                                <span className="font-mono text-xs uppercase tracking-widest">Draft 1</span>
                            </div>

                            <p className="text-lg md:text-xl font-serif text-ink leading-relaxed mb-6">
                                "{left.body}"
                            </p>

                            {left.details && left.details.length > 0 && (
                                <ul className="space-y-3 mt-auto pt-4 border-t border-line/50">
                                    {left.details.map((d: string, i: number) => (
                                        <motion.li
                                            initial={skip ? false : { opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            key={i}
                                            className="text-xs md:text-sm font-sans text-ink-soft flex items-start gap-2"
                                        >
                                            <span className="text-vermillion mt-0.5 font-bold">×</span>
                                            <span>{d}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ARROW INDICATOR */}
                <AnimatePresence>
                    {step >= 3 && (
                        <motion.div
                            initial={skip ? false : { opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="hidden md:flex items-center justify-center shrink-0 z-10"
                        >
                            <div className="w-10 h-10 rounded-full bg-line flex items-center justify-center border-2 border-white shadow-raised">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SAFE / CORRECTED GENERATION */}
                <AnimatePresence>
                    {(step >= 3) && (
                        <motion.div
                            initial={skip ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="flex-1 flex flex-col p-6 md:p-8 rounded-card border-2 border-forest/30 bg-forest/5 shadow-overlay relative"
                        >
                            <div className="absolute top-4 right-4 bg-forest text-white px-3 py-1.5 rounded-badge font-bold font-sans text-xs flex items-center gap-1">
                                <CheckCircle size={14} />
                                {right.label}
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-forest">
                                <RovoIcon size="small" />
                                <span className="font-mono text-xs uppercase tracking-widest font-bold">Corrected Output</span>
                            </div>

                            <p className="text-lg md:text-xl font-serif text-ink font-bold leading-relaxed mb-6">
                                "{right.body}"
                            </p>

                            {right.details && right.details.length > 0 && (
                                <ul className="space-y-3 mt-auto pt-4 border-t border-forest/20">
                                    {right.details.map((d: string, i: number) => (
                                        <motion.li
                                            initial={skip ? false : { opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            key={i}
                                            className="text-xs md:text-sm font-sans text-ink flex items-start gap-2"
                                        >
                                            <span className="text-forest mt-0.5 font-bold">✓</span>
                                            <span className="font-medium">{d}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
