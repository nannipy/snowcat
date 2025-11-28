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

const INITIAL_TOKENS: MockToken[] = [
    {
        address: '0x1234567890123456789012345678901234567890',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        balance: '350000', // 0.35 USDC
        price: { price: 1.00, currency: 'usd' },
        value: 0.35,
        logoUri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024'
    },
    {
        address: '0x2345678901234567890123456789012345678901',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        balance: '1200000000000000', // 0.0012 ETH
        price: { price: 2500.00, currency: 'usd' },
        value: 3.00,
        logoUri: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024'
    },
    {
        address: '0x3456789012345678901234567890123456789012',
        name: 'Shiba Inu',
        symbol: 'SHIB',
        decimals: 18,
        balance: '50000000000000000000000', // 50000 SHIB
        price: { price: 0.00001, currency: 'usd' },
        value: 0.50,
        logoUri: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=024'
    },
    {
        address: '0x4567890123456789012345678901234567890123',
        name: 'Scam Token',
        symbol: 'SCAM',
        decimals: 18,
        balance: '1000000000000000000000', // 1000 SCAM
        price: { price: 0.000001, currency: 'usd' },
        value: 0.001,
        // No logo
    },
    {
        address: '0x5678901234567890123456789012345678901234',
        name: 'Old Airdrop',
        symbol: 'DROP',
        decimals: 18,
        balance: '500000000000000000000', // 500 DROP
        price: { price: 0.002, currency: 'usd' },
        value: 1.00,
    },
    {
        address: '0x6789012345678901234567890123456789012345',
        name: 'Pepe',
        symbol: 'PEPE',
        decimals: 18,
        balance: '1000000000000000000000000', // 1M PEPE
        price: { price: 0.0000015, currency: 'usd' },
        value: 1.50,
        logoUri: 'https://cryptologos.cc/logos/pepe-pepe-logo.png?v=024'
    },
    {
        address: '0x7890123456789012345678901234567890123456',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        balance: '210000', // 0.21 USDT
        price: { price: 1.00, currency: 'usd' },
        value: 0.21,
        logoUri: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=024'
    },
    {
        address: '0x9012345678901234567890123456789012345678',
        name: 'Bitcoin (WBTC)',
        symbol: 'WBTC',
        decimals: 8,
        balance: '50000000', // 0.5 BTC
        price: { price: 65000.00, currency: 'usd' },
        value: 32500.00,
        logoUri: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=024'
    },
    {
        address: '0x0123456789012345678901234567890123456789',
        name: 'Solana',
        symbol: 'SOL',
        decimals: 9,
        balance: '150000000000', // 150 SOL
        price: { price: 145.00, currency: 'usd' },
        value: 21750.00,
        logoUri: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=024'
    },
    {
        address: '0x1123456789012345678901234567890123456789',
        name: 'Chainlink',
        symbol: 'LINK',
        decimals: 18,
        balance: '500000000000000000000', // 500 LINK
        price: { price: 18.50, currency: 'usd' },
        value: 9250.00,
        logoUri: 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=024'
    },
    {
        address: '0x2123456789012345678901234567890123456789',
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        balance: '1000000000000000000000', // 1000 AVAX (Wrapped)
        price: { price: 40.00, currency: 'usd' },
        value: 40000.00,
        logoUri: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=024'
    }
];

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
