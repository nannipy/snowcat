import { formatUnits } from 'viem';
import { Trash2, Recycle } from 'lucide-react';
import { useState } from 'react';
import { BurnEffect } from '../effects/BurnEffect';

interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    value?: number;
    logoUri?: string;
}

interface DustCardProps {
    token: Token;
    onGroom: (token: Token) => void;
    onBury: (token: Token) => void;
    isGrooming?: boolean;
    isBurying?: boolean;
}

export function DustCard({ token, onGroom, onBury, isGrooming, isBurying }: DustCardProps) {
    const balanceFormatted = formatUnits(BigInt(token.balance), token.decimals);
    const displayBalance = parseFloat(balanceFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 });
    const displayValue = token.value ? `$${token.value.toFixed(2)}` : '$0.00';
    
    const [showBurnEffect, setShowBurnEffect] = useState(false);
    
    const handleBury = () => {
        setShowBurnEffect(true);
        // Delay the actual bury call to show the animation first
        setTimeout(() => {
            onBury(token);
        }, 1500);
    };

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-md hover:border-accent/50">
            {/* Burn Effect Overlay */}
            <BurnEffect isActive={showBurnEffect} onComplete={() => setShowBurnEffect(false)} />
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {token.logoUri ? (
                        <img src={token.logoUri} alt={token.symbol} className="h-10 w-10 rounded-full bg-secondary" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                            {token.symbol.slice(0, 2)}
                        </div>
                    )}
                    <div className="text-left">
                        <h3 className="font-bold text-primary">{token.symbol}</h3>
                        <p className="text-xs text-muted">{token.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-mono text-sm font-medium text-primary">{displayBalance}</p>
                    <p className="text-xs text-muted">{displayValue}</p>
                </div>
            </div>

            <div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button 
                    onClick={() => onGroom(token)}
                    disabled={isGrooming || isBurying}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-success/10 py-2 text-sm font-medium text-success hover:bg-success/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Recycle className={`h-4 w-4 ${isGrooming ? 'animate-spin' : ''}`} />
                    {isGrooming ? 'Grooming...' : 'Groom'}
                </button>
                <button 
                    onClick={handleBury}
                    disabled={isGrooming || isBurying || showBurnEffect}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-danger/10 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 className={`h-4 w-4 ${isBurying ? 'animate-spin' : ''}`} />
                    {isBurying ? 'Burying...' : 'Bury'}
                </button>
            </div>
        </div>
    );
}
