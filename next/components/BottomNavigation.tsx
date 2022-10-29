import { useConnectModal } from "@web3modal/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useUserData } from "../contexts/AuthContext";

export const BottomNavigation = () => {
  const router = useRouter();
  const user = useUserData();
  const { open: openLoginModal } = useConnectModal();

  return (
    <div className="btm-nav w-full sm:invisible">
      <button
        onClick={() => router.push("/")}
        className={classNames({ active: router.asPath === "/" })}
      >
        🏠
      </button>
      <button
        onClick={() => {
          user ? router.push(`/user/${user.walletAddress}`) : openLoginModal();
        }}
        className={classNames({ active: router.asPath.includes('user') })}
      >
        {user ? "👤" : "🚪"}
      </button>
    </div>
  );
};
