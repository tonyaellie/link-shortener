import { Octokit, RequestError } from "octokit";
import { db } from "~/server/db";
import { z } from "zod";

const USER_AGENT = "Link Shortener v0.0.1";

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
  const octokit = new Octokit({ auth: accessToken, userAgent: USER_AGENT });

  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "updated",
  });

  return repos;
};

export const getConfig = async (
  accessToken: string,
  repoStr: string,
  path: string,
): Promise<{
  redirects: {
    from: string[];
    to: string;
    id: string;
  }[];
  secret?: string;
  sha?: string;
}> => {
  const octokit = new Octokit({ auth: accessToken, userAgent: USER_AGENT });

  const [owner, repo] = repoStr.split("/") as [string, string];

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path + "link-shortener.json",
    });

    // TODO: figure out how to get the sha

    const res = z
      .object({
        sha: z.string(),
        content: z.string(),
      })
      .safeParse(data);

    if (!res.success) {
      return {
        redirects: [],
      };
    }

    const content = z
      .object({
        redirects: z.array(
          z.object({
            from: z.array(z.string()),
            to: z.string(),
            id: z.string(),
          }),
        ),
        secret: z.string(),
      })
      .safeParse(JSON.parse(atob(res.data.content)));

    if (!content.success) {
      return {
        redirects: [],
      };
    }

    return {
      redirects: content.data.redirects,
      secret: content.data.secret,
      sha: res.data.sha,
    };
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.status === 404) {
        return {
          redirects: [],
        };
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const saveConfig = async ({
  config,
  accessToken,
  repoStr,
  path,
  sha,
}: {
  config: string;
  accessToken: string;
  repoStr: string;
  path: string;
  sha?: string;
}) => {
  const octokit = new Octokit({ auth: accessToken, userAgent: USER_AGENT });

  const [owner, repo] = repoStr.split("/") as [string, string];

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: path + "link-shortener.json",
    content: config,
    message: "ci: update link-shortener.json",
    sha,
  });
};
