import { useState } from 'react';
import { useMockWallet } from '../../hooks/useMockWallet';
import { useGlacierBalances } from '../../hooks/useGlacierBalances';
import { useBurnToken } from '../../hooks/useBurnToken';
import { use1inchSwap } from '../../hooks/use1inchSwap';
import { DustCard } from './DustCard';
import { GroomModal } from './GroomModal';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DustScannerProps {
    onAvalanche?: () => void;
}

export function DustScanner({ onAvalanche }: DustScannerProps) {
    const { isConnected, refetchBalance } = useMockWallet();
    const { data: tokens, isLoading, error, refetch } = useGlacierBalances();
    const { burnToken, isBurnPending, isBurnConfirming } = useBurnToken();
    const { swapToken, isLoading: isSwapLoading } = use1inchSwap();

    // Filter for dust: value < $1000 (increased for testing) and > 0
    const dustTokens = tokens?.filter(t => (t.value || 0) < 1000 && (t.value || 0) > 0) || [];

    const [selectedToken, setSelectedToken] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGroomClick = (token: any) => {
        setSelectedToken(token);
        setIsModalOpen(true);
    };

    const handleConfirmGroom = async (token: any) => {
        if (!token) return;
        try {
            const txHash = await swapToken(token.address, token.balance, token.decimals);
            
            if (onAvalanche) onAvalanche(); // Trigger Avalanche Effect
            
            toast.success(() => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Groomed successfully! 🧹</span>
                    {txHash && (
                        <a 
                            href={`https://testnet.snowtrace.io/tx/${txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs underline opacity-80 hover:opacity-100"
                        >
                            View on Snowtrace ↗
                        </a>
                    )}
                </div>
            ));
            
            if (window.navigator.vibrate) window.navigator.vibrate(200);
            refetch(); // Refresh list
            refetchBalance(); // Refresh AVAX balance
            setIsModalOpen(false);
        } catch (err) {
            toast.error('Failed to groom');
        }
    };

    const handleBury = async (token: any) => {
        if (!confirm(`Are you sure you want to bury ${token.symbol}? This cannot be undone.`)) return;
        
        try {
            const txHash = await burnToken(token.address, BigInt(token.balance));
            
            if (onAvalanche) onAvalanche(); // Trigger Avalanche Effect
            
            toast.success(() => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Buried successfully! ⚰️</span>
                    {txHash && (
                        <a 
                            href={`https://testnet.snowtrace.io/tx/${txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs underline opacity-80 hover:opacity-100"
                        >
                            View on Snowtrace ↗
                        </a>
                    )}
                </div>
            ));
            
            if (window.navigator.vibrate) window.navigator.vibrate([50, 50, 50]);
            refetch(); // Refresh list
        } catch (err) {
            toast.error('Failed to bury');
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-4xl">🐱❄️</div>
                <h2 className="text-xl font-bold text-primary">Connect your wallet</h2>
                <p className="text-muted">Connect to start scanning for dust</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="mt-2 text-sm text-muted">Sniffing for dust...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-danger">
                <p>Failed to load balances. Please try again.</p>
                <button onClick={() => refetch()} className="mt-2 underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Dust Found ({dustTokens.length})</h2>
                <button onClick={() => refetch()} className="text-sm text-accent hover:underline">
                    Rescan
                </button>
            </div>

            {dustTokens.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
                    <p className="text-muted">No dust found! Your wallet is clean. ✨</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {dustTokens.map((token) => (
                        <DustCard 
                            key={token.address} 
                            token={token} 
                            onGroom={handleGroomClick} 
                            onBury={handleBury}
                            isGrooming={isSwapLoading && selectedToken?.address === token.address}
                            isBurying={(isBurnPending || isBurnConfirming) && selectedToken?.address === token.address}
                        />
                    ))}
                </div>
            )}
            
            {selectedToken && (
                <GroomModal 
                    token={selectedToken}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmGroom}
                    isLoading={isSwapLoading}
                />
            )}
            <Toaster position="bottom-center" />
        </div>
    );
}
