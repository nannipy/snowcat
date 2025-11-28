# ❄️ SnowCat
> **"Lo Spazzaneve per il tuo Avalanche Wallet."**

![Status](https://img.shields.io/badge/Status-Hackathon_MVP-red)
![Network](https://img.shields.io/badge/Network-Avalanche_C--Chain-red)
![Powered By](https://img.shields.io/badge/Powered_by-Glacier_API_%26_1inch-blue)

**Snowplow** è una dApp ultra-veloce creata in 24h per l'Avalanche Hackathon. Risolve il problema della frammentazione della liquidità "spazzando via" i piccoli residui di token (Dust) e convertendoli in **AVAX** puro in meno di un secondo.

---

## 🏔 Il Problema
L'ecosistema Avalanche è vibrante, ma tra airdrop, farming su Trader Joe e bridge token, i wallet si riempiono di "polvere digitale":
1.  Token con valore < $1.
2.  Residui di WETH.e, WBTC.e o memecoin finite male.
3.  Il disordine rende difficile vedere il vero valore del portafoglio.

## 🔺 La Soluzione "Avalanche-Native"
Sfruttando la **finalità sub-second** di Avalanche, Snowplow offre un'esperienza di pulizia istantanea:
*   **Glacier Vision:** Scansiona il wallet identificando i token "dust".
*   **Smart Routing:** Aggrega la liquidità di Trader Joe e Pangolin (via 1inch) per trovare il miglior prezzo di swap anche per importi minuscoli.
*   **Gas Efficiency:** Calcola se il costo in nAVAX vale la candela.

---

## 🛠 Tech Stack

*   **Frontend:** React + Vite + TypeScript
*   **Blockchain Interaction:** Wagmi + Viem (Configurati su C-Chain)
*   **Wallet Support:** Ottimizzato per **Core Wallet** e MetaMask.
*   **Data Layer:**
    *   **1inch API:** Per l'esecuzione degli swap e routing.
    *   **(Opzionale) Avalanche Glacier API:** Per l'indicizzazione rapida dei saldi.

---

## ⚙️ Come Funziona (Under the Hood)

### 1. The Survey (Scan)
L'app si connette alla C-Chain (Chain ID `43114`) e recupera l'elenco dei token ERC-20.
Filtra tutto ciò che è: `0.01$ < Valore < 5.00$`.

### 2. The Plow (Swap)
Per ogni token selezionato:
1.  **Check Allowance:** Verifica se il router ha i permessi.
2.  **Approve:** Se necessario, invia tx di approvazione.
3.  **Swap:** Esegue lo swap verso **AVAX** nativo.
    *   *Nota:* Usiamo AVAX come destinazione perché è il "carburante" della rete.

### 3. The Meltdown (Burn)
Se lo swap non è conveniente (Gas > Valore), l'utente può "sciogliere" il token inviandolo all'indirizzo `0x00...dEaD`.

---

## 🥚 Easter Eggs (Hackathon Edition)

Abbiamo nascosto delle sorprese a tema Avalanche:

1.  **Yeti Mode:**
    *   Se il saldo totale recuperato supera 1 AVAX, appare un'animazione di uno Yeti che festeggia sullo schermo.

2.  **Konami Snow:**
    *   Codice: `↑ ↑ ↓ ↓ ← → ← → B A`
    *   **Effetto:** Inizia a nevicare sopra la UI (effetto particellare CSS) e il cursore diventa uno spazzaneve. Cliccando sui token, vengono spazzati via lateralmente invece di scomparire semplicemente.

---

## 📦 Installazione

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/tuo-team/snowplow.git
    npm install
    ```

2.  **Environment:**
    ```env
    VITE_WALLET_CONNECT_ID=...
    VITE_1INCH_API_KEY=...
    ```

3.  **Run:**
    ```bash
    npm run dev
    ```

---

## ⚠️ Hackathon Disclaimer
Progetto sviluppato in 24 ore.
*   Non auditato.
*   Testato su Avalanche Mainnet (C-Chain).
*   **Attenzione:** Le API Key sono esposte nel client per necessità di demo.

---

Made with ❤️ on 🔺 **Avalanche**