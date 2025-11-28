import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
    appName: 'Snowcat',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || 'YOUR_PROJECT_ID',
    chains: [avalanche, avalancheFuji],
    transports: {
        [avalanche.id]: http(),
        [avalancheFuji.id]: http(),
    },
});
