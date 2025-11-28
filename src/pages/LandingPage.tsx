import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snowflake } from 'lucide-react';

export function LandingPage() {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected) {
            navigate('/dashboard');
        }
    }, [isConnected, navigate]);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/5 pointer-events-none" />
            
            {/* Animated Snowflakes (CSS/SVG) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
                        animate={{ 
                            y: window.innerHeight + 100, 
                            x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 5 + Math.random() * 10, 
                            repeat: Infinity, 
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        className="absolute top-0 text-primary"
                    >
                        <Snowflake size={10 + Math.random() * 20} />
                    </motion.div>
                ))}
            </div>

            <div className=" bg-surface/80 shadow-2xl rounded-3xl p-12 relative z-10 text-center space-y-8 p-6 max-w-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-6 rounded-3xl backdrop-blur-xl">
                        <img src="/snowcat.png" alt="Snowcat" className="h-24 w-auto" />
                    </div>
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter text-primary"
                >
                    Snowcat
                </motion.h1>

                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl text-muted font-light"
                >
                    Clean your wallet from dust. <br/>
                    <span className="text-accent font-medium">Simple. Fast. Satisfying.</span>
                </motion.p>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex justify-center pt-8"
                >
                    <div className="scale-125">
                        <ConnectButton label="Connect Wallet" />
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 text-xs text-muted/50"
            >
                Built for Avalanche Fuji Testnet
            </motion.div>
        </div>
    );
}
