import { auth } from "~/utils/auth";
import { LinkShortener } from "./link-shortener";
import { headers } from "next/headers";
import { SignInButton } from "./components/SignInButton";
import { db } from "~/server/db";
import { getConfig, getToken } from "~/utils/github";
import { getStatuses } from "~/utils/actions";

const Home = async () => {
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

  await getStatuses; ();

  // fetch all domains
  const domains = await db.query.domain.findMany();
  const configs = await Promise.all(
    domains.map(async (domain) => {
      return {
        id: domain.id,
        domain: domain.domainName,
        repo: domain.repo,
        path: domain.path,
        redirects: (await getConfig(token, domain.repo, domain.path)).redirects,
      };
    }),
  );

  return (
    <main className="min-h-screen">
      <LinkShortener configs={configs} />
    </main>
  );
};

export default Home;
