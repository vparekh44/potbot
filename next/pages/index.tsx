import { LeaderboardCard } from "../components/LeaderboardCard";
import { useUserData } from "../contexts/AuthContext";

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


export default function Home() {
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
}
