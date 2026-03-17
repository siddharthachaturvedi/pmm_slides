import { motion } from 'framer-motion';

export function StarkImageSlide({ slide, isBackward }: { slide: any; isBackward?: boolean }) {
    const skip = isBackward;
    return (
        <div className="flex items-center justify-center w-full h-full min-h-0 bg-white">
            <motion.img
                src={slide.imageSrc}
                alt={slide.title || 'Slide'}
                initial={skip ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="max-w-full max-h-full object-contain"
                draggable={false}
            />
        </div>
    );
}
