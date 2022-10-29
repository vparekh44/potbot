import { supabaseService } from "../lib/supabaseServiceClient";
import axios from "axios";
import { GetServerSidePropsResult } from "next";
import AddPotBotToServer from "../components/AddPotbotToServer";
import { useState } from "react";
interface DiscordServerData {
  id: string;
  name: string;
  memberCount: number;
}

type HomePageProps = {
  discordServerData: DiscordServerData[];
  totalReactionsCount: number;
  totalUsersCount: number;
};

export default function Home({
  discordServerData,
  totalReactionsCount,
  totalUsersCount,
}: HomePageProps) {
  const [serverData, setServerData] = useState(discordServerData);

  return (
    <div className="flex flex-col gap-3">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between gap-6 items-center">
              <h1 className="text-5xl font-bold">Proof-Of-Talent Bot!</h1>
              <span className="text-9xl">🪴</span>
            </div>
            <p className="py-6 max-w-md">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <div className="stats shadow hidden sm:flex">
              <div className="stat">
                <div className="stat-figure text-4xl text-secondary">🎯</div>
                <div className="stat-title">Amount of Servers</div>
                <div className="stat-value">{discordServerData.length}</div>
                <div className="stat-desc">Where reactions were captures</div>
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
            <div className="flex justify-center sm:justify-end">
              <AddPotBotToServer />
            </div>
          </div>
        </div>
      </div>
      <div className="stats shadow flex sm:hidden">
        <div className="stat">
          <div className="stat-figure text-4xl text-secondary">🎯</div>
          <div className="stat-title">Amount of Servers</div>
          <div className="stat-value">{discordServerData.length}</div>
          <div className="stat-desc">Where reactions were captures</div>
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
      <h2 className="text-4xl py-10 font-extrabold">Servers Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {discordServerData.map((item) => {
          return (
            <div className="card w-96 glass" key={item.id}>
              <div className="card-body">
                <h2 className="card-title">{item.name}</h2>
                <p>Members: {item.memberCount}</p>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="text-4xl py-10 font-extrabold">Leaderboard</h2>
      <div className="flex flex-col gap-6 justify-center">
        <progress
          className="progress progress-primary h-4 w-full"
          value="0"
          max="100"
        ></progress>
        <progress
          className="progress progress-primary h-4 w-full"
          value="10"
          max="100"
        ></progress>
        <progress
          className="progress progress-primary h-4 w-full"
          value="40"
          max="100"
        ></progress>
        <progress
          className="progress progress-primary h-4 w-full"
          value="70"
          max="100"
        ></progress>
        <progress
          className="progress progress-primary h-4 w-full"
          value="100"
          max="100"
        ></progress>
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

  const { data: discordIdData, error: discordIdDataError } =
    await supabaseService.rpc("select_unique_guild_ids");

  if (discordIdDataError) {
    throw new Error(discordIdDataError.message);
  }

  const discordServerIdsWithNames: DiscordServerData[] = [];

  if (Array.isArray(discordIdData)) {
    // Have to finish this method
  } else {
    const { data: guildData } = await axios.get(
      `https://discord.com/api/guilds/${discordIdData}/preview`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    discordServerIdsWithNames.push({
      id: discordIdData,
      name: guildData.name,
      memberCount: guildData.approximate_member_count,
    });
  }

  if (discordIdData) {
    return {
      props: {
        discordServerData: discordServerIdsWithNames,
        totalReactionsCount: totalReactionsCount || 0,
        totalUsersCount: totalUsersCount || 0,
      },
    };
  } else {
    return {
      props: {
        discordServerData: [],
        totalReactionsCount: 0,
        totalUsersCount: 0,
      },
    };
  }
};
