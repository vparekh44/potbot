import axios from "axios";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import { useUserData } from "../contexts/AuthContext";
import { uploadToIPFS } from "../lib/ipfsUtils";

const RateUs = () => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const user = useUserData();

  const ratingChanged = (newRating: any) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/ipfs/save", {
        feedback: {
          user: user ? user.walletAddress : "0x00Anon",
          rating,
        },
        source: "potbot 🪴"
      });
      setHash(data.message);
      toast.success("Thanks for rating us!");
      setLoading(false);
      console.log("hash: ", data);
    } catch (err) {
      console.log("Error: ", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-8 z-50 overscroll-auto    ">
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" for="">
          <h3 className="text-lg font-bold">Rate us!</h3>
          <p className="py-4">
            If you liked the idea, please give us some stars! It would be good
            to know that we store your valuable ratings decentrally on IPFS!
          </p>
          <div className="flex justify-center flex-col items-center gap-4">
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />
            <button className={classNames("btn btn-info btn-block", {
              "loading btn-disabled": loading,
            })} onClick={handleSubmit}>
              Submit Rating
            </button>
            {hash && <div>
              <Link href={`https://ipfs.io/ipfs/${hash}`} target="_blank" rel="noopener noreferrer">
                You can check your feedback on IPFS here
              </Link>
            </div>}
          </div>
        </label>
      </label>
      <label htmlFor="my-modal-4" className="btn btn-primary">
        Rate us
      </label>
    </div>
  );
};

export default RateUs;
