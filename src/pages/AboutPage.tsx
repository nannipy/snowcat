import { Github, Heart, Layers, Users } from 'lucide-react';

export function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    About Snowcat
                </h1>
                <p className="text-xl text-muted max-w-2xl mx-auto">
                    Cleaning up the crypto world, one dust particle at a time.
                </p>
            </div>

            {/* Mission Section */}
            <div className="glass-card p-8 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-accent/10 rounded-xl">
                        <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    Snowcat was created with a simple yet powerful goal: to help users manage their crypto "dust" – those tiny, annoying balances that clutter your wallet. 
                    We believe that a clean wallet is a happy wallet. By aggregating these small amounts, we not only tidy up your portfolio but also unlock value that was previously stuck.
                </p>
            </div>

            {/* Avalanche Section */}
            <div className="glass-card p-8 rounded-2xl space-y-4 border-l-4 border-l-red-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <img src="https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=026" alt="Avalanche" className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Powered by Avalanche</h2>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    This project wouldn't be possible without the incredible technology behind <span className="font-bold text-text">Avalanche</span>. 
                    Its blazing fast finality, low fees, and eco-friendly consensus mechanism make it the perfect home for Snowcat. 
                    We are proud to build on such a robust and developer-friendly ecosystem.
                </p>
            </div>

            {/* Tech Stack Section */}
            <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Open Source Tech Stack</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { name: 'React', desc: 'UI Library', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
                        { name: 'Vite', desc: 'Build Tool', logo: 'https://cdn.simpleicons.org/vite/646CFF' },
                        { name: 'Tailwind CSS', desc: 'Styling', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
                        { name: 'Wagmi', desc: 'Web3 Hooks', logo: 'https://wagmi.sh/logo-light.svg', alt: 'Wagmi' },
                        { name: 'Viem', desc: 'Ethereum Interface', logo: 'https://viem.sh/icon-light.png', alt: 'Viem' },
                        { name: 'RainbowKit', desc: 'Wallet Connection', logo: 'https://raw.githubusercontent.com/rainbow-me/rainbowkit/main/site/public/rainbow.svg', alt: 'RainbowKit' },
                    ].map((tech) => (
                        <div key={tech.name} className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent/50 transition-colors">
                            <div className="w-10 h-10 flex items-center justify-center bg-surface rounded-lg p-1.5 shadow-sm">
                                <img src={tech.logo} alt={tech.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{tech.name}</h3>
                                <p className="text-sm text-muted">{tech.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Collaboration Section */}
            <div className="glass-card p-8 rounded-2xl text-center space-y-6">
                <div className="inline-flex p-3 bg-success/10 rounded-xl mb-2">
                    <Users className="w-6 h-6 text-success" />
                </div>
                <h2 className="text-2xl font-bold">Join the Clutter-Free Revolution</h2>
                <p className="text-muted max-w-xl mx-auto">
                    We are open source and ready to collaborate! If you want to help make the crypto world better, cleaner, and more efficient, join us.
                </p>
                <div className="flex justify-center gap-4">
                    <a 
                        href="https://github.com/nannipy/snowcat" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/20"
                    >
                        <Github className="w-5 h-5" />
                        Contribute on GitHub
                    </a>
                </div>
            </div>
        </div>
    );
}
