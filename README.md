# 🐱❄️ Snowcat
> **"Groom your Avalanche Wallet to perfection."**

![Status](https://img.shields.io/badge/Hackathon-Avalanche_Fuji-red)
![Mode](https://img.shields.io/badge/Mode-Hybrid_Demo-orange)
![Stack](https://img.shields.io/badge/Tech-React_Wagmi_RainbowKit-blue)

**Snowcat** is your personal slope operator on Avalanche. It's a "serverless" dApp built in 24 hours that helps you manage "dust" in your wallet: compacting small amounts into usable AVAX or burying unwanted shitcoins.



## 🏔 The Problem: Messy Wallets
After months of DeFi usage on Avalanche, your wallet looks like a ski slope at the end of the day: full of bumps and debris.
*   Swap residues (0.0003 USDC).
*   Scam or failed airdrop tokens.
*   Visual clutter hiding your true portfolio.

## 🚜 The Snowcat Solution
Snowcat grooms your wallet to make it smooth and clean.
1.  **Sniffing (Scan):** Automatically detects all tokens on the C-Chain (Fuji Testnet).
2.  **Grooming (Swap):** Aggregates liquidity to convert dust into **AVAX**.
3.  **Burying (Burn):** If the token is trash, Snowcat "buries" it by sending it to the `0x...dEaD` address.


## 🛠 Tech Stack (The Engine)

*   **Chassis (Frontend):** React + Vite + TypeScript + TailwindCSS.
*   **Tracks (Blockchain):** Wagmi + Viem + RainbowKit connected to **Avalanche Fuji**.
*   **Hydraulics (Data):**
    *   **Glacier API / Wagmi:** For fast token balance reading.
    *   **CoinGecko / Chainlink:** For real-time price feeds.
*   **Cabin (Wallet):** Native support for **Core Wallet** and MetaMask.

## 🎮 How to Use

### 1. Sniff 👃
Connect your wallet. Snowcat will show a list of "Dust Cards" for every asset with a value `< $5`.
*   *Note:* In Hybrid Mode, we also inject some "Mock Dust" tokens so you always have something to clean!

### 2. Decision Time 🐾
For each token, you have two options:
*   🟢 **GROOM:** "Swaps" the dust for AVAX.
    *   *Demo:* Triggers a simulated transaction.
*   🔴 **BURY:** Sends the token to the graveyard (Burn address).
    *   *Real:* Triggers a real blockchain transaction.



## 🥚 Easter Eggs (Purr-fect Edition)

We've hidden some secret features for the Hackathon:

1.  **Purr Mode (Haptic Feedback):**
    *   If viewing on mobile, completing a swap makes the phone vibrate like a purring cat.

2.  **Konami Cat:**
    *   Code: `↑ ↑ ↓ ↓ ← → ← → B A`
    *   **Effect:** Orange paw prints appear all over the screen.
    *   The cursor becomes a paw.
    *   "Burying" a token plays a sound of a cat covering its litter.

---

## 🚀 Installation & Setup

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/nannipy/snowcat.git
    ```

2.  **Install:**
    ```bash
    npm install
    ```

3.  **Configure (.env):**
    ```env
    VITE_WALLET_CONNECT_ID=your_id_here
    ```

4.  **Start Engines:**
    ```bash
    npm run dev
    ```




---

Made with ❤️ by  @nannipy @nnicholas04 @youngnittii ❄️**Avalanche**