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
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="text-xl font-semibold">
                        <span className="text-primary">Expense</span>Tracker
                    </div>
                    <XMarkIcon
                        onClick={() => setToggleHamburgerMenu(false)}
                        className="w-6 h-6 hover:cursor-pointer"
                    />
                </div>
                <div className="flex-1 p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                            <ModeToggle />
                            <span className="text-lg">Theme</span>
                        </div>
                        {userInfoQuery.isSuccess ? (
                            <>
                                <div
                                    onClick={() => {
                                        router.push(`/profile`);
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={userInfoQuery.data.image ?? ""}
                                            alt={userInfoQuery.data.name ?? ""}
                                        />
                                    </Avatar>
                                    <span className="text-lg">Profile</span>
                                </div>
                                <div
                                    onClick={() => {
                                        router.push("/dashboard");
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                >
                                    <span className="text-lg">Dashboard</span>
                                </div>
                                <div
                                    onClick={() => {
                                        signOut({ callbackUrl: "/signout" });
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer text-destructive"
                                >
                                    <span className="text-lg">Sign Out</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    onClick={() => {
                                        router.push("/register");
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                >
                                    <span className="text-lg">Sign Up</span>
                                </div>
                                <div
                                    onClick={() => {
                                        router.push("/login");
                                        setToggleHamburgerMenu(false);
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                >
                                    <span className="text-lg">Sign In</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
