export interface MockToken {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    price: { price: number; currency: string };
    value: number;
    logoUri?: string;
}

import { MOCK_TOKENS } from './mockData';

const INITIAL_TOKENS: MockToken[] = MOCK_TOKENS;

class MockBackendService {
    private tokens: MockToken[];
    private avaxBalance: number;

    constructor() {
        // Load from local storage or init
        const storedTokens = localStorage.getItem('mockTokens');
        const storedBalance = localStorage.getItem('mockAvaxBalance');

        this.tokens = storedTokens ? JSON.parse(storedTokens) : [...INITIAL_TOKENS];
        this.avaxBalance = storedBalance ? parseFloat(storedBalance) : 12.5; // Start with 12.5 AVAX
    }

    private save() {
        localStorage.setItem('mockTokens', JSON.stringify(this.tokens));
        localStorage.setItem('mockAvaxBalance', this.avaxBalance.toString());
    }

    async getBalances(): Promise<MockToken[]> {
        await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
        return [...this.tokens];
    }

    async getAvaxBalance(): Promise<number> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.avaxBalance;
    }

    async getSwapQuote(tokenAddress: string): Promise<{ avaxAmount: number; gasFee: number; rate: number }> {
        await new Promise(resolve => setTimeout(resolve, 600)); // Quote delay

        const token = this.tokens.find(t => t.address === tokenAddress);
        if (!token) throw new Error('Token not found');

        // Mock Rate: 1 AVAX = $40 (approx)
        const avaxPrice = 40;
        const avaxAmount = token.value / avaxPrice;

        // Mock Gas Fee: 0.002 AVAX (~$0.08)
        const gasFee = 0.002;

        return {
            avaxAmount,
            gasFee,
            rate: avaxPrice
        };
    }

    async swap(tokenAddress: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Swap delay

        const token = this.tokens.find(t => t.address === tokenAddress);
        if (!token) throw new Error('Token not found');

        // Calculate amounts again (securely)
        const avaxPrice = 40;
        const avaxAmount = token.value / avaxPrice;
        const gasFee = 0.002;

        // Update Balance
        this.avaxBalance += (avaxAmount - gasFee);

        // Remove token (simulate swap to AVAX)
        this.tokens = this.tokens.filter(t => t.address !== tokenAddress);
        this.save();

        return '0xMockSwapHash';
    }

    async burn(tokenAddress: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Burn delay

        // Remove token
        this.tokens = this.tokens.filter(t => t.address !== tokenAddress);
        this.save();

        return '0xMockBurnHash';
    }

    reset() {
        this.tokens = [...INITIAL_TOKENS];
        this.avaxBalance = 12.5;
        this.save();
    }
}

export const mockBackend = new MockBackendService();
