import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { Web3Modal } from "@web3modal/react";
import { chains, providers } from "@web3modal/ethereum";
import { useState, useEffect } from "react";
import AuthProvider from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

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
      <Head>
        <title>PotBot</title>
        <meta
          property="og:title"
          content="Quantify your reputation on-chain!"
        />
        <meta property="og:site_name" content="PotBot" />
        <meta
          property="og:description"
          name="description"
          content="Quantify your reputation on-chain! "
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/images/potted-plant_1fab4.png?t=2022-10-29T14%3A27%3A45.918Z"
        />
        <meta
          property="og:image"
          content="https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/images/potted-plant_1fab4.png?t=2022-10-29T14%3A27%3A45.918Z"
        />
        <link rel="canonical" href="https://potbot.club/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/images/potted-plant_1fab4.png?t=2022-10-29T14%3A27%3A45.918Z"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/images/potted-plant_1fab4.png?t=2022-10-29T14%3A27%3A45.918Z"
          rel="apple-touch-icon"
        />
        <meta
          property="twitter:title"
          content="Potbot - Quantify your reputation on-chain!"
        />
        <meta
          property="twitter:description"
          content="Quantify your reputation on-chain!"
        />
        <meta
          property="twitter:image"
          content="https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/images/potted-plant_1fab4.png?t=2022-10-29T14%3A27%3A45.918Z"
        />
      </Head>
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
