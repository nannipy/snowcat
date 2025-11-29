import { Header } from './Header';
import { useKonamiCode } from '../../hooks/useKonamiCode';
import { SnowEffect } from '../effects/SnowEffect';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const isKonamiMode = useKonamiCode();

    return (
        <div className={`min-h-screen bg-background font-sans text-text selection:bg-accent selection:text-white ${isKonamiMode ? 'konami-mode' : ''}`}>
            <SnowEffect />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-32">
                {children}
            </main>
            <footer className="border-t border-border py-6 text-center text-sm text-muted">
                <p>Made with ❤️ by <a href="https://github.com/nannipy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@nannipy</a> <a href="https://github.com/nnicholas04" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@nnicholas04</a> <a href="https://github.com/youngnittii" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@youngnittii</a> ❄️<a href="https://github.com/ava-labs/avalanchego" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><strong>Avalanche</strong></a></p>
                {isKonamiMode && <p className="mt-2 text-accent animate-bounce">🐾 Purr Mode Activated 🐾</p>}
            </footer>
        </div>
    );
}
