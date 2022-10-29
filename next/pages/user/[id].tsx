import { Profile } from "../../model.types";

interface UserInfoProps {
  reputation: Number;
  emojis: any; // change this later to something else
  profile: Profile;
}

const UserInfo = ({ reputation, emojis }: UserInfoProps) => {
  return (
    <div className="mx-auto">
      <div></div>
    </div>
  );
};

export default UserInfo;

export async function getServerSideProps() {}
