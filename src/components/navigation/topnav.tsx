"use client";

import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export default function TopNav() {
    const router = useRouter();
    const { data: session } = useSession();
    const path = usePathname();

    const paths = path?.split("/").filter((path) => path != "");

    return (
        <nav className="flex flex-row justify-between border-b border-secondary p-4 text-xl font-bold md:px-36">
            <div className="my-auto select-none">
                <div className="flex flex-row gap-4">
                    <div
                        onClick={() => {
                            if (session?.user) router.push("/dashboard");
                            else router.push("/");
                        }}
                        className="hover:cursor-pointer"
                    >
                        <span className="text-blue-600">Expense</span>Tracker
                    </div>
                    <div className="flex flex-row gap-2 m-auto">
                        {paths?.map((path) => {
                            return (
                                <div
                                    key={paths?.indexOf(path)}
                                    className="flex text-center flex-row gap-2 text-lg mt-[1px] font-normal text-slate-200"
                                >
                                    <span className="text-slate-400">/</span>
                                    <span>{path}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
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
        </nav>
    );
}
