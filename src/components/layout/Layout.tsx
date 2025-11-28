import { Header } from './Header';
import { useKonamiCode } from '../../hooks/useKonamiCode';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const isKonamiMode = useKonamiCode();

    return (
        <div className={`min-h-screen bg-background font-sans text-text selection:bg-accent selection:text-white ${isKonamiMode ? 'konami-mode' : ''}`}>
            <Header />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-border py-6 text-center text-sm text-muted">
                <p>Made with 🐟 and ❄️ on <strong>Avalanche</strong></p>
                {isKonamiMode && <p className="mt-2 text-accent animate-bounce">🐾 Purr Mode Activated 🐾</p>}
            </footer>
        </div>
    );
}
