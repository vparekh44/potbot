import Link from "next/link";
import Image from "next/image";

const AddPotBotToServer = () => {
  const ADD_DISCORD_URL =
    "https://discord.com/api/oauth2/authorize?client_id=1035598715634843809&permissions=8&redirect_uri=https%3A%2F%2Fpotbot.club%2F&response_type=code&scope=identify%20connections%20guilds%20guilds.join%20guilds.members.read%20bot%20applications.commands%20messages.read";

  return (
    <Link href={ADD_DISCORD_URL} target="_blank" rel="noopener noreferrer">
      <button className="btn btn-lg btn-primary ">Add Potbot <Image height={32} width={32} alt="Discord icon" src="/discord.svg" className="ml-2"></Image></button>
    </Link>
  );
};

export default AddPotBotToServer;
