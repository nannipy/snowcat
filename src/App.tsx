import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { config } from './wagmi';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { useMockWallet } from './hooks/useMockWallet';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isConnected } = useMockWallet();
    if (!isConnected) return <Navigate to="/" replace />;
    return <>{children}</>;
}

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <DashboardPage />
                                        </Layout>
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;
