'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';

import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi';
import {
    goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { Provider } from 'react-redux';
import { rollux } from '@/networks/rollux';
import store from '@/store';
import { ThemeProvider } from '@mui/material';
import theme from './theme';


const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        rollux,
        mainnet,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
    ],
    [publicProvider()]
);

const demoAppInfo = {
    appName: 'DaoSYS test UI',
};

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <Provider store={store}>
            <WagmiConfig config={wagmiConfig}>
                <ThemeProvider theme={theme}>
                    <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
                        {mounted && children}
                    </RainbowKitProvider>
                </ThemeProvider>
            </WagmiConfig>
        </Provider>
    );
}