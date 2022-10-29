import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { GiTeapot } from "react-icons/gi";
import Emoji from "../../components/Emoji";
import { supabaseService } from "../../lib/supabaseServiceClient";
import Image from "next/image";

type PageParams = {
  walletAddress: string;
};

type ProfileProps = {
  id: string;
  walletAddress: string;
};


const mockAttestations = [{ date: "2022-01-03" }, { date: "2022-02-05" }];

const emojiSummary = [
  {
    emoji: 0x1f609,
    numberShown: 30,
  },
  { emoji: 0x1f609, numberShown: 15 },
  { emoji: 0x1f609, numberShown: 10 },
];

const UserPage = ({ id, walletAddress }: ProfileProps) => {
  return (
    <div className="h-full w-full">
    <>
      <div className="flex gap-5">
        <div className="avatar basis-1/4 flex flex-col">
          <div className="mx-auto mb-5">
            <div className="w-24 relative h-24">
              <Image
                src="https://placeimg.com/192/192/people"
                alt="placeholder"
                className="rounded-full"
                fill={true}
                unoptimized={true}
              />
            </div>
          </div>
          <div className="flex mx-auto">
            <h6 className="inline my-auto font-black text-lg">Reputation: 3</h6>
            <GiTeapot size={24} className="inline my-auto ml-2" />
          </div>
        </div>
        <div className="px-4 border-l basis-3/4 flex-justify-center">
          <h6 className="text-center"></h6>
          <div className="mb-5">
            <h6 className="text-2xl mb-5">Latest attestations</h6>
            {mockAttestations.map((attestation, index) => {
              return (
                <div className="flex mx-3" key={index}>
                  <div>{attestation.date} </div>
                </div>
              );
            })}
          </div>

          <div className="text-2xl">Reactions:</div>
          <div className="my-5">
            {emojiSummary.map((emojiInfo, index) => {
              return (
                <div key={index} className="flex flex-row gap-5 mx-3 w-1/2">
                  <Emoji
                    label="test"
                    symbol={String.fromCodePoint(emojiInfo.emoji)}
                  ></Emoji>
                  <div className="ml-auto">{emojiInfo.numberShown}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
    </div>
  );
};

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext<PageParams>): Promise<
  GetServerSidePropsResult<ProfileProps>
> => {
  const walletAddressMixedCase = params?.walletAddress;


  //@ts-ignore
  const walletAddress = walletAddressMixedCase?.toLowerCase();

  if (!walletAddress) {
    return {
      notFound: true,
    };
  }

  const { data: userdata, error } = await supabaseService
    .from("users")
    .select("*, profile:profiles_user_id_fkey(*)")
    .eq("wallet_address", walletAddress)
    .single();

  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  if (userdata) {
    return {
      props: {
        id: userdata.id,
        walletAddress: userdata.wallet_address,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default UserPage;
