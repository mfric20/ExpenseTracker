import { useRouter, usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Tuser } from "~/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import PcNavBar from "./pcNavBar";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopNav({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    const [screenWidth, setScreenWidth] = useState(0);
    const [userInfo, setUserInfo] = useState<Tuser>();

    const { data: session } = useSession();
    const router = useRouter();
    const path = usePathname();

    const paths = path?.split("/").filter((path) => path != "");

    useEffect(() => {
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    useEffect(() => {
        getUserInfoMutation.mutate(session?.user.email as string);
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
        <div>
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
                            <span className="text-blue-600">Expense</span>
                            Tracker
                        </div>
                        {screenWidth > 900 ? (
                            <div className="flex flex-row gap-2 m-auto">
                                {paths?.map((path) => {
                                    return (
                                        <div
                                            key={paths?.indexOf(path)}
                                            className="flex text-center flex-row gap-2 text-lg mt-[1px] font-normal opacity-75"
                                        >
                                            <span className="text-slate-500">
                                                /
                                            </span>
                                            <span>{path}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                {screenWidth < 900 ? (
                    <div>
                        <Bars3Icon
                            onClick={() => setToggleHamburgerMenu(true)}
                            className="size-8 hover:cursor-pointer"
                        />
                    </div>
                ) : (
                    <PcNavBar userInfo={userInfo} />
                )}
            </nav>
        </div>
    );
}
