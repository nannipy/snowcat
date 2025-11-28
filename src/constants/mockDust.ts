import type { MockToken } from '../lib/mockBackend';

export const MOCK_DUST: MockToken[] = [
    {
        address: '0xScamToken1234567890abcdef1234567890abcdef',
        name: 'ElonCumDoge',
        symbol: 'ELON',
        decimals: 18,
        balance: '69420000000000000000000', // 69,420 tokens
        value: 4.20,
        logoUri: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=024',
        price: { price: 0.00006, currency: 'usd' }
    },
    {
        address: '0xOldLpToken1234567890abcdef1234567890abcdef',
        name: 'Old Uniswap LP',
        symbol: 'UNI-V2',
        decimals: 18,
        balance: '1500000000000000000', // 1.5 tokens
        value: 2.50,
        logoUri: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=024',
        price: { price: 1.66, currency: 'usd' }
    },
    {
        address: '0xRugPullToken1234567890abcdef1234567890abcdef',
        name: 'SafeMoon Classic',
        symbol: 'SAFEMOON',
        decimals: 9,
        balance: '1000000000000', // 1000 tokens
        value: 0.05,
        logoUri: 'https://cryptologos.cc/logos/safemoon-safemoon-logo.png?v=024',
        price: { price: 0.00005, currency: 'usd' }
    },
    {
        address: '0xLostGemToken1234567890abcdef1234567890abcdef',
        name: 'Terra Luna (Old)',
        symbol: 'LUNC',
        decimals: 18,
        balance: '5000000000000000000000', // 5000 tokens
        value: 0.80,
        logoUri: 'https://cryptologos.cc/logos/terra-luna-luna-logo.png?v=024',
        price: { price: 0.00016, currency: 'usd' }
    }
];
