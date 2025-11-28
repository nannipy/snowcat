import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { http } from 'wagmi';
import { privateKeyConnector } from './lib/privateKeyConnector';

const rawPrivateKey = import.meta.env.VITE_TEST_PRIVATE_KEY;
let testPrivateKey: `0x${string}` | undefined;

if (rawPrivateKey) {
    const key = rawPrivateKey.trim();
    // Strict validation: Must be 0x followed by 64 hex characters
    const hexRegex = /^0x[a-fA-F0-9]{64}$/;

    if (hexRegex.test(key)) {
        testPrivateKey = key as `0x${string}`;
    } else if (key.length === 64 && /^[a-fA-F0-9]{64}$/.test(key)) {
        // Auto-fix: Add 0x prefix if missing but otherwise valid hex
        testPrivateKey = `0x${key}` as `0x${string}`;
    } else {
        if (key.length === 42) {
            console.error('Invalid VITE_TEST_PRIVATE_KEY. You likely pasted a wallet ADDRESS (42 chars). You must paste the PRIVATE KEY (64 hex chars).');
        } else {
            console.error('Invalid VITE_TEST_PRIVATE_KEY format. Expected 64 hex characters (optionally 0x-prefixed). Got length:', key.length);
        }
    }
}

export const config = getDefaultConfig({
    appName: 'Snowcat',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || 'YOUR_PROJECT_ID',
    chains: [avalanche, avalancheFuji], // C-Chain first, then Fuji
    transports: {
        [avalanche.id]: http(),
        [avalancheFuji.id]: http(),
    },
    ...(testPrivateKey ? {
        connectors: [
            privateKeyConnector(testPrivateKey),
        ],
    } : {}),
});
