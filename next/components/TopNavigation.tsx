import { useAccount, useConnectModal } from "@web3modal/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLogout, useUserData } from "../contexts/AuthContext";
import Emoji from "./Emoji";

export const TopNavigation = () => {
  const { theme, setTheme } = useTheme();
  const { open: openLoginModal } = useConnectModal();
  const logout = useLogout();
  const { account } = useAccount();
  const router = useRouter();
  const user = useUserData();
  console.log(user);
  const toggleTheme = () => {
    theme !== "dark" ? setTheme("dark") : setTheme("light");
  };

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          POTBOT
        </Link>
      </div>
      <div className="flex-none gap-2">
        <button
          onClick={() => router.push("/leaderboard")}
          className={"btn gap-2"}
        >
          📊 Leaderboard
        </button>
        <button onClick={() => router.push("/")} className={"btn gap-2"}>
          🏠 Home
        </button>
        <button
          onClick={() => {
            user
              ? router.push(`/user/${user.walletAddress}`)
              : openLoginModal();
          }}
          className={"btn gap-2"}
        >
          {user ? (
            <>👤 Profile</>
          ) : (
            <>
              🚪 Login
            </>
          )}
        </button>
        <button className={"btn gap-2"} onClick={toggleTheme}>
          {theme !== "dark" ? "🌚" : "🌝"}
        </button>
      </div>
    </div>
  );
};
