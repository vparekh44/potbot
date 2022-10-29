import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserData } from "../contexts/AuthContext";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";
import classNames from "classnames";

const Discord = () => {
  const user = useUserData();
  const router = useRouter();
  const [cookies] = useCookies(["access_token"]);
  const [discordIntegerated, setDiscordIntegerated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const OAUTH_URI = `https://discord.com/api/oauth2/authorize`;
  const { integration_success, provider, user_id, code } = router.query;

  const startDiscordAuthFlow = () => {
    const searchParams = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URI}/api/auth/discord`,
      response_type: "code",
      scope: "identify",
    }).toString();
    const state = {
      userId: user?.id,
      walletAddress: user?.walletAddress,
    };
    window.location.href = `${OAUTH_URI}?${searchParams}&state=${JSON.stringify(
      state
    )}`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const linkDiscord = async (userId: string): Promise<void> => {
    setLoading(true);
    try {
      await axios.get("/api/auth/linkDiscord", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          userId: userId,
        },
      });
      setLoading(false);
      toast.success("Discord connected successfully");
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
      toast.error(
        "Oops, something went wrong. Please try again in a few minutes"
      );
    }
  };

  const handleDiscordDisconnect = async () => {
    try {
      await axios.get("/api/auth/unlinkDiscord", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      setDiscordIntegerated(false);
      toast.success("Discord disconnected successfully");
    } catch (error) {
      console.log("Error", error);
      toast.error(
        "Oops, something went wrong. Please try again in a few minutes"
      );
    }
  };

  const getDiscordId = async (userId: string): Promise<void> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discord_integrations")
      .select("*")
      .eq("user_id", userId);
    if (data && data.length) {
      setDiscordIntegerated(true);
      setLoading(false);
    } else {
      setDiscordIntegerated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (integration_success === "true") {
      linkDiscord(user_id as string);
      if (router.asPath.indexOf("?") > 0) {
        router.push(router.asPath.substring(0, router.asPath.indexOf("?")));
      }
      // setDiscordLoading(false);
    } else if (integration_success === "false") {
      // toast(`Could not connect to ${provider}. Please try again`);
      router.push(router.asPath.substring(0, router.asPath.indexOf("?")));
      // setDiscordLoading(false);
    }
  }, [integration_success, linkDiscord, router, router.query, user_id]);

  useEffect(() => {
    /**
     * Use effect to check to show connect or disconnect discord
     */
    if (user?.id) {
      getDiscordId(user.id);
    }
  }, [user]);


  return (
    <div className="fixed right-4 bottom-10">
      {discordIntegerated ? <button
        className={classNames("btn btn-error", {
          loading: loading,
          disabled: loading,
        })}
        onClick={handleDiscordDisconnect}
      >
        Disconnect Discord
      </button> : <button
        className={classNames("btn btn-primary", {
          loading: loading,
          disabled: loading,
        })}
        onClick={startDiscordAuthFlow}
      >
        Connect Discord
      </button>}
    </div>
  );


};

export default Discord;
