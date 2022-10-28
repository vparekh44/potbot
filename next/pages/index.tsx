import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <div className="relative h-96 w-96">
        <Image
          src="https://cps-static.rovicorp.com/2/Open/20th%20Century%20Fox/Missing%20in%20Action/_derived_jpg_q90_310x470_m0/MIA%20poster.jpg"
          alt="current status of Joni"
          fill={true}
          unoptimized={true}
        />
      </div>
      <h1 className="text-white text-5xl">Current Joni Status</h1>
    </div>
  );
}
