import Image from "next/image";

export default function Home() {
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
      <h1 className="text-white text-5xl">Current Joni Status</h1>
    </div>
  );
}
