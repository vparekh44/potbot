import Image from "next/image";
import AddPotBotToServer from "../components/AddPotbotToServer";
import Discord from "../components/Discord";
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
  const user = useUserData();

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <div className="relative h-48 w-96">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl7gkXh9lKNdrIlYUdEVXkRsJp4LUR4frL0A&usqp=CAU"
          alt="current status of Joni"
          fill={true}
          unoptimized={true}
        />
      </div>
      <h1 className="text-primary text-5xl"> HELLO {user?.id}</h1>
      {user && <Discord />}
    </div>
  );
}

/**
 * start discord oauth flow - hit discord with a redirect URI
 * have an api for the redirect on the /api level
 * 
 */