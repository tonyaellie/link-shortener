"use client";

import { authClient } from "~/utils/auth-client";
import { Button } from "./ui/button";

export const SignInButton = () => {
  return (
    <Button
      onClick={async () =>
        await authClient.signIn.social({
          provider: "github",
        })
      }
    >
      Sign In
    </Button>
  );
};
