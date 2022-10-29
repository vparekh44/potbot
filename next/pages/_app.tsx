
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { Web3Modal } from "@web3modal/react";
import { chains, providers } from "@web3modal/ethereum";
import { useState, useEffect } from "react";
import AuthProvider from "../contexts/AuthContext";
import { ToastContainer } from 'react-toastify';

import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");

const config = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  theme: "dark" as const,
  accentColor: "default" as const,
  ethereum: {
    appName: "web3Modal",
    autoConnect: true,
    chains: [chains.mainnet],
    providers: [
      providers.walletConnectProvider({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      }),
    ],
  },
};

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
          <Web3Modal config={config} />
          <ToastContainer />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
