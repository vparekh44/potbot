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
      <NavBar />
      <div className="px-6 pt-20">{children}</div>
      <Menu />
    </>
  );
};

const NavBar = () => {
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
        <a className="btn btn-ghost normal-case text-xl">POTBOT</a>
      </div>
      <div className="flex-none">
        <button
          onClick={account.isConnected ? handleDisconnect : handleConnect}
          className="btn btn-ghost normal-case text-xl"
        >
          {account.isConnected ? "Disconnect" : "Connect"}
        </button>
        <button className="btn btn-ghost normal-case text-xl" onClick={toggleTheme}>
          {theme !== "dark" ? <TbMoon size={24} /> : <TbSun size={24} />}
        </button>
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
