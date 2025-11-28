import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function useWindowSizeHook() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

interface AvalancheConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
}

interface Snowflake {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

export function AvalancheConfetti({ isActive, onComplete }: AvalancheConfettiProps) {
    const { width, height } = useWindowSizeHook();
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        if (isActive) {
            // Generate snowflakes
            const flakes: Snowflake[] = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                x: Math.random() * width,
                y: -20 - Math.random() * 100,
                size: 10 + Math.random() * 20,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2
            }));
            setSnowflakes(flakes);

            // Show logo after 1 second
            const logoTimer = setTimeout(() => setShowLogo(true), 1000);

            // Complete animation after 4 seconds
            const completeTimer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 4000);

            return () => {
                clearTimeout(logoTimer);
                clearTimeout(completeTimer);
            };
        } else {
            setSnowflakes([]);
            setShowLogo(false);
        }
    }, [isActive, width, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Snowflakes falling */}
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute text-white/80"
                    style={{
                        left: flake.x,
                        fontSize: flake.size,
                    }}
                    initial={{ y: flake.y, opacity: 1 }}
                    animate={{ 
                        y: height + 50,
                        opacity: 0,
                        rotate: 360
                    }}
                    transition={{
                        duration: flake.duration,
                        delay: flake.delay,
                        ease: 'linear'
                    }}
                >
                    ❄️
                </motion.div>
            ))}

            {/* Snowcat logo sweeping across */}
            <AnimatePresence>
                {showLogo && (
                    <motion.div
                        className="absolute"
                        initial={{ x: -200, y: height / 2 - 50 }}
                        animate={{ x: width + 200 }}
                        transition={{
                            duration: 2.5,
                            ease: 'easeInOut'
                        }}
                    >
                        <motion.img
                            src="/snowcat.png"
                            alt="Snowcat"
                            className="h-24 w-auto drop-shadow-2xl"
                            animate={{
                                rotate: [0, -10, 0, 10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: 4,
                                ease: 'easeInOut'
                            }}
                        />
                        {/* Cleaning trail effect */}
                        <motion.div
                            className="absolute top-0 left-0 h-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            style={{ width: 300, marginLeft: -150 }}
                            animate={{
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Snow accumulation at bottom (gets cleared by logo) */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: showLogo ? 0 : 1 }}
                transition={{ duration: 1 }}
            />
        </div>
    );
}
