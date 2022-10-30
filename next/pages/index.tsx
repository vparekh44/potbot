import { supabaseService } from "../lib/supabaseServiceClient";
import axios from "axios";
import { GetServerSidePropsResult } from "next";
import AddPotBotToServer from "../components/AddPotbotToServer";
import { useState } from "react";
import Link from "next/link";
import { truncateEthAddress } from "../lib/utils";
import Discord from "../components/Discord";
import { useUserData } from "../contexts/AuthContext";
import RateUs from "../components/RateUs";

interface DiscordServerData {
  id: string;
  name?: string;
  memberCount?: number;
  topReceivers: LeaderItem[];
  memberWithWalletsCount: number;
}

interface LeaderItem {
  walletAddress: string;
  count: number;
}

type HomePageProps = {
  discordServerData: DiscordServerData[];
  totalReactionsCount: number;
  totalUsersCount: number;
  leaders: LeaderItem[];
};

export default function Home({
  discordServerData,
  totalReactionsCount,
  totalUsersCount,
  leaders,
}: HomePageProps) {
  const [serverData, setServerData] = useState(discordServerData);
  const user = useUserData();
  console.log(user);
  return (
    <div className="flex flex-col gap-3">
      <RateUs />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 justify-center sm:justify-between items-center">
              <h1 className="text-2xl sm:text-5xl font-bold">
                Proof-Of-Talent Bot!
              </h1>
              <p className="text-5xl sm:text-8xl">🪴</p>
            </div>
            <p className="py-6 max-w-md text-center sm:text-start">
              PotBot captures reactions across discord servers and aggregates
              them into reputation points. Users can then mint tokens related to
              their reputation, quantifying and offering insights about
              interaction within the communities.
            </p>
            <div className="stats shadow hidden sm:flex">
              <div className="stat">
                <div className="stat-figure text-4xl text-secondary">🎯</div>
                <div className="stat-title">Amount of Servers</div>
                <div className="stat-value">{discordServerData.length}</div>
                <div className="stat-desc">Where reactions were captured</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-4xl text-secondary">👥</div>
                <div className="stat-title">Users</div>
                <div className="stat-value">{totalUsersCount}</div>
                <div className="stat-desc">Who linked their wallets</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-4xl text-secondary">🤪</div>
                <div className="stat-title">Reactions captured</div>
                <div className="stat-value">{totalReactionsCount}</div>
                <div className="stat-desc">Across all servers</div>
              </div>
            </div>
            <div className="flex justify-center gap-10 pt-10">
              <AddPotBotToServer /> <Discord disabled={!user?.id} />
            </div>
          </div>
        </div>
      </div>
      <div className="stats shadow flex pt-10 sm:hidden">
        <div className="stat">
          <div className="stat-figure text-4xl text-secondary">🎯</div>
          <div className="stat-title">Amount of Servers</div>
          <div className="stat-value">{discordServerData.length}</div>
          <div className="stat-desc">Where reactions were captured</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-4xl text-secondary">👥</div>
          <div className="stat-title">Users</div>
          <div className="stat-value">{totalUsersCount}</div>
          <div className="stat-desc">Who linked their wallets</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-4xl text-secondary">🤪</div>
          <div className="stat-title">Reactions captured</div>
          <div className="stat-value">{totalReactionsCount}</div>
          <div className="stat-desc">Across all servers</div>
        </div>
      </div>
      <h2 className="text-4xl text-center pt-10 font-extrabold">Leaderboard</h2>
      <p className="stat-desc text-center">Most endorsed users overall</p>

      <div className="flex flex-col gap-6 py-10 px-8 justify-center">
        {leaders.map((item, index) => {
          //find max count
          const maxCount = Math.max(...leaders.map((item) => item.count));
          const percentage = (item.count / maxCount) * 100;

          return (
            <div className="w-full gap-3 flex items-center" key={index}>
              <Link
                href={`/user/${item.walletAddress}`}
                className="underline  w-32 text-accent"
              >
                {truncateEthAddress(item.walletAddress)}
              </Link>
              <progress
                className="progress progress-primary h-6 w-full"
                value={percentage}
                max="100"
              ></progress>
              <div className="text-base">{item.count}</div>
            </div>
          );
        })}
      </div>
      <h2 className="text-4xl pt-10 text-center font-extrabold">
        Top endorsed users
      </h2>
      <p className="stat-desc pb-10 text-center">
        Most endorsed users per server{" "}
      </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-3">
          {discordServerData.map((item) => {
            return (
              <div className="card w-96 glass" key={item.id}>
                <div className="card-body">
                  <h2 className="text-base">Server ID {item.id}</h2>
                  <div className="flex flex-col">
                    {/* <p className="text-xs font-bold">
                      Total members:{" "}
                      <span className="text-accent">{item.memberCount}</span>
                    </p> */}
                    <p className="text-xs font-bold">
                      Members with wallet linked:{" "}
                      <span className="text-accent">
                        {item.memberWithWalletsCount}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.topReceivers.map((item, index) => {
                      //find max count
                      const maxCount = Math.max(
                        ...leaders.map((item) => item.count)
                      );
                      const percentage = (item.count / maxCount) * 100;

                      return (
                        <div
                          className="w-full gap-3 flex items-center"
                          key={index}
                        >
                          <Link
                            href={`/user/${item.walletAddress}`}
                            className="underline text-xs w-20 text-accent"
                          >
                            {truncateEthAddress(item.walletAddress)}
                          </Link>
                          <progress
                            className="progress progress-primary h-3 w-full"
                            value={percentage}
                            max="100"
                          ></progress>
                          <div className="text-base">{item.count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (): Promise<
  GetServerSidePropsResult<HomePageProps>
> => {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error("Missing DISCORD_TOKEN");
  }

  const { error: totalReactionsStatError, count: totalReactionsCount } =
    await supabaseService
      .from("reactions")
      .select("id", { count: "exact" })
      .limit(1);

  if (totalReactionsStatError) {
    throw new Error(totalReactionsStatError.message);
  }

  const { error: totalUsersCountError, count: totalUsersCount } =
    await supabaseService
      .from("users")
      .select("id", { count: "exact" })
      .limit(1);

  if (totalUsersCountError) {
    throw new Error(totalUsersCountError.message);
  }

  const { data: totalLeadersBoardData, error: totalLeadersBoardDataError } =
    await supabaseService
      .from("leaderboard")
      .select("wallet_address, count")
      .order("count", { ascending: false })
      .limit(5);

  if (totalLeadersBoardDataError) {
    throw new Error(totalLeadersBoardDataError.message);
  }

  const leaders = totalLeadersBoardData?.map((item) => {
    return { walletAddress: item.wallet_address, count: item.count };
  });

  const { data: discordIdData, error: discordIdDataError } =
    await supabaseService.from("unique_guilds").select("server_id");

  const guildsData = discordIdData?.map((item) => item.server_id);

  if (discordIdDataError) {
    throw new Error(discordIdDataError.message);
  }

  const discordServerIdsWithNames: DiscordServerData[] = [];

  if (guildsData && guildsData.length > 0) {
    for (const guildId of guildsData) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        // const { data: guildData } = await axios.get(
        //   `https://discord.com/api/guilds/${guildId}/preview`,
        //   {
        //     headers: {
        //       Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        //     },
        //   }
        // );

        const { data, error, count } = await supabaseService
          .from("server_stats")
          .select("*", { count: "exact" })
          .eq("server_id", guildId)
          .order("count", { ascending: false })
          .limit(8);

        if (error) {
          throw new Error(error.message);
        }
        const topReceivers = [];

        if (data && data.length > 0) {
          for (const item of data) {
            topReceivers.push({
              walletAddress: item.wallet_address,
              count: item.count,
            });
          }
        }

        discordServerIdsWithNames.push({
          id: guildId,
          // name: guildData.name,
          // memberCount: guildData.approximate_member_count,
          topReceivers,
          memberWithWalletsCount: count || 0,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (discordIdData) {
    return {
      props: {
        discordServerData: discordServerIdsWithNames,
        totalReactionsCount: totalReactionsCount || 0,
        totalUsersCount: totalUsersCount || 0,
        leaders: leaders || [],
      },
    };
  } else {
    return {
      props: {
        discordServerData: [],
        totalReactionsCount: 0,
        totalUsersCount: 0,
        leaders: [],
      },
    };
  }
};
