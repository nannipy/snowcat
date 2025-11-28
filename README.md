# 🐱❄️ Snowcat
> **"Groom your Avalanche Wallet to perfection."**

![Status](https://img.shields.io/badge/Hackathon-Avalanche_C--Chain-red)
![Mode](https://img.shields.io/badge/Mode-Grooming_&_Burying-orange)
![Stack](https://img.shields.io/badge/Tech-React_Wagmi_1inch-blue)

**Snowcat** è il tuo operatore di piste personale su Avalanche. È una dApp "serverless" costruita in 24 ore che ti aiuta a gestire la "polvere" (dust) nel tuo wallet: compatta i piccoli importi in AVAX utilizzabili o seppellisce le shitcoin indesiderate.

---

## 🏔 Il Problema: Wallet disordinati
Dopo mesi di utilizzo della DeFi su Avalanche, il tuo wallet sembra una pista da sci a fine giornata: piena di buche e detriti.
*   Residui di swap (0.0003 USDC).
*   Token di airdrop scam o falliti.
*   Disordine visivo che nasconde il tuo vero portfolio.

## 🚜 La Soluzione Snowcat
Snowcat passa sul tuo wallet e lo "batte" (grooms) per renderlo liscio e pulito.
1.  **Sniffing (Scan):** Fiuta automaticamente tutti i token sulla C-Chain.
2.  **Grooming (Swap):** Aggrega la liquidità (via 1inch/TraderJoe) per convertire il dust in **AVAX**.
3.  **Burying (Burn):** Se il token è spazzatura e non vale il gas per lo swap, Snowcat lo "seppellisce" inviandolo all'indirizzo `0x...dEaD`.

---

## 🛠 Tech Stack (The Engine)

*   **Chassis (Frontend):** React + Vite + TypeScript + TailwindCSS.
*   **Tracks (Blockchain):** Wagmi + Viem connessi a **Avalanche C-Chain**.
*   **Hydraulics (Data):**
    *   **1inch Fusion API:** Per calcolare le rotte di swap ottimali (Pathfinder).
    *   **Glacier API (Avalanche):** Per la lettura rapida dei saldi token.
*   **Cabin (Wallet):** Supporto nativo per **Core Wallet** e MetaMask.

---

## 🎮 Come si usa

### 1. Sniff 👃
Connetti il wallet. Snowcat mostrerà una lista di "Dust Cards" per ogni asset con valore `< $5`.

### 2. Decision Time 🐾
Per ogni token hai due opzioni:
*   🟢 **GROOM:** Esegue uno swap verso AVAX.
    *   *Check:* Snowcat ti avvisa se `Gas Fee > Token Value`.
*   🔴 **BURY:** Invia il token al cimitero (Burn address). Ideale per token scam che vuoi rimuovere dalla vista.

---

## 🥚 Easter Eggs (Purr-fect Edition)

Abbiamo nascosto delle funzionalità segrete per l'Hackathon:

1.  **Purr Mode (Feedback Aptico):**
    *   Se visualizzi il sito da mobile e completi uno swap, il telefono vibrerà simulando le fusa di un gatto.

2.  **Konami Cat:**
    *   Codice: `↑ ↑ ↓ ↓ ← → ← → B A`
    *   **Effetto:** Appaiono impronte di zampa arancioni su tutto lo schermo.
    *   Il cursore diventa una zampa.
    *   Quando fai "Bury" (Burn) su un token, si sente il suono di un gatto che copre la lettiera.

---

## 🚀 Installazione & Setup

1.  **Clona il repo:**
    ```bash
    git clone https://github.com/tuo-team/snowcat.git
    ```

2.  **Installa:**
    ```bash
    npm install
    ```

3.  **Configura (.env):**
    ```env
    VITE_WALLET_CONNECT_ID=...
    VITE_1INCH_API_KEY=...
    ```

4.  **Accendi i motori:**
    ```bash
    npm run dev
    ```

---

## ⚠️ Hackathon Disclaimer
Snowcat è un MVP sviluppato in 24 ore.
*   **Smart Contracts:** Non usiamo contratti custom, interagiamo direttamente con i Router verificati esistenti.
*   **Sicurezza:** Le chiavi API sono esposte lato client (per la demo). Non usare con fondi ingenti.

---

Made with 🐟 and ❄️ on **Avalanche**s