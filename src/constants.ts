import { parseAbi } from 'viem';

// Avalanche Fuji Testnet
export const CHAIN_ID = 43113;

// Trader Joe Router (Fuji) - Verified placeholder, double check if needed
export const ROUTER_ADDRESS = '0xd7f655E3376cE2D7a2b08fF01f5282989718049f';

export const TOKEN_WHITELIST = [
    {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x5425890298aed601595a70ab815c96711a31bc65', // Fuji USDC
        decimals: 6,
    },
    {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        address: '0x3613C187b3eF813619A25322595b74E78843Ad22', // Fuji WETH (Example)
        decimals: 18,
    },
    {
        symbol: 'LINK',
        name: 'Chainlink',
        address: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846', // Fuji LINK
        decimals: 18,
    },
] as const;

export const ERC20_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
]);

export const ROUTER_ABI = parseAbi([
    'function swapExactTokensForAVAX(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
    'function getAmountsOut(uint256 amountIn, address[] calldata path) view returns (uint256[] memory amounts)',
]);
