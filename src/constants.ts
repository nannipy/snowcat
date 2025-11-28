import { parseAbi } from 'viem';

// Chain IDs
export const AVALANCHE_ID = 43114;
export const FUJI_ID = 43113;

// Addresses
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

// Trader Joe Router (LBRouter)
export const ROUTER_ADDRESS = {
    [AVALANCHE_ID]: '0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30', // Trader Joe V2.1 Router
    [FUJI_ID]: '0xd7f655E3376cE2D7a2b08fF01f5282989718049f', // LBRouterV2.1
} as const;

// API Endpoints
export const GLACIER_API_URL = 'https://glacier-api.avax.network/v1';
export const ONE_INCH_API_URL = 'https://api.1inch.dev/swap/v6.0';

// ABIs
export const ERC20_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function transfer(address to, uint256 amount) returns (bool)',
]);

export const ROUTER_ABI = parseAbi([
    'function swapExactTokensForAVAX(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
    'function getAmountsOut(uint256 amountIn, address[] calldata path) view returns (uint256[] memory amounts)',
]);
