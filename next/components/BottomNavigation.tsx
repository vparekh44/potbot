import classNames from "classnames";
import { useRouter } from "next/router";
import { CgHome, CgProfile, CgPoll, CgEnter } from "react-icons/cg";
import { useUserData } from "../contexts/AuthContext";

export const BottomNavigation = () => {
  const router = useRouter();
  const user = useUserData();

  return (
    <div className="btm-nav w-full sm:invisible">
      <button
        onClick={() => router.push("/settings")}
        className={classNames({ "active": router.asPath === "" })}
      >
        <CgPoll className="h-6 w-6" />
      </button>
      <button
        onClick={() => router.push("/")}
        className={classNames({ "active": router.asPath === "/" })}
      >
        <CgHome className="h-6 w-6" />
      </button>
      <button
        onClick={() => {}}
        className={classNames({ "active": router.asPath === "" })}
      >
        {user ? (
          <CgProfile className="h-6 w-6" />
        ) : (
          <CgEnter className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};
