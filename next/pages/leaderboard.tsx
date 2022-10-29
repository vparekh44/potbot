const mockData = [
  { id: "a", username: "test", score: 30 },
  { id: "b", username: "test 1", score: 29 },
  { id: "d", username: "test 2", score: 25 },
  { id: "e", username: "test 3", score: 20 },
  { id: "f", username: "test 4", score: 15 },
  { id: "g", username: "test 5", score: 5 },
  { id: "h", username: "test 6", score: 2 },
  { id: "k", username: "test 7", score: -2 },
];

const Leaderboard = () => {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="flex justify-center text-3xl text-secondary mb-5">
        Leaderboard
      </h6>
      {mockData &&
        mockData.map((option, index) => {
          return <LeaderboardCard {...option} key={option.id} />;
        })}
    </div>
  );
};

interface LeaderboardCardProps {
  username: string;
  score: number;
}

const LeaderboardCard = ({ username, score }: LeaderboardCardProps) => {
  return (
    <>
      <div className="flex flex-row p-2 border border-neutral w-1/2 mx-auto">
        <div>{username}</div>
        <div className="ml-auto">{score}</div>
      </div>
    </>
  );
};
export default Leaderboard;
