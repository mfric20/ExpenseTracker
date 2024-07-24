"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";

export default function TopNav() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);

  return (
    <nav className="flex flex-row justify-between border-b border-secondary p-4 text-xl font-bold md:px-12">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="my-auto select-none hover:cursor-pointer"
      >
        <span className="text-blue-600">Expense</span>Tracker
      </div>
      <div className="flex flex-row gap-4">
        <ModeToggle />
        {session ? (
          <div
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
            className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline"
          >
            Sign Out
          </div>
        ) : (
          <div
            onClick={() => {
              router.push("/login");
            }}
            className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline"
          >
            Sign In
          </div>
        )}
      </div>
    </nav>
  );
}
