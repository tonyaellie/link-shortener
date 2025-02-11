"use server";
import { cookies, headers } from "next/headers";
import { auth } from "./auth";
import { getConfig, getToken, saveConfig } from "./github";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export const addOrUpdateConfig = async ({
  newRedirect: { id, from, to },
  repo,
  path,
}: {
  newRedirect: {
    id?: string;
    from: string[];
    to: string;
  };
  repo: string;
  path: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session");
  }

  const token = await getToken(session.user.id);

  if (!token) {
    throw new Error("No token");
  }

  const newId = id ?? crypto.randomUUID();

  // get the existing config
  const config = await getConfig(token, repo, path);

  // check if id is in
  await saveConfig({
    config: btoa(
      JSON.stringify({
        redirects: [
          ...config.redirects.filter((r) => r.id !== newId),
          {
            id: newId,
            from,
            to,
          },
        ],
        secret: config.secret ?? crypto.randomUUID(),
      }),
    ),
    accessToken: token,
    repoStr: repo,
    path,
    sha: config.sha,
  });

  redirect("/");
};

export const deleteRedirect = async ({
  id,
  repo,
  path,
}: {
  id: string;
  repo: string;
  path: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session");
  }

  const token = await getToken(session.user.id);

  if (!token) {
    throw new Error("No token");
  }

  // get the existing config
  const config = await getConfig(token, repo, path);

  // check if id is in
  await saveConfig({
    config: btoa(
      JSON.stringify({
        redirects: config.redirects.filter((r) => r.id !== id),
        secret: config.secret ?? crypto.randomUUID(),
      }),
    ),
    accessToken: token,
    repoStr: repo,
    path,
    sha: config.sha,
  });

  redirect("/");
};

export const getStatuses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session");
  }

  const token = await getToken(session.user.id);
  if (!token) {
    throw new Error("No token found");
  }

  const domains = await db.query.domain.findMany();
  const secrets = await Promise.all(
    domains.map(async (domain) => {
      return {
        id: domain.id,
        domain: domain.domainName,
        secret: (await getConfig(token, domain.repo, domain.path)).secret,
      };
    }),
  );

  console.log(
    await Promise.allSettled(
      secrets.map(async ({ domain, secret }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await (await fetch(domain + secret)).json();
      }),
    ),
  );
};
