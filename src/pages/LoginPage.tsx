import { motion } from 'framer-motion';
import { useMockWallet } from '../hooks/useMockWallet';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginPage() {
    const { connect, isConnected } = useMockWallet();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected) {
            navigate('/dashboard');
        }
    }, [isConnected, navigate]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.1),transparent_50%)]" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center"
            >
                <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="mb-6 text-8xl"
                >
                    🐱❄️
                </motion.div>
                
                <h1 className="mb-2 text-5xl font-bold tracking-tighter text-primary">
                    Snowcat
                </h1>
                <p className="mb-8 text-lg text-muted">
                    Clean your wallet dust. Groom your assets.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={connect}
                    className="group relative overflow-hidden rounded-full bg-primary px-8 py-4 text-lg font-bold text-background transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                >
                    <span className="relative z-10">Enter the Den</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </motion.button>
            </motion.div>

            <div className="absolute bottom-8 text-xs text-muted/50">
                Powered by Avalanche • Mock Mode Active
            </div>
        </div>
    );
}
