import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvalancheConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
    className?: string;
}

export function AvalancheConfetti({ isActive, onComplete, className = '' }: AvalancheConfettiProps) {
    const [showEffect, setShowEffect] = useState(false);
    const DURATION = 2; // seconds

    useEffect(() => {
        if (isActive) {
            setShowEffect(true);
            
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, DURATION * 1000);

            return () => clearTimeout(timer);
        } else {
            setShowEffect(false);
        }
    }, [isActive, onComplete]);

    if (!isActive && !showEffect) return null;

    return (
        <div className={`absolute inset-0 z-50 overflow-hidden rounded-xl pointer-events-none ${className}`}>
            <AnimatePresence>
                {showEffect && (
                    <motion.img
                        key="cleaning-animation"
                        src="/cleaning.png"
                        alt="Cleaning"
                        className="absolute top-0 h-full w-auto max-w-none object-contain"
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: DURATION, 
                            ease: 'linear' 
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
