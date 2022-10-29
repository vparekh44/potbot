import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useCookies } from "react-cookie";
import { supabase } from "../lib/supabaseClient";
import { Web3Button, useAccount } from "@web3modal/react";
import { useSignMessage } from "@web3modal/react";
import { useDisconnect } from "@web3modal/react";
import { toast } from "react-toastify";

import jwt from "jsonwebtoken";

interface AuthProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface User {
  id: string;
  walletAddress: string;
}

export const ACCESS_TOKEN_COOKIE = "access_token";

export const UserContext = createContext<User | null>(null);
export const SetUserContext = createContext<
  Dispatch<SetStateAction<User | null>>
>(() => {});

export const LoadingContext = createContext<boolean>(false);

export const LogoutContext = createContext<() => void>(() => {});

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_COOKIE]);

  const [nonce, setNonce] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const { account } = useAccount();
  const disconnect = useDisconnect();
  const {
    data: signature,
    error: signatureError,
    signMessage,
  } = useSignMessage({ message: nonce });

  const logout = async () => {
    setNonce("");
    removeCookie(ACCESS_TOKEN_COOKIE);
    disconnect();
    setUser(null);
    supabase.auth.signOut();
    toast.dismiss();

  };

  const getUserData = async (userId: string) => {
    setIsUserLoading(true);
    const { data: userData, error } = await supabase
      .from("users")
      .select("*, profile:profiles_user_id_fkey(*)")
      .eq("id", userId)
      .single();

    if (error) {
      console.log(
        "[Supabase]: Failed to load user data using the access token",
        error.message
      );
      logout();
    }

    if (userData) {
      setUser({
        //@ts-ignore
        id: userData.id,
        walletAddress: userData.wallet_address,
      });
    }
    setIsUserLoading(false);
  };

  const fetchNonce = async () => {
    try {
      const response = await fetch("/api/auth/createNonce", {
        method: "POST",
        body: JSON.stringify({
          walletAddress: account.address,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { nonce } = await response.json();

      if (nonce) {
        setNonce(nonce);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const authenticate = async () => {
    try {
      const response = await fetch("/api/auth/verifyNonce", {
        method: "POST",
        body: JSON.stringify({
          walletAddress: account.address,
          nonce,
          signature,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { user, token } = await response.json();
      console.log("received", user);
      setCookie(ACCESS_TOKEN_COOKIE, token, {
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
      });

      setUser({
        id: user?.id,
        walletAddress: user?.walletAddress,
      });

      setNonce("");
      toast.dismiss();
      toast.success("Logged in!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (signature) {
      authenticate();
    }
  }, [signature]);

  useEffect(() => {
    if (!nonce && signatureError) {
      toast.error("Oops, you denied the signature request");
      logout();
    }
  }, [signatureError]);

  useEffect(() => {
    if (nonce && !user) {
      toast.loading("Please sign the nonce...");
      signMessage();
    }
  }, [nonce, user]);

  useEffect(() => {
    if (account.isConnected && !user && !isUserLoading) {
      console.log("fetching nonce");
      fetchNonce();
    }
  }, [account.isConnected, user]);

  useEffect(() => {
    if (cookies.access_token && !user) {
      supabase.auth.setSession(cookies.access_token);
      const payload = jwt.decode(cookies.access_token) as jwt.JwtPayload;
      const userId = payload?.user_metadata?.id;
      if (userId) {
        getUserData(userId);
      }
    }
  }, [cookies.access_token, user]);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        <LogoutContext.Provider value={logout}>
          <LoadingContext.Provider value={isUserLoading}>
            {children}
          </LoadingContext.Provider>
        </LogoutContext.Provider>
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
};

export function useUserData(): User | null {
  const userData = useContext(UserContext);
  return userData;
}

export function useSetUserData() {
  const setUser = useContext(SetUserContext);
  return (user: User) => {
    setUser(user);
  };
}

export function useIsLoading() {
  return useContext(LoadingContext);
}

export function useLogout(): () => void {
  const logout = useContext(LogoutContext);
  return logout;
}

export default AuthProvider;
