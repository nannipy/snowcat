import { createConnector } from 'wagmi';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';

export function privateKeyConnector(privateKey: `0x${string}`) {
    const account = privateKeyToAccount(privateKey);

    const client = createWalletClient({
        account,
        chain: avalancheFuji,
        transport: http()
    });

    return createConnector((config) => ({
        id: 'privateKey',
        name: 'Private Key Wallet',
        type: 'privateKey',

        async connect({ chainId } = {}) {
            const accounts = [account.address] as const;

            config.emitter.emit('change', {
                chainId: chainId ?? avalancheFuji.id,
                accounts
            });

            return {
                accounts,
                chainId: chainId ?? avalancheFuji.id,
            } as any;
        },
        async disconnect() { },
        async getAccounts() {
            return [account.address];
        },
        async getChainId() {
            return avalancheFuji.id;
        },
        async getProvider() {
            return client as any;
        },
        async isAuthorized() {
            return true;
        },
        async switchChain({ chainId }) {
            if (chainId !== avalancheFuji.id) {
                throw new Error('Only Fuji is supported in test mode');
            }
            return avalancheFuji;
        },
        onAccountsChanged() { },
        onChainChanged() { },
        onDisconnect() { },
    }));
}
