import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BurnEffectProps {
    isActive: boolean;
    onComplete?: () => void;
}

interface Flame {
    id: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
    size: number;
}

export function BurnEffect({ isActive, onComplete }: BurnEffectProps) {
    const [flames, setFlames] = useState<Flame[]>([]);

    useEffect(() => {
        if (isActive) {
            // Generate flames
            const newFlames: Flame[] = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 100, // Percentage
                y: 100 - Math.random() * 30, // Start from bottom
                delay: Math.random() * 0.3,
                duration: 0.8 + Math.random() * 0.4,
                size: 20 + Math.random() * 20
            }));
            setFlames(newFlames);

            // Complete after animation
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);

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
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Flames */}
            <AnimatePresence>
                {flames.map((flame) => (
                    <motion.div
                        key={flame.id}
                        className="absolute text-2xl"
                        style={{
                            left: `${flame.x}%`,
                            fontSize: flame.size,
                        }}
                        initial={{ 
                            y: `${flame.y}%`,
                            opacity: 0,
                            scale: 0.5
                        }}
                        animate={{ 
                            y: '-20%',
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1.2, 1, 0.8],
                            rotate: [0, -10, 10, 0]
                        }}
                        transition={{
                            duration: flame.duration,
                            delay: flame.delay,
                            ease: 'easeOut'
                        }}
                    >
                        🔥
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Smoke effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-gray-600/30 via-gray-400/20 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Ash particles */}
            {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                    key={`ash-${i}`}
                    className="absolute w-1 h-1 bg-gray-400 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${50 + Math.random() * 50}%`,
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ 
                        opacity: [0, 0.6, 0],
                        y: -50 - Math.random() * 50,
                        x: (Math.random() - 0.5) * 30
                    }}
                    transition={{
                        duration: 1 + Math.random() * 0.5,
                        delay: 0.5 + Math.random() * 0.3,
                        ease: 'easeOut'
                    }}
                />
            ))}

            {/* Burn text */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="text-4xl font-bold text-orange-500 drop-shadow-lg">
                    ⚰️
                </div>
            </motion.div>
        </div>
    );
}
