import Link from "next/link";

const AddPotBotToServer = () => {
  const ADD_DISCORD_URL =
    "https://discord.com/api/oauth2/authorize?client_id=1035598715634843809&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord&response_type=code&scope=identify%20connections%20guilds%20guilds.members.read%20bot%20messages.read%20applications.commands";

  return (
    <Link href={ADD_DISCORD_URL} target="_blank" rel="noopener noreferrer">
      <button className="btn btn-lg btn-primary ">Add Potbot 🪴</button>
    </Link>
  );
};

export default AddPotBotToServer;
