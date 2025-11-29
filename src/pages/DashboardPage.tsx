import { motion } from 'framer-motion';
import { useState } from 'react';
import { DustScanner } from '../components/features/DustScanner';
import { useGlacierBalances } from '../hooks/useGlacierBalances';
import { useMockWallet } from '../hooks/useMockWallet';
import { Loader2, Wallet } from 'lucide-react';

export function DashboardPage() {
    const { data: tokens, isLoading } = useGlacierBalances();
    const { address } = useMockWallet();

    // Separate Dust (< $5) from Whales (>= $5)
    const dustTokens = tokens?.filter(t => (t.value || 0) < 1 && (t.value || 0) > 0) || [];
    const whaleTokens = tokens?.filter(t => (t.value || 0) >= 1) || [];

    // Calculate Net Worth
    const netWorth = tokens?.reduce((acc, t) => acc + (t.value || 0), 0) || 0;

    return (
        <>
            
            <div className="container mx-auto max-w-5xl p-4 pb-20 space-y-8">
            {/* Hero Stats - Compact */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-surface p-6 border border-border shadow-sm"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Net Worth */}
                    <div>
                        <div className="flex items-center gap-2 text-muted mb-1">
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Net Worth</span>
                        </div>
                        <div className="text-3xl font-bold text-primary tracking-tight">
                            ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Wallet Info */}
                    <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm">👤</span>
                        </div>
                        <div>
                            <div className="text-[10px] text-muted uppercase font-bold">Wallet</div>
                            <div className="text-sm font-mono font-medium text-primary">
                                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-8 md:border-l md:border-border md:pl-8">
                        <div>
                            <div className="text-[10px] text-muted uppercase font-bold">Assets</div>
                            <div className="text-xl font-bold text-primary">{tokens?.length || 0}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-muted uppercase font-bold">Dust</div>
                            <div className="text-xl font-bold text-primary">{dustTokens.length}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Suggested Cleanup (Dust) */}
            <section>
                <div className="flex items-center justify-center mb-4">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <span>🧹</span> Suggested Cleanup
                    </h2>
                    <span className="ml-4 text-sm text-muted bg-secondary px-2 py-1 rounded-md">
                        {dustTokens.length} items
                    </span>
                </div>
                
                {/* We reuse DustScanner but it handles its own layout. 
                    Ideally we should refactor DustScanner to just be the list, 
                    but for now it works as a self-contained feature. 
                */}
                <div className="rounded-3xl bg-surface/50 border border-border/50 p-6 backdrop-blur-sm">
                    <DustScanner />
                </div>
            </section>

            {/* All Assets (Whales) */}
            <section>
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 justify-center">
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
