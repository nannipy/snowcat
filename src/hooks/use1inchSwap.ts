import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useMockWallet } from './useMockWallet';
import { mockBackend } from '../lib/mockBackend';

export function use1inchSwap() {
    const { isConnected, address } = useMockWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { sendTransactionAsync } = useSendTransaction();

    const swapToken = async (tokenAddress: string, _amount: string, _decimals: number) => {
        if (!isConnected) return;

        setIsLoading(true);
        setError(null);

        try {
            // Smoke & Mirrors: Trigger a real transaction to simulate swap
            // We send 0 AVAX to ourselves. This triggers the wallet popup.
            console.log('Triggering Smoke & Mirrors transaction...');

            const hash = await sendTransactionAsync({
                to: address as `0x${string}`, // Send to self
                value: parseEther('0'), // 0 AVAX
            });

            // Update local mock state so the token disappears
            await mockBackend.swap(tokenAddress);

            setIsLoading(false);
            return hash;
        } catch (err: any) {
            console.error('Swap failed:', err);
            setError(err.message || 'Swap failed');
            setIsLoading(false);
            throw err;
        }
    };

    return {
        swapToken,
        isLoading,
        error
    };
}
