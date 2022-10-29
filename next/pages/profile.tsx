import Image from "next/image";
import { GiTeapot } from "react-icons/gi";

const mockAttestations = [{ date: "2022-01-03" }, { date: "2022-02-05" }];

const emojiSummary = [
  {
    emoji: "&#128077;",
    numberShown: 10,
  },
  { emoji: "&#x1F44E;", numberShown: 5 },
  { emoji: "&#x1F44F", numberShown: 30 },
];
const Profile = () => {
  return (
    <>
      <div className="flex gap-5">
        <div className="avatar basis-1/4 flex flex-col">
          <div className="mx-auto mb-5">
            <div className="w-24 rounded-full relative h-24">
              <Image
                src="https://placeimg.com/192/192/people"
                alt="placeholder"
                fill={true}
                unoptimized={true}
              />
            </div>
          </div>
          <div className="inline-block">
            <GiTeapot size={32} className="inline" />

            <h6 className="inline my-auto ml-2">Your Karma: 3</h6>
          </div>
        </div>
        <div className="px-4 border-l basis-3/4 flex-justify-center">
          <h6 className="text-center"></h6>
          <div className="mb-5">
            <h6 className="text-2xl">Latest attestations</h6>
            {mockAttestations.map((attestation, index) => {
              return (
                <div className="flex" key={index}>
                  <div>{attestation.date} </div>
                </div>
              );
            })}
          </div>

          <div className="text-2xl">Summary:</div>
          <div className="my-5">
            {emojiSummary.map((emojiInfo, index) => {
              return (
                <div key={index}>
                  <div>{emojiInfo.emoji}</div>
                  <div>{emojiInfo.numberShown}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const AttestationCard = () => {
  return <></>;
};

export default Profile;
