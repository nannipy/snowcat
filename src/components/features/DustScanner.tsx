import { useState } from 'react';
import { useMockWallet } from '../../hooks/useMockWallet';
import { useGlacierBalances } from '../../hooks/useGlacierBalances';
import { useBurnToken } from '../../hooks/useBurnToken';
import { use1inchSwap } from '../../hooks/use1inchSwap';
import { DustCard } from './DustCard';
import { GroomModal } from './GroomModal';
import { Search, Loader2, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface DustScannerProps {
    onAvalanche?: () => void;
}

export function DustScanner({ onAvalanche }: DustScannerProps) {
    const { isConnected, refetchBalance } = useMockWallet();
    const { data: tokens, isLoading, error, refetch } = useGlacierBalances();
    const { burnToken, isBurnPending, isBurnConfirming } = useBurnToken();
    const { swapToken, isLoading: isSwapLoading } = use1inchSwap();

    const [searchQuery, setSearchQuery] = useState('');

    // Filter for dust: value < $1 and > 0
    const dustTokens = tokens?.filter(t => {
        const isDust = (t.value || 0) <= 1 && (t.value || 0) > 0;
        const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.name.toLowerCase().includes(searchQuery.toLowerCase());
        return isDust && matchesSearch;
    }) || [];

    const [selectedToken, setSelectedToken] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
    const [groomedTokenId, setGroomedTokenId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleGroomClick = (token: any, e?: React.MouseEvent) => {
        if (e) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setModalPosition({
                top: rect.top,
                left: rect.left + rect.width / 2
            });
        } else {
            setModalPosition(null);
        }
        setSelectedToken(token);
        setIsModalOpen(true);
    };

    const handleConfirmGroom = async (token: any) => {
        if (!token) return;
        try {
            const txHash = await swapToken(token.address, token.balance, token.decimals);
            
            // Close modal immediately
            setIsModalOpen(false);

            // Trigger Card Animation
            setGroomedTokenId(token.address);
            
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
            
            // Note: We do NOT refetch here. We wait for the animation to complete.
        } catch (err) {
            toast.error('Failed to groom');
        }
    };

    const handleGroomAnimationComplete = () => {
        setGroomedTokenId(null);
        refetch(); // Refresh list (removes the card)
        refetchBalance(); // Refresh AVAX balance
    };

    const handleBury = async (token: any) => {
        if (!confirm(`Are you sure you want to bury ${token.symbol}? This cannot be undone.`)) return;
        
        try {
            const txHash = await burnToken(token.address, BigInt(token.balance));
            
            if (onAvalanche) onAvalanche(); // Keep global effect for Bury if desired, or remove
            
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
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Dust Found</h2>
                
                {/* Expanding Search Bar */}
                <div className="relative group">
                    <div className={`flex items-center bg-surface border border-border rounded-full transition-all duration-300 ease-in-out ${searchQuery ? 'w-64 px-4' : 'w-10 h-10 justify-center group-hover:w-64 group-hover:px-4'}`}>
                        <Search className={`w-4 h-4 text-muted transition-colors flex-shrink-0 ${searchQuery || 'group-hover:text-primary'}`} />
                        <input 
                            type="text"
                            placeholder="Search dust..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent border-none outline-none text-sm ml-2 w-full text-text placeholder:text-muted/50 ${searchQuery ? 'block' : 'hidden group-hover:block'}`}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="ml-2 text-muted hover:text-text flex-shrink-0">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {dustTokens.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
                    <p className="text-muted">No dust found! Your wallet is clean. ✨</p>
                </div>
            ) : (
                <motion.div 
                    className="grid gap-4 sm:grid-cols-3 auto-rows-min grid-flow-dense"
                >
                    {dustTokens.map((token) => {
                        const isExpanded = selectedId === token.address;
                        return (
                            <DustCard 
                                key={token.address} 
                                token={token} 
                                onGroom={(token, e) => handleGroomClick(token, e)} 
                                onBury={handleBury}
                                isGrooming={isSwapLoading && selectedToken?.address === token.address}
                                isBurying={(isBurnPending || isBurnConfirming) && selectedToken?.address === token.address}
                                isGroomed={groomedTokenId === token.address}
                                onGroomComplete={handleGroomAnimationComplete}
                                layoutId={token.address}
                                onClick={() => setSelectedId(isExpanded ? null : token.address)}
                                isExpanded={isExpanded}
                                className={isExpanded ? "sm:col-span-2 sm:row-span-2 z-10" : ""}
                            />
                        );
                    })}
                </motion.div>
            )}
            
            {selectedToken && (
                <GroomModal 
                    token={selectedToken}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmGroom}
                    isLoading={isSwapLoading}
                    position={modalPosition}
                />
            )}
            <Toaster position="bottom-center" />
        </div>
    );
}
