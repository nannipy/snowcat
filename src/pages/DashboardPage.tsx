import { motion } from 'framer-motion';
import { useState } from 'react';
import { DustScanner } from '../components/features/DustScanner';
import { useGlacierBalances } from '../hooks/useGlacierBalances';
import { AvalancheConfetti } from '../components/effects/AvalancheConfetti';
import { Loader2, TrendingUp, Wallet } from 'lucide-react';

export function DashboardPage() {
    const { data: tokens, isLoading } = useGlacierBalances();
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    // Separate Dust (< $5) from Whales (>= $5)
    const dustTokens = tokens?.filter(t => (t.value || 0) < 5 && (t.value || 0) > 0) || [];
    const whaleTokens = tokens?.filter(t => (t.value || 0) >= 5) || [];

    // Calculate Net Worth
    const netWorth = tokens?.reduce((acc, t) => acc + (t.value || 0), 0) || 0;

    return (
        <>
            <AvalancheConfetti isActive={isConfettiActive} onComplete={() => setIsConfettiActive(false)} />
            
            <div className="container mx-auto max-w-5xl p-4 pb-20 space-y-8">
            {/* Hero Stats */}
            {/* Hero Stats */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-surface p-8 border border-border shadow-sm relative overflow-hidden"
            >
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-muted">
                            <Wallet className="h-5 w-5" />
                            <span className="text-sm font-medium">Net Worth</span>
                        </div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted hover:text-primary"
                            title="Refresh Balances"
                        >
                        </button>
                    </div>
                    
                    <div className="text-5xl font-bold text-primary tracking-tight">
                        ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 text-success text-sm font-medium bg-success/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4" />
                        <span>+2.4% (24h)</span>
                    </div>
                </div>
            </motion.div>

            {/* Suggested Cleanup (Dust) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <span>🧹</span> Suggested Cleanup
                    </h2>
                    <span className="text-sm text-muted bg-secondary px-2 py-1 rounded-md">
                        {dustTokens.length} items
                    </span>
                </div>
                
                {/* We reuse DustScanner but it handles its own layout. 
                    Ideally we should refactor DustScanner to just be the list, 
                    but for now it works as a self-contained feature. 
                */}
                <div className="rounded-3xl bg-surface/50 border border-border/50 p-6 backdrop-blur-sm">
                    <DustScanner onAvalanche={() => setIsConfettiActive(true)} />
                </div>
            </section>

            {/* All Assets (Whales) */}
            <section>
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <span>💎</span> Your Assets
                </h2>
                
                <div className="rounded-3xl bg-surface border border-border overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Asset</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                        <th className="px-6 py-4 text-right">Balance</th>
                                        <th className="px-6 py-4 text-right">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {whaleTokens.map((token) => (
                                        <tr key={token.address} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {token.logoUri ? (
                                                        <img src={token.logoUri} alt={token.symbol} className="h-8 w-8 rounded-full" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs">
                                                            {token.symbol[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-primary">{token.name}</div>
                                                        <div className="text-xs text-muted">{token.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-primary">
                                                ${token.price.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-muted">
                                                {(parseFloat(token.balance) / (10 ** token.decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-primary">
                                                ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
            </div>
        </>
    );
}
