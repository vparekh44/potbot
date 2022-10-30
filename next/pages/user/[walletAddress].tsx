import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Emoji from "../../components/Emoji";
import { supabaseService } from "../../lib/supabaseServiceClient";
import Image from "next/image";
import { useLogout, useUserData } from "../../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import classNames from "classnames";
import {
  getTopEmojisOnUser,
  getTopGiversToUser,
  TopEmoji,
  TopGiver,
} from "../../services/profileService";
import Link from "next/link";
import { truncateEthAddress } from "../../lib/utils";
import { getRandomNFTFromAWallet } from "../../services/alchemyService";
import { getUserReactionsReceived } from "../../services/scoreService";

type PageParams = {
  walletAddress: string;
};

type ProfileProps = {
  id: string;
  walletAddress: string;
};

const UserPage = ({ id, walletAddress }: ProfileProps) => {
  const [nftImage, setNftImage] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const logout = useLogout();
  const user = useUserData();

  const getUserReputation = useCallback(async () => {
    const score = await getUserReactionsReceived(id);
    setUserScore(score);
  }, [id]);

  const mintUserReputation = async () => {};

  const giveThumbsToTheUser = (value: "up" | "down") => {};

  const getNftsFromProfile = useCallback(async () => {
    const nftImage = await getRandomNFTFromAWallet(walletAddress);
    setNftImage(nftImage);
  }, [walletAddress]);

  useEffect(() => {
    Promise.all([getUserReputation(), getNftsFromProfile()]);
  }, [getUserReputation, getNftsFromProfile]);

  return (
    <div className="h-full w-full">
      <>
        <div className="mx-auto mt-10">
          <div>
            <div className="avatar basis-1/4 flex flex-col">
              <div className="mx-auto mb-5">
                {nftImage ? (
                  <div className="w-40 relative h-40">
                    <Image
                      src={nftImage}
                      alt="placeholder"
                      className="rounded-full"
                      fill={true}
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-40 h-40 rounded-full"></div>
                )}
              </div>
            </div>
            {/* <div className="flex justify-center gap-5 mb-5">
              <div>
                <button
                  className="text-5xl"
                  disabled={!user}
                  onClick={() => giveThumbsToTheUser("up")}
                >
                  👍
                </button>
              </div>
              <div>
                <button
                  className="text-5xl"
                  disabled={!user}
                  onClick={() => giveThumbsToTheUser("down")}
                >
                  👎
                </button>
              </div>
            </div> */}
            <div className="flex flex-col justify-center mx-auto mt-3">
              {walletAddress && (
                <p className="flex justify-center text-white text-lg">
                  {truncateEthAddress(walletAddress)}
                </p>
              )}
              <h5 className="flex justify-center my-auto font-black text-base">
                Current Reputation:
              </h5>
              {/* TODO */}
              <h6 className="mx-auto text-5xl font-black text-white text-center mt-5">
                {userScore}
              </h6>
              <div className="flex justify-center mt-5">
                <button
                  className="p-2 bg-secondary w-44 rounded-full text-white"
                  onClick={() => mintUserReputation()}
                >
                  Mint Reputation
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row mb-20 mt-5">
          <div className="w-full basis-1/2">
            <div className="text-2xl text-center mb-5 capitalize">
              The Reactionaries
            </div>
            <div className="mb-5 px-10">
              <TopAppreciators user_id={id}></TopAppreciators>
            </div>
          </div>
          <div className="w-full basis-1/2">
            <div className="text-2xl text-center mb-5 capitalize">
              Top Reactions
            </div>
            <div className="my-5 flex justify-center">
              <TopEmojisReceived user_id={id} />
            </div>
          </div>
        </div>
      </>
      {id === user?.id && (
        <button className="btn btn-error" onClick={() => logout()}>
          Logout
        </button>
      )}
    </div>
  );
};

interface TopEmojisReceivedProps {
  user_id: string;
}

const TopEmojisReceived = ({ user_id }: TopEmojisReceivedProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topEmojis, setTopEmojis] = useState<TopEmoji[]>([]);

  const getTopEmojisReceivedUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getTopEmojisOnUser(user_id);
      if (!error && data) {
        setTopEmojis(data as TopEmoji[]);
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
      <div className="flex flex-row w-3/4">
        <Podium
          place="2"
          emoji={topEmojis[1]?.emoji || ""}
          loading={loading}
          count={topEmojis[1]?.count}
        />
        <Podium
          place="1"
          emoji={topEmojis[0]?.emoji || ""}
          loading={loading}
          count={topEmojis[0]?.count}
        />
        <Podium
          place="3"
          emoji={topEmojis[2]?.emoji || ""}
          loading={loading}
          count={topEmojis[2]?.count}
        />
      </div>
    </>
  );
};

interface TopAppreciatorsProps {
  user_id: string;
}
const TopAppreciators = ({ user_id }: TopAppreciatorsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topGivers, setTopGivers] = useState<TopGiver[]>([]);

  const getTopGivers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getTopGiversToUser(user_id);
      if (!error && data) {
        setTopGivers(data as TopGiver[]);
      }
    } catch {
    } finally {
      setLoading(false);
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
            {new Array(3).fill("1").map((option, index) => {
              return (
                <div className="h-10 w-full" key={index}>
                  <SkeletonCard />
                </div>
              );
            })}
          </>
        )}
        {!loading && (
          <>
            {(!topGivers || topGivers.length === 0) && (
              <div>No one reacted yet.</div>
            )}
            {topGivers.map((giver, index) => {
              return (
                <TopGiverCard
                  key={index}
                  image={giver.giver_image || ""}
                  name={giver.giver_name}
                  wallet={giver.giver_wallet}
                  count={giver.count}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

interface TopGiverCardProps {
  wallet: string;
  name: string;
  image: string;
  count: number;
}

const TopGiverCard = ({ wallet, count }: TopGiverCardProps) => {
  return (
    <>
      {wallet ? (
        <Link href={`/user/${wallet}`}>
          <GiverContent wallet={wallet} count={count} />
        </Link>
      ) : (
        <GiverContent wallet={wallet} count={count} />
      )}
    </>
  );
};

const GiverContent = ({ wallet, count }: { wallet: string; count: number }) => {
  const user = useUserData();
  const [image, setImage] = useState<string>("");
  const getRandomNFTFromWallet = useCallback(async () => {
    if (wallet) {
      const nftImage = await getRandomNFTFromAWallet(wallet);
      setImage(nftImage);
    }
  }, [wallet]);

  useEffect(() => {
    Promise.all([getRandomNFTFromWallet()]);
  }, [getRandomNFTFromWallet]);

  return (
    <div className="flex border border-primary p-3 rounded-md">
      <div className="avatar max-w-[40px] max-h-[40px]">
        {image ? (
          <Image
            src={
              image
                ? image
                : "https://i.pinimg.com/564x/af/60/be/af60be8ab2017c8a0c102c5d67e98395--flower-gardening-organic-gardening.jpg"
            }
            alt="placeholder"
            className="rounded-full"
            height={40}
            width={40}
            unoptimized={true}
          />
        ) : (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-8 h-8 rounded-full"></div>
        )}
      </div>
      <div className="flex flex-col justify-center ml-3">
        {user && user.walletAddress === wallet ? (
          <p className="text-secondary">Doing some self appreciation! Nice!</p>
        ) : (
          <p className="text-primary">
            {(wallet && truncateEthAddress(wallet)) || ""}
          </p>
        )}
      </div>

      <div className="ml-auto my-auto">{count || ""}</div>
    </div>
  );
};

interface PodiumProps {
  emoji: any;
  place: "1" | "2" | "3";
  loading: boolean;
  count: number;
}

const Podium = ({ emoji, place, loading, count }: PodiumProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="mt-auto flex w-full justify-center">
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
            className={classNames("bg-info rounded", {
              "h-16": place === "3",
              "h-28": place === "2",
              "h-40": place === "1",
            })}
          >
            <h6 className="flex justify-center pt-5 text-xl font-black text-white">
              {count}
            </h6>
          </div>
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
