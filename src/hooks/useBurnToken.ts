import { useState } from 'react';
import { mockBackend } from '../lib/mockBackend';

export function useBurnToken() {
    const [isBurnPending, setIsBurnPending] = useState(false);
    const [isBurnConfirming, setIsBurnConfirming] = useState(false);
    const [isBurnSuccess, setIsBurnSuccess] = useState(false);
    const [burnError, setBurnError] = useState<Error | null>(null);

    const burnToken = async (tokenAddress: string, _amount: bigint) => {
        setIsBurnPending(true);
        setBurnError(null);
        setIsBurnSuccess(false);

        try {
            console.log(`Mock Burning token ${tokenAddress}...`);

            // Simulate wallet signature delay
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsBurnPending(false);
            setIsBurnConfirming(true);

            // Call backend
            await mockBackend.burn(tokenAddress);

            setIsBurnConfirming(false);
            setIsBurnSuccess(true);
            console.log('Mock Burn Successful!');

            return '0xMockBurnHash987654321';

        } catch (err: any) {
            console.error('Burn error:', err);
            setBurnError(err);
            setIsBurnPending(false);
            setIsBurnConfirming(false);
            throw err;
        }
    };

    return {
        burnToken,
        isBurnPending,
        isBurnConfirming,
        isBurnSuccess,
        burnError,
        hash: '0xMockBurnHash'
    };
}
