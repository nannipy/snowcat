export interface TokenInfo {
    address: `0x${string}`;
    name: string;
    symbol: string;
    decimals: number;
    logoUri?: string;
    price: number; // Fallback/Mock price
}

export const FUJI_TOKENS: TokenInfo[] = [
    {
        address: '0x5425890298aed601595a70AB815c96711a31Bc65', // USDC (Circle Native) - Fixed checksum
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoUri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024',
        price: 1.00
    },
    {
        address: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', // WETH (Fuji)
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logoUri: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024',
        price: 2500.00
    },
    {
        address: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846', // LINK (Fuji)
        name: 'Chainlink',
        symbol: 'LINK',
        decimals: 18,
        logoUri: 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=024',
        price: 18.50
    },
    {
        address: '0x68B773B8C10F2ACE8aC51980A1548B6B48a2eC54', // USDC (User Suggested)
        name: 'mockUSDC',
        symbol: 'mUSDC',
        decimals: 6,
        logoUri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024',
        price: 1.00
    },
    {
        address: '0x1ad483798422423e3471d2fa8a7ef6eb83bd4926', // WETH.e (Fuji)
        name: 'Wrapped Ether.e',
        symbol: 'WETH.e',
        decimals: 18,
        logoUri: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024',
        price: 3500.00
    }
];
