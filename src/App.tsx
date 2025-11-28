import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { config } from './wagmi';
import { DustSweeper } from './components/DustSweeper';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#ffffff', // White accent for minimal look
            accentColorForeground: 'black',
            borderRadius: 'none', // Sharp corners
            fontStack: 'system',
            overlayBlur: 'none',
          })}
        >
          <div className="min-h-screen bg-background text-text font-sans selection:bg-white/20">
            
            <header className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-none flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-black"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </div>
                <h1 className="text-lg font-medium tracking-tight text-white">
                  DustSweeper
                </h1>
              </div>
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
            </header>

            <main className="container mx-auto px-4 py-20 max-w-3xl">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6 text-white tracking-tighter">
                  Clean Your Wallet.
                </h2>
                <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
                  Eliminate dust balances. Convert to AVAX. <br/>
                  Simple. Efficient.
                </p>
              </div>

              <DustSweeper />
            </main>

            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#09090b',
                  color: '#ededed',
                  border: '1px solid #27272a',
                  borderRadius: '0px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                },
                success: {
                  iconTheme: {
                    primary: '#ccff00',
                    secondary: '#000000',
                  },
                },
              }}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
