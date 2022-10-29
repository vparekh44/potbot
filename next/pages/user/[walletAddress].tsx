import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Emoji from "../../components/Emoji";
import { supabaseService } from "../../lib/supabaseServiceClient";
import Image from "next/image";
import { useLogout } from "../../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import classNames from "classnames";
import {
  getTopEmojisOnUser,
  getTopGiversToUser,
} from "../../services/profileService";
import Discord from "../../components/Discord";

type PageParams = {
  walletAddress: string;
};

type ProfileProps = {
  id: string;
  walletAddress: string;
};

const mockAttestations = [{ date: "2022-01-03" }, { date: "2022-02-05" }];

const UserPage = ({ id, walletAddress }: ProfileProps) => {
  const logout = useLogout();

  return (
    <div className="h-full w-full">
      <>
        <div className="flex gap-5">
          <div className="avatar basis-1/4 flex flex-col">
            <div className="mx-auto mb-5">
              <div className="w-24 relative h-24">
                <Image
                  src="https://placeimg.com/192/192/people"
                  alt="placeholder"
                  className="rounded-full"
                  fill={true}
                  unoptimized={true}
                />
              </div>
            </div>
            <div className="flex mx-auto">
              <h6 className="inline my-auto font-black text-lg">
                Reputation: 3 🍯
              </h6>
            </div>
          </div>
          <div className="px-4 border-l basis-3/4 flex-justify-center">
            <h6 className="text-center"></h6>
            <div className="mb-5">
              <TopAppreciators user_id={id}></TopAppreciators>
            </div>

            <div className="text-2xl">Reactions:</div>
            <div className="my-5">
              <TopEmojisReceived user_id={id} />
            </div>
          </div>
        </div>
      </>
      <Discord />
    </div>
  );
};

interface TopEmojisReceivedProps {
  user_id: string;
}

const TopEmojisReceived = ({ user_id }: TopEmojisReceivedProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topEmojis, setTopEmojis] = useState<any>([]);

  const getTopEmojisReceivedUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getTopEmojisOnUser(user_id);
      if (!error && data) {
        setTopEmojis(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    getTopEmojisReceivedUser();
  }, [getTopEmojisReceivedUser]);

  // in case i need - String.fromCodePoint(0x1f609) - do not remove this.
  return (
    <>
      <div className="flex flex-row w-1/3">
        <Podium place="2" emoji={topEmojis[1]} loading={loading} />
        <Podium place="1" emoji={topEmojis[0]} loading={loading} />
        <Podium place="3" emoji={topEmojis[2]} loading={loading} />
      </div>
    </>
  );
};

interface TopAppreciatorsProps {
  user_id: string;
}
const TopAppreciators = ({ user_id }: TopAppreciatorsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topGivers, setTopGivers] = useState<any>([]);

  const getTopGivers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getTopGiversToUser(user_id);
      if (!error && data) {
        setTopGivers(data);
      }
    } catch {
    } finally {
      //setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    getTopGivers();
  }, [getTopGivers]);

  return (
    <>
      <div className="flex flex-col gap-5">
        {loading && (
          <>
            {new Array(3).map((option, index) => {
              return <SkeletonCard key={index} />;
            })}
          </>
        )}
        {/* {!loading && (
          <div>
            {topGivers.map((giver, index) => {
              return <div key={index}>{giver}</div>;
            })}
          </div>
        )} */}
      </div>
    </>
  );
};

interface PodiumProps {
  emoji: any;
  place: "1" | "2" | "3";
  loading: boolean;
}

const Podium = ({ emoji, place, loading }: PodiumProps) => {
  return (
    <div className="flex basis-1/3 flex-col gap-3">
      <div className="mt-auto flex  w-full justify-center">
        {loading ? (
          <div className="flex justify-center h-6 w-6">
            <SkeletonCard rounded="xl" />
          </div>
        ) : (
          <Emoji
            label=""
            symbol={emoji}
            size="lg"
            className="flex justify-center text-2xl"
          />
        )}
      </div>
      <div className="w-2/3 mx-auto">
        {loading ? (
          <div
            className={classNames({
              "h-16": place === "3",
              "h-28": place === "2",
              "h-40": place === "1",
            })}
          >
            <SkeletonCard />
          </div>
        ) : (
          <div
            className={classNames("border-2 border-primary bg-info", {
              "h-16": place === "3",
              "h-28": place === "2",
              "h-40": place === "1",
            })}
          ></div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext<PageParams>): Promise<
  GetServerSidePropsResult<ProfileProps>
> => {
  const walletAddressMixedCase = params?.walletAddress;

  //@ts-ignore
  const walletAddress = walletAddressMixedCase?.toLowerCase();

  if (!walletAddress) {
    return {
      notFound: true,
    };
  }

  const { data: userdata, error } = await supabaseService
    .from("users")
    .select("*, profile:profiles_user_id_fkey(*)")
    .eq("wallet_address", walletAddress)
    .single();

  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  if (userdata) {
    return {
      props: {
        id: userdata.id,
        walletAddress: userdata.wallet_address,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default UserPage;
