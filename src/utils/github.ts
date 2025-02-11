import { Octokit } from "@octokit/rest";
import { db } from "~/server/db";

export const getToken = async (userId: string) => {
  return (
    await db.query.account.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.userId, userId),
          operators.eq(fields.providerId, "github"),
        );
      },
    })
  )?.accessToken;
};

export const getRepos = async (accessToken: string) => {
  const octokit = new Octokit({ auth: accessToken });
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "updated",
  });

  return repos;
};
