import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BurnEffectProps {
    isActive: boolean;
    onComplete?: () => void;
}

interface Flame {
    id: number;
    left: number;
    delay: number;
    duration: number;
    scale: number;
    maxHeight: number; // How high this flame goes (percentage)
}

export function BurnEffect({ isActive, onComplete }: BurnEffectProps) {
    const [flames, setFlames] = useState<Flame[]>([]);

    useEffect(() => {
        if (isActive) {
            // Generate many more flames for a dense effect
            const flameCount = 60;
            const newFlames: Flame[] = Array.from({ length: flameCount }, (_, i) => ({
                id: i,
                left: Math.random() * 100, // Random horizontal position
                delay: Math.random() * 0.5, // Stagger start times
                duration: 0.8 + Math.random() * 0.8, // Varying speeds
                scale: 0.8 + Math.random() * 1.5, // Varying sizes
                maxHeight: -20 + Math.random() * 60 // Some go to top (-20%), some stay lower
            }));
            setFlames(newFlames);

            // Complete after animation
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 2000); // Slightly longer to let fire burn

            return () => clearTimeout(timer);
        } else {
            setFlames([]);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
            {/* Dark overlay that fades in */}
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* Flames */}
            <AnimatePresence>
                {flames.map((flame) => (
                    <motion.div
                        key={flame.id}
                        className="absolute text-4xl origin-bottom"
                        style={{
                            left: `${flame.left}%`,
                        }}
                        initial={{ 
                            bottom: '-20%',
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{ 
                            bottom: `${100 - flame.maxHeight}%`, // Move up
                            opacity: [0, 1, 1, 0],
                            scale: [0, flame.scale, flame.scale * 0.8, 0],
                        }}
                        transition={{
                            duration: flame.duration,
                            delay: flame.delay,
                            ease: 'easeOut',
                            times: [0, 0.2, 0.8, 1]
                        }}
                    >
                        🔥
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Intense Smoke effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-gray-900/40 to-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            />
        </div>
    );
}
