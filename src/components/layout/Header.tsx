import { useMockWallet } from '../../hooks/useMockWallet';
import { mockBackend } from '../../lib/mockBackend';
import { RotateCcw, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function Header() {
    const { isConnected, address, connect, disconnect } = useMockWallet();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or local storage
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const handleReset = () => {
        if (confirm('Reset all demo data? This will restore original tokens and balance.')) {
            mockBackend.reset();
            toast.success('Demo data reset!');
            setTimeout(() => window.location.reload(), 500);
        }
    };

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-full border border-white/20 bg-surface/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 text-text transition-colors duration-300">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src="/snowcat.png" alt="Snowcat" className="h-10 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"/>
                    <span className="hidden sm:block font-bold text-xl tracking-tight text-text">Snowcat</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted hover:text-primary transition-colors hover:bg-secondary rounded-full"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {isConnected ? (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleReset}
                                className="p-2 text-muted hover:text-primary transition-colors hover:bg-secondary rounded-full"
                                title="Reset Demo Data"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                            
                            <button 
                                onClick={disconnect}
                                className="rounded-full bg-primary text-background px-5 py-2 text-sm font-bold hover:opacity-90 transition-all shadow-lg"
                            >
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={connect}
                            className="rounded-full bg-primary text-background px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-all shadow-lg"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
