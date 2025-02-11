import { headers } from "next/headers";
import { auth } from "~/utils/auth";
import { SignInButton } from "../components/SignInButton";
import { getRepos, getToken } from "~/utils/github";
import { GithubSelector } from "../components/GithubSelector";
import { db } from "~/server/db";
import { domain } from "~/server/db/schema";
import { redirect } from "next/navigation";

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

  const handleSelect = async (
    user: string,
    repo: string,
    path: string,
    domainName: string,
  ) => {
    "use server";
    console.log(user, repo, path);
    // commit user/repo - path to db
    await db.insert(domain).values({
      domainName,
      repo: `${user}/${repo}`,
      path,
      userId: session.user.id,
      // generate 36 character id
      id: crypto.randomUUID(),
    });
    redirect("/");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <GithubSelector repositories={repos} onSelect={handleSelect} />
    </div>
  );
};

export default Add;
