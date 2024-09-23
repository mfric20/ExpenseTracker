import { XMarkIcon } from "@heroicons/react/24/outline";
import { ModeToggle } from "~/components/ui/modetoggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tuser } from "~/types/types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavBar({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    const router = useRouter();

    const userInfoQuery = useQuery<Tuser>({
        queryKey: ["getUserInfo"],
        queryFn: async () => {
            const response = await axios.get(`/api/user`);
            return response.data.userInfo;
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
                {userInfoQuery.isPending ? (
                    <></>
                ) : userInfoQuery.data ? (
                    <div className="flex flex-col gap-4">
                        <div className="m-auto w-12 h-12 overflow-hidden">
                            <Avatar className="w-12 h-auto">
                                <AvatarImage
                                    onClick={() => {
                                        router.push(`/profile`);
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="hover:cursor-pointer w-full h-full object-center object-cover"
                                    src={userInfoQuery.data.image ?? ""}
                                    alt={userInfoQuery.data.name ?? ""}
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
                {}
            </div>
        </div>
    );
}
