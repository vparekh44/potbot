import Image from "next/image";
import { useUserData } from "../contexts/AuthContext";


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
    </div>
  );
}
