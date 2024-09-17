"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tuser } from "~/types/types";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import axios from "axios";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavBar({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<Tuser>();

    useEffect(() => {
        getUserInfoMutation.mutate(session?.user?.email as string);
    }, [session]);

    const getUserInfoMutation = useMutation({
        mutationKey: ["getUserInfoMutation"],
        mutationFn: async (userEmail: string) => {
            const response = await axios.get(
                `/api/user?userEmail=${userEmail}`,
            );
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            setUserInfo(data.userInfo);
        },
    });

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
                {userInfo ? (
                    <div className="flex flex-col gap-4">
                        <div className="m-auto w-12 h-12 overflow-hidden">
                            <Avatar className="w-12 h-auto">
                                <AvatarImage
                                    onClick={() => {
                                        router.push(`/profile`);
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="hover:cursor-pointer w-full h-full object-center object-cover"
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
