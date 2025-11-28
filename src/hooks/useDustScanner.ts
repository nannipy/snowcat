import { useAccount, useReadContracts } from 'wagmi';
import { TOKEN_WHITELIST, ERC20_ABI } from '../constants';
import { formatUnits } from 'viem';

export interface TokenBalance {
    symbol: string;
    name: string;
    address: `0x${string}`;
    balance: bigint;
    formatted: string;
    decimals: number;
}

export function useDustScanner() {
    const { address } = useAccount();

    const contracts = TOKEN_WHITELIST.map((token) => ({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
    }));

    const { data, isError, isLoading, refetch } = useReadContracts({
        contracts: contracts as any, // Type assertion needed for dynamic contracts array sometimes
        query: {
            enabled: !!address,
        },
    });

    const dustTokens: TokenBalance[] = [];

    if (data && address) {
        data.forEach((result, index) => {
            if (result.status === 'success' && typeof result.result === 'bigint') {
                const balance = result.result;
                if (balance > 0n) {
                    const token = TOKEN_WHITELIST[index];
                    dustTokens.push({
                        ...token,
                        balance,
                        formatted: formatUnits(balance, token.decimals),
                    });
                }
            }
        });
    }

    return {
        dustTokens,
        isLoading,
        isError,
        refetch,
    };
}
