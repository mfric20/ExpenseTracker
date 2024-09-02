"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavBar({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div className="py-10 px-10 flex flex-col gap-4">
            <div className="flex justify-end">
                <XMarkIcon
                    onClick={() => setToggleHamburgerMenu(false)}
                    className="w-10 hover:cursor-pointer"
                />
            </div>
            <div className="flex flex-col gap-6 justify-center items-center">
                <ModeToggle />
                {session && session.user ? (
                    <div className="flex flex-col gap-4">
                        <div className="m-auto">
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    onClick={() => {
                                        router.push(`/profile`);
                                        setToggleHamburgerMenu(false);
                                    }}
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
                    <div className="flex flex-col gap-4">
                        <div
                            onClick={() => {
                                router.push("/register");
                                setToggleHamburgerMenu(false);
                            }}
                            className="m-auto select-none text-lg font-bold text-blue-600 hover:cursor-pointer hover:underline"
                        >
                            Sign Up
                        </div>
                        <div
                            onClick={() => {
                                router.push("/login");
                                setToggleHamburgerMenu(false);
                            }}
                            className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline"
                        >
                            Sign In
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
