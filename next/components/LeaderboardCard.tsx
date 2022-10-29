interface LeaderboardCardProps {
    username: string;
    score: number;
  }
  
  export const LeaderboardCard = ({ username, score }: LeaderboardCardProps) => {
    return (
      <>
        <div className="flex flex-row p-2 border border-neutral w-1/2 mx-auto">
          <div>{username}</div>
          <div className="ml-auto">{score}</div>
        </div>
      </>
    );
  };
  