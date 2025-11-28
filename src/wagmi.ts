import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalancheFuji } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
    appName: 'Avax DustSweeper',
    projectId: 'YOUR_PROJECT_ID', // Replace with a valid WalletConnect Project ID if needed, or use a public one for dev
    chains: [avalancheFuji],
    transports: {
        [avalancheFuji.id]: http(),
    },
});
