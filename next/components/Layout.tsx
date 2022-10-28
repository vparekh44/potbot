import { useAccount, Web3Button } from "@web3modal/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { FiSettings, FiLogIn } from "react-icons/fi";
import { GiTeapot } from "react-icons/gi";
import { GoPerson } from "react-icons/go";
import { TbMoon, TbSun } from "react-icons/tb";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div>{children}</div>
      <RightSide />
      <Menu />
    </>
  );
};

const RightSide = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  return (
    <div className="fixed right-3 top-5 flex gap-3">
      <Web3Button />
      {theme !== "dark" && (
        <div
          className="cursor-pointer my-auto"
          onClick={() => setTheme("dark")}
        >
          <TbMoon size={24} />
        </div>
      )}
      {theme !== "light" && (
        <div
          className="cursor-pointer  my-auto"
          onClick={() => setTheme("light")}
        >
          <TbSun size={24} />
        </div>
      )}
    </div>
  );
};

const Menu = () => {
  const router = useRouter();
  const user = null; // TODO: change this to when we have the auth login done.

  const goTo = () => {
    router.push("/");
  };
  return (
    <>
      <div className="btm-nav w-full lg:w-1/2 mx-auto">
        {user && (
          <button onClick={() => {}} disabled={!user}>
            <GoPerson />
          </button>
        )}
        {!user && (
          <button onClick={() => {}}>
            <FiLogIn />
          </button>
        )}
        <button onClick={() => {}} className="active">
          <GiTeapot />
        </button>
        <button onClick={() => {}}>
          <FiSettings />
        </button>
      </div>
    </>
  );
};

export default Layout;
