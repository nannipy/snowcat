import { useMockWallet } from '../../hooks/useMockWallet';
import { mockBackend } from '../../lib/mockBackend';
import { RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export function Header() {
    const { isConnected, address, connect, disconnect, avaxBalance } = useMockWallet();

    const handleReset = () => {
        if (confirm('Reset all demo data? This will restore original tokens and balance.')) {
            mockBackend.reset();
            toast.success('Demo data reset!');
            setTimeout(() => window.location.reload(), 500);
        }
    };

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-full border border-white/20 bg-white  shadow-2xl ring-1 ring-white/10 text-black">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src="/snowcat.png" alt="Snowcat" className="h-10 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"/>
                    <span className="hidden sm:block font-bold text-xl tracking-tight text-black">Snowcat</span>
                </div>
                {isConnected ? (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleReset}
                            className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-black/10 rounded-full"
                            title="Reset Demo Data"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                        
                        <button 
                            onClick={disconnect}
                            className="rounded-3xl bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/80 "
                        >
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={connect}
                        className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
}
