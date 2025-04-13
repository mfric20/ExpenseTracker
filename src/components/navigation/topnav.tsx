import { useRouter, usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PcNavBar from "./pcNavBar";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopNav({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    const [screenWidth, setScreenWidth] = useState(0);

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

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => {
                            if (session?.user) router.push("/dashboard");
                            else router.push("/");
                        }}
                        className="flex items-center gap-2 hover:cursor-pointer"
                    >
                        <span className="text-xl font-semibold">
                            <span className="text-blue-600">Expense</span>
                            Tracker
                        </span>
                    </div>
                    {screenWidth > 900 && paths?.[0] && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>/</span>
                            <span className="capitalize">{paths[0]}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 items-center justify-end gap-2">
                    {screenWidth < 900 ? (
                        <Bars3Icon
                            onClick={() => setToggleHamburgerMenu(true)}
                            className="h-6 w-6 hover:cursor-pointer"
                        />
                    ) : (
                        <PcNavBar />
                    )}
                </div>
            </div>
        </nav>
    );
}
