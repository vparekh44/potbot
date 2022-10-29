import { useAccount, useConnectModal } from "@web3modal/react";
import classNames from "classnames";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgEnter, CgHome, CgPoll, CgProfile } from "react-icons/cg";
import { TbMoon, TbSun } from "react-icons/tb";
import { useLogout, useUserData } from "../contexts/AuthContext";

export const TopNavigation = () => {
  const { theme, setTheme } = useTheme();
  const { open: openLoginModal } = useConnectModal();
  const logout = useLogout();
  const { account } = useAccount();
  const router = useRouter();
  const user = useUserData();
console.log(user)
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
          <CgPoll className="h-6 w-6" />
          Leaderboard
        </button>
        <button onClick={() => router.push("/")} className={"btn gap-2"}>
          <CgHome className="h-6 w-6" />
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
          {user ? (
            <>
              <CgProfile className="h-6 w-6" />
              Profile
            </>
          ) : (
            <>
              <CgEnter className="h-6 w-6" />
              Login
            </>
          )}
        </button>
        <button
          className={"btn gap-2"}
          onClick={toggleTheme}
        >
          {theme !== "dark" ? <TbMoon size={24} /> : <TbSun size={24} />}
        </button>
      </div>
    </div>
  );
};
