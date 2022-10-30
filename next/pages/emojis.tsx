import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Emoji from "../components/Emoji";
import { Reaction } from "../model.types";
import { getEmojisFromDb } from "../services/emojisService";

const Emojis = () => {
  const [emojisInfo, setEmojisInfo] = useState<Reaction[]>([]);
  const [cookies] = useCookies(["access_token"]);

  const testSavingSomethingONIPFS = async () => {
    try {
      const { data } = await axios.get("/api/ipfs/save", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getEmojis = useCallback(async () => {
    const { data, error } = await getEmojisFromDb();
    if (!error && data) {
      setEmojisInfo(data);
    }
  }, []);

  useEffect(() => {
    getEmojis();
  }, [getEmojis]);

  return (
    <>
      <button
        className="p-2 bg-primary rounded-full"
        onClick={() => testSavingSomethingONIPFS()}
      >
        TEST IPFS
      </button>
      <div className="flex flex-wrap mx-10 gap-2 mt-5">
        {emojisInfo.map((emoji) => {
          return <EmojiContent key={emoji.id} {...emoji} />;
        })}
      </div>
    </>
  );
};

interface EmojiProps {
  id: string;
  sender_id: string;
  receiver_id: string;
  emoji: string;
  server_id: string;
  message_id: string;
  created_at: string;
}

const EmojiContent = ({
  sender_id,
  receiver_id,
  emoji,
  message_id,
}: EmojiProps) => {
  return (
    <div className="">
      <Emoji
        label=""
        symbol={emoji}
        size="lg"
        className="flex justify-center text-5xl"
      />
    </div>
  );
};
export default Emojis;
