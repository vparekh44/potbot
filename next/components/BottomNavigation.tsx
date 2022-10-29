import classNames from "classnames";
import { useRouter } from "next/router";
import { CgHome, CgProfile, CgPoll, CgEnter } from "react-icons/cg";
import { useUserData } from "../contexts/AuthContext";

export const BottomNavigation = () => {
  const router = useRouter();
  const user = useUserData();

  return (
    <div className="btm-nav w-full">
      <button
        onClick={() => router.push("/settings")}
        className={classNames({ active: router.asPath === "settings" })}
      >
        <CgPoll className="h-6 w-6" />
      </button>
      <button
        onClick={() => router.push("/")}
        className={classNames({ active: router.asPath === "leaderboard" })}
      >
        <CgHome className="h-6 w-6" />
      </button>
      <button
        onClick={() => router.push("/settings")}
        className={classNames({ active: router.asPath === "settings" })}
      >
        {user ? <CgProfile className="h-6 w-6" /> : <CgEnter className="h-6 w-6" />}
      </button>
    </div>
    //   <div className="btm-nav w-full lg:w-1/2 mx-auto">
    //     <button
    //       onClick={() => router.push("/profile")}
    //       // disabled={!user}
    //       className={classNames({ active: router.asPath === "profile" })}
    //     >
    //       <GoPerson  />
    //     </button>

    //     <button
    //       onClick={() => router.push("/settings")}
    //       className={classNames({ active: router.asPath === "settings" })}
    //     >
    //       <FiSettings />
    //     </button>
    //   </div>
  );
};
