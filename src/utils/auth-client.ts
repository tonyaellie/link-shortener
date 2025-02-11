import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: window
    ? window.location.origin
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
});
