import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockBackend } from '../lib/mockBackend';

export function useMockWallet() {
    // Persist mock connection state in localStorage for better UX during reload
    const [isConnected, setIsConnected] = useState(() => {
        return localStorage.getItem('mockWalletConnected') === 'true';
    });

    const address = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // Vitalik's address as mock
    const chainId = 43114; // Avalanche C-Chain

    useEffect(() => {
        localStorage.setItem('mockWalletConnected', String(isConnected));
    }, [isConnected]);

    const connect = () => setIsConnected(true);
    const disconnect = () => setIsConnected(false);

    // Fetch AVAX Balance
    const { data: avaxBalance, refetch: refetchBalance } = useQuery({
        queryKey: ['balance', 'avax', address],
        queryFn: async () => {
            if (!isConnected) return 0;
            return await mockBackend.getAvaxBalance();
        },
        enabled: isConnected,
        initialData: 0
    });

    return {
        isConnected,
        address: isConnected ? address : undefined,
        chainId: isConnected ? chainId : undefined,
        connect,
        disconnect,
        avaxBalance,
        refetchBalance
    };
}
