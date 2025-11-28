import { useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { useDustScanner, type TokenBalance } from '../hooks/useDustScanner';
import { ROUTER_ADDRESS, ROUTER_ABI, ERC20_ABI } from '../constants';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function DustSweeper() {
  const { address, isConnected } = useAccount();
  const { dustTokens, isLoading, refetch } = useDustScanner();
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [sweepingState, setSweepingState] = useState<Record<string, 'idle' | 'approving' | 'swapping' | 'done' | 'error'>>({});
  
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const toggleToken = (address: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(address)) {
      newSelected.delete(address);
    } else {
      newSelected.add(address);
    }
    setSelectedTokens(newSelected);
  };

  const toggleAll = () => {
    if (selectedTokens.size === dustTokens.length) {
      setSelectedTokens(new Set());
    } else {
      setSelectedTokens(new Set(dustTokens.map(t => t.address)));
    }
  };

  const sweepToken = async (token: TokenBalance) => {
    try {
      setSweepingState(prev => ({ ...prev, [token.address]: 'approving' }));
      
      // 1. Check Allowance
      if (!publicClient) throw new Error("Public client not found");
      
      const allowance = await publicClient.readContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address!, ROUTER_ADDRESS as `0x${string}`],
      });

      if (allowance < token.balance) {
        toast.loading(`Approving ${token.symbol}...`, { id: `approve-${token.symbol}` });
        const approveHash = await writeContractAsync({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [ROUTER_ADDRESS as `0x${string}`, token.balance],
        });
        
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        toast.success(`Approved ${token.symbol}`, { id: `approve-${token.symbol}` });
      }

      // 2. Swap
      setSweepingState(prev => ({ ...prev, [token.address]: 'swapping' }));
      toast.loading(`Swapping ${token.symbol}...`, { id: `swap-${token.symbol}` });

      // Calculate deadline (20 minutes from now)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);
      
      // Path: Token -> AVAX (WAVAX)
      const WAVAX = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"; // Fuji WAVAX
      
      const swapHash = await writeContractAsync({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'swapExactTokensForAVAX',
        args: [
          token.balance,
          0n, // amountOutMin (0 for MVP, risky in prod due to slippage)
          [token.address, WAVAX],
          address!,
          deadline
        ],
      });

      await publicClient.waitForTransactionReceipt({ hash: swapHash });
      
      toast.success(`Swapped ${token.symbol} for AVAX!`, { id: `swap-${token.symbol}` });
      setSweepingState(prev => ({ ...prev, [token.address]: 'done' }));
      
      // Refresh list
      refetch();

    } catch (error) {
      console.error(error);
      toast.error(`Failed to sweep ${token.symbol}`, { id: `swap-${token.symbol}` });
      setSweepingState(prev => ({ ...prev, [token.address]: 'error' }));
    }
  };

  const handleSweepAll = async () => {
    const tokensToSweep = dustTokens.filter(t => selectedTokens.has(t.address));
    for (const token of tokensToSweep) {
      if (sweepingState[token.address] === 'done') continue;
      await sweepToken(token);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-none bg-surface/30">
        <div className="w-16 h-16 bg-surface border border-border rounded-none flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Connect Wallet</h2>
        <p className="text-muted text-sm">Connect your wallet to scan for dust.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
        <p className="text-muted text-sm font-mono">SCANNING_ASSETS...</p>
      </div>
    );
  }

  if (dustTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border bg-surface/30">
        <div className="w-16 h-16 bg-surface border border-border flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Clean</h2>
        <p className="text-muted text-sm">No dust found in your wallet.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-sm font-mono text-muted uppercase tracking-widest">
          Assets Found ({dustTokens.length})
        </h2>
        <button 
          onClick={toggleAll}
          className="text-xs font-mono text-white hover:text-accent transition-colors uppercase tracking-widest"
        >
          {selectedTokens.size === dustTokens.length ? '[ Deselect All ]' : '[ Select All ]'}
        </button>
      </div>

      <div className="space-y-px bg-border border border-border mb-12">
        <AnimatePresence>
          {dustTokens.map((token) => (
            <motion.div
              key={token.address}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex items-center p-4 bg-background transition-colors duration-200 group",
                selectedTokens.has(token.address) 
                  ? "bg-surface" 
                  : "hover:bg-surface"
              )}
            >
              <div className="relative flex items-center justify-center w-5 h-5 mr-6">
                <input
                  type="checkbox"
                  checked={selectedTokens.has(token.address)}
                  onChange={() => toggleToken(token.address)}
                  disabled={sweepingState[token.address] === 'approving' || sweepingState[token.address] === 'swapping' || sweepingState[token.address] === 'done'}
                  className="peer appearance-none w-5 h-5 border border-border bg-transparent checked:bg-white checked:border-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                />
                <CheckCircle className="w-3.5 h-3.5 text-black absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-white">{token.symbol}</span>
                  <span className="text-xs text-muted hidden sm:inline-block">{token.name}</span>
                </div>
                <div className="text-sm text-muted font-mono">
                  {token.formatted}
                </div>
              </div>

              <div className="w-24 flex justify-end ml-4">
                {sweepingState[token.address] === 'approving' && (
                  <span className="text-xs font-mono text-muted flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> APPROVING
                  </span>
                )}
                {sweepingState[token.address] === 'swapping' && (
                  <span className="text-xs font-mono text-white flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> SWAPPING
                  </span>
                )}
                {sweepingState[token.address] === 'done' && (
                  <span className="text-xs font-mono text-accent flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> CLEANED
                  </span>
                )}
                {sweepingState[token.address] === 'error' && (
                  <span className="text-xs font-mono text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> FAILED
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-6">
        <button
          onClick={handleSweepAll}
          disabled={selectedTokens.size === 0 || Object.values(sweepingState).some(s => s === 'approving' || s === 'swapping')}
          className={cn(
            "w-full py-5 font-medium text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 border border-transparent",
            selectedTokens.size > 0
              ? "bg-white text-black hover:bg-accent hover:text-black"
              : "bg-surface border-border text-muted cursor-not-allowed"
          )}
        >
          {Object.values(sweepingState).some(s => s === 'approving' || s === 'swapping') ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              SWEEP TO AVAX
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
