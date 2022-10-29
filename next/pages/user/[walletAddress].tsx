import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { supabaseService } from "../../lib/supabaseServiceClient";

type PageParams = {
  walletAddress: string;
};

type ProfileProps = {
  id: string;
  walletAddress: string;
};

const UserPage = ({ id, walletAddress }: ProfileProps) => {
  return (
    <div className="h-full w-full">
      <p>Hello {walletAddress}</p>
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
