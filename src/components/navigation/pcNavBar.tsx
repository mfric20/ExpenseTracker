import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Tuser } from "~/types/types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function PcNavBar() {
    const router = useRouter();

    const userInfoQuery = useQuery<Tuser>({
        queryKey: ["getUserInfo"],
        queryFn: async () => {
            const response = await axios.get(`/api/user`);
            return response.data.userInfo;
        },
    });

    return (
        <div className="flex flex-row gap-4">
            <ModeToggle />
            {userInfoQuery.isSuccess ? (
                <div className="flex flex-row gap-4">
                    <div className="m-auto w-8 h-8 overflow-hidden">
                        <Avatar>
                            <AvatarImage
                                onClick={() => router.push(`/profile`)}
                                className="hover:cursor-pointer w-full h-full object-center object-cover"
                                src={userInfoQuery.data?.image ?? ""}
                                alt={userInfoQuery.data?.name ?? ""}
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
            ) : userInfoQuery.isLoading ? (
                <div></div>
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
