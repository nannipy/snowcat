import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { mockBackend, type MockToken } from '../../lib/mockBackend';

interface GroomModalProps {
    token: MockToken;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (token: MockToken) => void;
    isLoading: boolean;
    position?: { top: number; left: number } | null;
}

export function GroomModal({ token, isOpen, onClose, onConfirm, isLoading, position }: GroomModalProps) {
    const [quote, setQuote] = useState<{ avaxAmount: number; gasFee: number; rate: number } | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);

    useEffect(() => {
        if (isOpen && token) {
            setIsQuoteLoading(true);
            mockBackend.getSwapQuote(token.address)
                .then(setQuote)
                .finally(() => setIsQuoteLoading(false));
        } else {
            setQuote(null);
        }
    }, [isOpen, token]);

    if (!isOpen) return null;

    const isConvenient = quote ? quote.avaxAmount > quote.gasFee : false;
    const netAmount = quote ? quote.avaxAmount - quote.gasFee : 0;

    return createPortal(
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[1px]" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="fixed z-[101] w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
                style={position ? { 
                    top: position.top, 
                    left: '50%', // Always center horizontally
                    transform: 'translate(-50%, -100%) translateY(-10px)' // Position above button
                } : {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <h2 className="text-xl font-bold text-primary mb-4">Groom {token.symbol}</h2>
                
                {isQuoteLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        <p className="mt-2 text-sm text-muted">Fetching best quote...</p>
                    </div>
                ) : quote ? (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">You Sell:</span>
                                <span className="font-medium text-primary">{parseFloat(token.balance) / (10 ** token.decimals)} {token.symbol} (${token.value.toFixed(2)})</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">You Get (Est.):</span>
                                <span className="font-medium text-primary">{quote.avaxAmount.toFixed(4)} AVAX</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Gas Fee (Est.):</span>
                                <span className="font-medium text-danger">-{quote.gasFee.toFixed(4)} AVAX</span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between font-bold">
                                <span>Net Total:</span>
                                <span className={netAmount > 0 ? 'text-success' : 'text-danger'}>
                                    {netAmount.toFixed(4)} AVAX
                                </span>
                            </div>
                        </div>

                        <div className={`flex items-start gap-3 rounded-lg p-3 ${isConvenient ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {isConvenient ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
                            <div className="text-sm">
                                <p className="font-bold">{isConvenient ? 'Convenient Swap' : 'Not Convenient'}</p>
                                <p className="opacity-90">
                                    {isConvenient 
                                        ? 'The value of the tokens exceeds the gas fees. Good to groom!' 
                                        : 'Gas fees are higher than the token value. You will lose money.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-bold text-primary hover:bg-secondary/80 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => onConfirm(token)}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-white hover:bg-accent/90 disabled:opacity-50"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isLoading ? 'Grooming...' : 'Confirm Swap'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-danger">
                        <XCircle className="h-8 w-8 mb-2" />
                        <p>Failed to load quote.</p>
                        <button onClick={onClose} className="mt-4 text-sm underline">Close</button>
                    </div>
                )}
            </div>
        </>,
        document.body
    );
}
