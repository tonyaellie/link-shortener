import { Octokit } from "@octokit/rest";

// export default async function handler(req, res) {
//   const session = await getSession({ req });
//   if (!session) return res.status(401).json({ error: "Unauthorized" });

//   const octokit = new Octokit({ auth: session.accessToken });

//   try {
//     const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
//       per_page: 100,
//       sort: "updated",
//     });

//     res.status(200).json(repos);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

export const getRepos = async (accessToken: string) => {
  const octokit = new Octokit({ auth: accessToken });
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "updated",
  });

  return repos;
};
