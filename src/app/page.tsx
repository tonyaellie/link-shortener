import { auth } from "~/utils/auth";
import LinkShortener from "./link-shortener";
import { headers } from "next/headers";
import { SignInButton } from "./components/SignInButton";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignInButton />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <LinkShortener />
    </main>
  );
};

export default Home;
