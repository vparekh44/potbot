import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Emoji from "../../components/Emoji";
import { supabaseService } from "../../lib/supabaseServiceClient";
import Image from "next/image";
import { useLogout } from "../../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import classNames from "classnames";
import { getTopEmojisOnUser } from "../../services/profileService";

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
              <h6 className="text-2xl mb-5">Latest attestations</h6>
              {mockAttestations.map((attestation, index) => {
                return (
                  <div className="flex mx-3" key={index}>
                    <div>{attestation.date} </div>
                  </div>
                );
              })}
            </div>

            <div className="text-2xl">Reactions:</div>
            <div className="my-5">
              <TopEmojisReceived user_id={id} />
            </div>
          </div>
        </div>
      </>
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
      debugger;
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
  return (
    <>
      <div className="flex flex-row w-1/3">
        <Podium
          place="2"
          emoji={String.fromCodePoint(0x1f609)}
          loading={loading}
        />
        <Podium
          place="1"
          emoji={String.fromCodePoint(0x1f609)}
          loading={loading}
        />
        <Podium
          place="3"
          emoji={String.fromCodePoint(0x1f609)}
          loading={loading}
        />
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
