"use client";

import { useRouter, usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PcNavBar from "./pcNavBar";

export default function TopNav() {
    const [screenWidth, setScreenWidth] = useState(0);
    const router = useRouter();
    const { data: session } = useSession();
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
                                    className="flex text-center flex-row gap-2 text-lg mt-[1px] font-normal opacity-75"
                                >
                                    <span className="text-slate-500">/</span>
                                    <span>{path}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {screenWidth < 900 ? (
                <div>
                    <Bars3Icon className="size-8" />
                </div>
            ) : (
                <PcNavBar />
            )}
        </nav>
    );
}
