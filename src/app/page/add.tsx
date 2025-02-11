import { headers } from "next/headers";
import { auth } from "~/utils/auth";
import { SignInButton } from "../components/SignInButton";

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

  // const repos = await getRepos(session);

  return <div>Add</div>;
};

export default Add;
