import { useState } from 'react';
import { mockBackend } from '../lib/mockBackend';

export function use1inchSwap() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const swapToken = async (tokenAddress: string, _amount: string, _decimals: number) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Mock Swapping token ${tokenAddress}...`);
            await mockBackend.swap(tokenAddress);
            console.log('Mock Swap Successful!');
            return '0xMockTransactionHash123456789';

        } catch (err: any) {
            console.error('Swap error:', err);
            setError(err.message || 'Swap failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        swapToken,
        isLoading,
        error
    };
}
