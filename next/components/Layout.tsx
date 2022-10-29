import { useAccount, useConnectModal, Web3Button } from "@web3modal/react";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { FiSettings, FiLogIn } from "react-icons/fi";
import { GiTeapot } from "react-icons/gi";
import { GoPerson } from "react-icons/go";
import { TbMoon, TbSun } from "react-icons/tb";
import { useLogout } from "../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="px-6 pt-20">{children}</div>
      <RightSide />
      <Menu />
    </>
  );
};

const RightSide = () => {
  const { theme, setTheme } = useTheme();
  const { isOpen, open, close } = useConnectModal();
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
    <div className="fixed right-3 top-5 flex gap-3">
      <button onClick={account.isConnected ? handleDisconnect : handleConnect} className="btn-primary">{account.isConnected ? "Disconnect" : "Connect"}</button>
      <div className="cursor-pointer my-auto" onClick={toggleTheme}>
        {theme !== "dark" ? <TbMoon size={24} /> : <TbSun size={24} />}
      </div>
    </div>
  );
};

const Menu = () => {
  const router = useRouter();
  const user = null; // TODO: change this to when we have the auth login done.

  return (
    <div className="btm-nav w-full lg:w-1/2 mx-auto">
      <button
        onClick={() => router.push("/profile")}
        // disabled={!user}
        className={classNames({ active: router.asPath === "profile" })}
      >
        <GoPerson />
      </button>
      <button
        onClick={() => router.push("/leaderboard")}
        className={classNames({ active: router.asPath === "leaderboard" })}
      >
        <GiTeapot />
      </button>
      <button
        onClick={() => router.push("/settings")}
        className={classNames({ active: router.asPath === "settings" })}
      >
        <FiSettings />
      </button>
    </div>
  );
};

export default Layout;
