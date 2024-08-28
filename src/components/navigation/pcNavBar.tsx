"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export default function PcNavBar() {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <div className="flex flex-row gap-4">
            <ModeToggle />
            {session && session.user ? (
                <div className="flex flex-row gap-4">
                    <div className="m-auto">
                        <Avatar>
                            <AvatarImage
                                onClick={() => router.push(`/profile`)}
                                className="hover:cursor-pointer"
                                src={session.user.image || ""}
                                alt={session.user.name || ""}
                            />
                        </Avatar>
                    </div>
                    <div
                        onClick={() => {
                            signOut({ callbackUrl: "/signout" });
                        }}
                        className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline"
                    >
                        Sign Out
                    </div>
                </div>
            ) : (
                <div className="flex flex-row gap-3">
                    <div
                        onClick={() => {
                            router.push("/register");
                        }}
                        className="m-auto select-none text-lg font-bold text-blue-600 hover:cursor-pointer hover:underline"
                    >
                        Sign Up
                    </div>
                    <div
                        onClick={() => {
                            router.push("/login");
                        }}
                        className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline"
                    >
                        Sign In
                    </div>
                </div>
            )}
        </div>
    );
}
