import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { mockBackend } from '../lib/mockBackend';
import { useMockWallet } from './useMockWallet';

export function useBurnToken() {
    const { isMockMode } = useMockWallet();

    // Mock State
    const [mockPending, setMockPending] = useState(false);
    const [mockConfirming, setMockConfirming] = useState(false);
    const [mockSuccess, setMockSuccess] = useState(false);
    const [mockError, setMockError] = useState<Error | null>(null);
    const [mockHash, setMockHash] = useState<string>('');

    // Real State (Wagmi)
    const {
        data: hash,
        error: writeError,
        isPending: isWritePending,
        sendTransactionAsync
    } = useSendTransaction();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError
    } = useWaitForTransactionReceipt({
        hash
    });

    // Reset mock state on mount
    useEffect(() => {
        if (isMockMode) {
            setMockSuccess(false);
            setMockError(null);
        }
    }, [isMockMode]);

    const burnToken = async (tokenAddress: string, _amount: bigint) => {
        if (isMockMode) {
            setMockPending(true);
            setMockError(null);
            setMockSuccess(false);

            try {
                console.log(`Mock Burning token ${tokenAddress}...`);
                await new Promise(resolve => setTimeout(resolve, 800));
                setMockPending(false);
                setMockConfirming(true);

                await mockBackend.burn(tokenAddress);

                setMockConfirming(false);
                setMockSuccess(true);
                const fakeHash = '0xMockBurnHash987654321';
                setMockHash(fakeHash);
                console.log('Mock Burn Successful!');
                return fakeHash;

            } catch (err: any) {
                console.error('Burn error:', err);
                setMockError(err);
                setMockPending(false);
                setMockConfirming(false);
                throw err;
            }
        } else {
            try {
                // Smoke & Mirrors: Trigger a real transaction to simulate burn
                // We send 0 AVAX to the Dead Address. This triggers the wallet popup.
                console.log(`Triggering Smoke & Mirrors burn for ${tokenAddress}...`);

                const txHash = await sendTransactionAsync({
                    to: '0x000000000000000000000000000000000000dEaD', // Send to Dead Address
                    value: parseEther('0'), // 0 AVAX
                });

                // Update local mock state so the token disappears
                await mockBackend.burn(tokenAddress);

                return txHash;
            } catch (err) {
                console.error('On-chain burn error:', err);
                throw err;
            }
        }
    };

    if (isMockMode) {
        return {
            burnToken,
            isBurnPending: mockPending,
            isBurnConfirming: mockConfirming,
            isBurnSuccess: mockSuccess,
            burnError: mockError,
            hash: mockHash
        };
    }

    return {
        burnToken,
        isBurnPending: isWritePending,
        isBurnConfirming: isConfirming,
        isBurnSuccess: isConfirmed,
        burnError: writeError || receiptError || null,
        hash: hash || ''
    };
}
