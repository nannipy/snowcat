/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WALLET_CONNECT_ID: string
    readonly VITE_1INCH_API_KEY: string
    readonly VITE_TEST_PRIVATE_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
