import { useQuery } from '@tanstack/react-query';
import { useMockWallet } from './useMockWallet';
import { mockBackend } from '../lib/mockBackend';

export function useGlacierBalances() {
    const { address, isConnected } = useMockWallet();

    return useQuery({
        queryKey: ['balances', 'mock', address],
        queryFn: async () => {
            if (!isConnected || !address) return [];
            return await mockBackend.getBalances();
        },
        enabled: isConnected,
    });
}
