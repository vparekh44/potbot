import { useRouter } from "next/router";
import { FiSettings, FiLogIn } from "react-icons/fi";
import { GiTeapot } from "react-icons/gi";
import { GoPerson } from "react-icons/go";

interface LayoutProps {
  children: JSX.Element;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div>{children}</div>
      <nav>
        <Menu />
      </nav>
    </>
  );
};

const Menu = () => {
  const router = useRouter();
  const user = null; // TODO: change this to when we have the auth login done.

  const goTo = () => {};
  return (
    <>
      <div className="btm-nav w-1/2 mx-auto">
        {user && (
          <button onClick={() => {}}>
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
