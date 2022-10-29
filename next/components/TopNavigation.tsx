import { useAccount, useConnectModal } from "@web3modal/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { TbMoon, TbSun } from "react-icons/tb";
import { useLogout } from "../contexts/AuthContext";

export const TopNavigation = () => {
  const { theme, setTheme } = useTheme();
  const { open } = useConnectModal();
  const logout = useLogout();
  const { account } = useAccount();

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
      <div className="flex-none">
        <button
          onClick={account.isConnected ? handleDisconnect : handleConnect}
          className="btn btn-ghost normal-case text-xl"
        >
          {account.isConnected ? "Disconnect" : "Connect"}
        </button>
        <button
          className="btn btn-ghost normal-case text-xl"
          onClick={toggleTheme}
        >
          {theme !== "dark" ? <TbMoon size={24} /> : <TbSun size={24} />}
        </button>
      </div>
    </div>
  );
};
