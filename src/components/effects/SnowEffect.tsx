import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Snowflake {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
}

export function SnowEffect() {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        // Generate random snowflakes
        const count = 100; // Not too heavy
        const flakes = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position 0-100%
            delay: Math.random() * 5, // Random start delay
            duration: 10 + Math.random() * 10, // Slow fall 10-20s
            size: 2 + Math.random() * 4, // Random size 2-6px
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute rounded-full bg-white/20 dark:bg-white/10"
                    style={{
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                    }}
                    initial={{ top: -20, opacity: 0 }}
                    animate={{ 
                        top: '110%', 
                        opacity: [0, 1, 0.5, 0],
                        x: [0, Math.random() * 50 - 25, 0] // Gentle sway
                    }}
                    transition={{
                        duration: flake.duration,
                        delay: flake.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}
