import { useQuery } from '@tanstack/react-query';
import { useBalance, useReadContracts, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useMockWallet } from './useMockWallet';
import { mockBackend, type MockToken } from '../lib/mockBackend';
import { FUJI_TOKENS } from '../constants/tokens';


const AVAX_USD_FEED = '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD'; // Fuji Testnet
const CHAINLINK_ABI = [{
    inputs: [],
    name: 'latestRoundData',
    outputs: [
        { name: 'roundId', type: 'uint80' },
        { name: 'answer', type: 'int256' },
        { name: 'startedAt', type: 'uint256' },
        { name: 'updatedAt', type: 'uint256' },
        { name: 'answeredInRound', type: 'uint80' }
    ],
    stateMutability: 'view',
    type: 'function'
}] as const;

async function fetchPrices(): Promise<Record<string, number>> {
    // CoinGecko API is rate-limiting (429) and blocking CORS on localhost.
    // Disabling for now to prevent errors.
    return {};

    /* 
    try {
        const ids = Object.values(COINGECKO_IDS).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }

        const data = await response.json();
        
        // Map back to symbols
        const prices: Record<string, number> = {};
        Object.entries(COINGECKO_IDS).forEach(([symbol, id]) => {
            if (data[id] && data[id].usd) {
                prices[symbol] = data[id].usd;
            }
        });
        
        return prices;
    } catch (error) {
        console.error('Error fetching prices:', error);
        return {};
    }
    */
}

export function useGlacierBalances() {
    const { address, isConnected, isMockMode, chainId } = useMockWallet();

    console.log('useGlacierBalances:', { address, isConnected, isMockMode, chainId });

    // Real AVAX balance
    const { data: realAvaxBalance } = useBalance({
        address: address as `0x${string}`,
        chainId: chainId,
        query: {
            enabled: isConnected && !isMockMode && !!address
        }
    });

    // Real AVAX Price (Chainlink)
    const { data: avaxPriceData } = useReadContract({
        address: AVAX_USD_FEED,
        abi: CHAINLINK_ABI,
        functionName: 'latestRoundData',
        chainId: chainId,
        query: {
            enabled: isConnected && !isMockMode,
            refetchInterval: 30000, // Update price every 30s
        }
    });

    // Filter for Real USDC only (including the user's mockUSDC)
    const REAL_TOKENS = FUJI_TOKENS.filter(t => t.symbol === 'USDC' || t.symbol === 'USDC.e' || t.symbol === 'mUSDC');

    // Real ERC-20 balances
    const { data: erc20Balances } = useReadContracts({
        contracts: REAL_TOKENS.map(token => ({
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
            chainId: chainId,
        })),
        query: {
            enabled: isConnected && !isMockMode && !!address
        }
    });

    console.log('Real data fetched:', {
        realAvaxBalance: realAvaxBalance?.formatted,
        erc20Balances: erc20Balances?.map((b, i) => ({
            token: REAL_TOKENS[i].symbol,
            balance: b.result?.toString()
        }))
    });

    return useQuery({
        queryKey: ['balances', isMockMode ? 'mock' : 'real', address, realAvaxBalance?.value.toString(), erc20Balances?.map(b => b.result?.toString()).join(','), avaxPriceData?.[1].toString()],
        queryFn: async () => {
            if (!isConnected || !address) return [];

            if (!isMockMode) {
                const tokens: MockToken[] = [];

                // Fetch real prices (API)
                const livePrices = await fetchPrices();

                // Determine AVAX Price
                // Priority: Chainlink On-Chain -> CoinGecko API -> Fallback (40)
                let avaxPrice = 40.00;
                if (avaxPriceData && avaxPriceData[1]) {
                    // Chainlink returns 8 decimals for USD pairs
                    avaxPrice = Number(avaxPriceData[1]) / 1e8;
                } else if (livePrices['AVAX']) {
                    avaxPrice = livePrices['AVAX'];
                }

                // Add AVAX (Real)
                console.log('Adding AVAX?', { hasRealAvaxBalance: !!realAvaxBalance, realAvaxBalance });
                if (realAvaxBalance) {
                    tokens.push({
                        address: '0x0000000000000000000000000000000000000000', // Native
                        name: 'Avalanche',
                        symbol: 'AVAX',
                        decimals: 18,
                        balance: realAvaxBalance.value.toString(),
                        price: { price: avaxPrice, currency: 'usd' },
                        value: parseFloat(realAvaxBalance.formatted) * avaxPrice,
                        logoUri: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=024'
                    });
                    console.log('AVAX added to tokens array');
                }

                // Add Real ERC-20s (USDC)
                console.log('Processing ERC20 balances:', { hasErc20Balances: !!erc20Balances, erc20Balances });
                if (erc20Balances) {
                    erc20Balances.forEach((result, index) => {
                        console.log(`ERC20 token ${index} (${REAL_TOKENS[index].symbol}):`, { status: result.status, result: result.result?.toString(), error: result.error });
                        if (result.status === 'success' && result.result) {
                            const tokenInfo = REAL_TOKENS[index];
                            const balance = result.result as bigint;

                            // Only add if balance > 0
                            if (balance > 0n) {
                                const formattedBalance = Number(balance) / (10 ** tokenInfo.decimals);
                                const price = tokenInfo.price; // Use fallback price (1.00 for USDC)

                                tokens.push({
                                    address: tokenInfo.address,
                                    name: tokenInfo.name,
                                    symbol: tokenInfo.symbol,
                                    decimals: tokenInfo.decimals,
                                    balance: balance.toString(),
                                    price: { price: price, currency: 'usd' },
                                    value: formattedBalance * price,
                                    logoUri: tokenInfo.logoUri
                                });
                                console.log(`Added ${tokenInfo.symbol} to tokens array`);
                            } else {
                                console.log(`Skipped ${tokenInfo.symbol} - balance is 0`);
                            }
                        }
                    });
                }
                // We fetch from mockBackend so that if we "swap" them, they disappear.
                const mockTokens = await mockBackend.getBalances();
                console.log('Mock dust tokens:', mockTokens.length);

                mockTokens.forEach(mockToken => {
                    tokens.push({
                        ...mockToken,
                        price: { price: mockToken.price.price, currency: 'usd' }
                    });
                });
                console.log('Mock dust tokens added to array');

                console.log('Final tokens array (real mode):', tokens);
                return tokens;
            }

            return await mockBackend.getBalances();
        },
        enabled: isConnected,
        refetchInterval: 30000, // Refresh balances every 30s
    });
}
