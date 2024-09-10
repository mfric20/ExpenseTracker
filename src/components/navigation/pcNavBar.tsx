"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Tuser } from "~/types/types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

interface ChildComponentProps {
    userInfo: Tuser | undefined;
}

export default function PcNavBar({ userInfo }: ChildComponentProps) {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className="flex flex-row gap-4">
            <ModeToggle />
            {userInfo ? (
                <div className="flex flex-row gap-4">
                    <div className="m-auto">
                        <Avatar>
                            <AvatarImage
                                onClick={() => router.push(`/profile`)}
                                className="hover:cursor-pointer"
                                src={userInfo.image ?? ""}
                                alt={userInfo.name ?? ""}
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
            ) : !session ? (
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
            ) : (
                <div></div>
            )}
        </div>
    );
}
