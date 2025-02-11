import { headers } from "next/headers";
import { auth } from "~/utils/auth";
import { SignInButton } from "../components/SignInButton";
import { getRepos, getToken } from "~/utils/github";

const Add = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SignInButton />
      </div>
    );
  }

  const token = await getToken(session.user.id);
  if (!token) {
    throw new Error("No token found");
  }
  const repos = await getRepos(token);
  // console.log(repos);

  // const repos = await getRepos(session);

  return <div>Add</div>;
};

export default Add;
