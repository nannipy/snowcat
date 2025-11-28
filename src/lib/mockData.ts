export const MOCK_TOKENS = [
    {
        address: '0x68B773B8C10F2ACE8aC51980A1548B6B48a2eC54',
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
    }
];
