import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { mockBackend } from '../lib/mockBackend';

export function useMockWallet() {
    // Wagmi hooks
    const { address: wagmiAddress, isConnected: isWagmiConnected, chainId: wagmiChainId } = useAccount();
    const { connect: connectWagmi, connectors } = useConnect();
    const { disconnect: disconnectWagmi } = useDisconnect();

    // Persist mock connection state in localStorage for better UX during reload
    const [isMockConnected, setIsMockConnected] = useState(() => {
        return localStorage.getItem('mockWalletConnected') === 'true';
    });

    const mockAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // Vitalik's address as mock
    const mockChainId = 43114; // Avalanche C-Chain

    useEffect(() => {
        localStorage.setItem('mockWalletConnected', String(isMockConnected));
    }, [isMockConnected]);

    // Combined state
    const isConnected = isWagmiConnected || isMockConnected;
    const address = isWagmiConnected ? wagmiAddress : (isMockConnected ? mockAddress : undefined);
    const chainId = isWagmiConnected ? wagmiChainId : (isMockConnected ? mockChainId : undefined);

    const connect = () => {
        // If we have a private key connector, try to use it
        const privateKeyConnector = connectors.find(c => c.id === 'privateKey');
        if (privateKeyConnector) {
            connectWagmi({ connector: privateKeyConnector });
        } else {
            setIsMockConnected(true);
        }
    };

    const disconnect = () => {
        if (isWagmiConnected) {
            disconnectWagmi();
        }
        setIsMockConnected(false);
    };

    // Fetch AVAX Balance
    const { data: avaxBalance, refetch: refetchBalance } = useQuery({
        queryKey: ['balance', 'avax', address, isWagmiConnected],
        queryFn: async () => {
            if (!isConnected) return 0;
            if (isWagmiConnected) {
                return 0;
            }
            return await mockBackend.getAvaxBalance();
        },
        enabled: isConnected,
        initialData: 0
    });

    return {
        isConnected,
        address,
        chainId,
        connect,
        disconnect,
        avaxBalance,
        refetchBalance,
        isMockMode: !isWagmiConnected
    };
}
