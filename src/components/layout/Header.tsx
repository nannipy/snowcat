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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4 mt-4 ">
                    <img src="/snowcat.png" alt="Snowcat" className="h-14 w-auto"/>
                </div>
                {isConnected ? (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleReset}
                            className="p-2 text-muted hover:text-primary transition-colors"
                            title="Reset Demo Data"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                        <div className="hidden sm:block rounded-lg bg-surface border border-border px-3 py-1.5 text-sm font-medium">
                            <span className="text-muted mr-1">Balance:</span>
                            <span className="text-primary">{avaxBalance?.toFixed(4)} AVAX</span>
                        </div>
                        <button 
                            onClick={disconnect}
                            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/80"
                        >
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={connect}
                        className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent/90"
                    >
                        Connect Mock Wallet
                    </button>
                )}
            </div>
        </header>
    );
}
