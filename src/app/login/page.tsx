"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex justify-center pt-32">
      <div className="rounded-sm border-2 p-10">
        <Button variant="outline" onClick={() => signIn("google")}>
          <div className="flex flex-row justify-between gap-3">
            <span className="m-auto flex text-center">Sign In with Google</span>
            <img src="google.png" className="w-6"></img>
          </div>
        </Button>
      </div>
    </div>
  );
}
