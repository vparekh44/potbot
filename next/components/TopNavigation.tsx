import { useAccount, useConnectModal } from "@web3modal/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUserData } from "../contexts/AuthContext";

export const TopNavigation = () => {
  const { theme, setTheme } = useTheme();
  const { open: openLoginModal } = useConnectModal();
  const router = useRouter();
  const user = useUserData();

  const toggleTheme = () => {
    theme !== "dark" ? setTheme("dark") : setTheme("light");
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
        🪴 PotBot
        </Link>
      </div>
      <div className="flex-none gap-2 hidden sm:flex">
        <button onClick={() => router.push("/")} className={"btn gap-2"}>
          Home
        </button>
        <button
          onClick={() => {
            user
              ? router.push(`/user/${user.walletAddress}`)
              : openLoginModal();
          }}
          className={"btn gap-2"}
        >
          {user ? <>⚡ Claim</> : <>Login</>}
        </button>
        <button className={"btn gap-2 text-2xl"} onClick={toggleTheme}>
          {theme !== "dark" ? "🌚" : "🌝"}
        </button>
      </div>
    </div>
  );
};
