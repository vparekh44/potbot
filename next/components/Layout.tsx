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
import { BottomNavigation } from "./BottomNavigation";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="max-w-screen-xl mx-auto">
      <NavBar />
      {children}
      <BottomNavigation />
    </main>
  );
};


export default Layout;
