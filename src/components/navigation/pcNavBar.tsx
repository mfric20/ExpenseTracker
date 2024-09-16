"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Tuser } from "~/types/types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function PcNavBar() {
    const router = useRouter();
    const { data: session } = useSession();

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
