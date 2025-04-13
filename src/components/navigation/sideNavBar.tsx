import { BookOpenIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";

export default function SideNavBar() {
    const router = useRouter();
    const path = usePathname();
    const paths = path?.split("/").filter((path) => path != "");

    return (
        <div className="min-w-[220px] gap-2 pt-8 pl-6 pr-4 text-lg font-medium flex flex-col top-0 min-h-full border-r-[1px] border-secondary bg-background">
            {paths?.find((path) => path == "dashboard") ? (
                <div className="flex text-blue-500 flex-row gap-3 text-center items-center hover:cursor-pointer p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 transition-colors select-none">
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                </div>
            ) : (
                <div
                    className="flex opacity-75 flex-row gap-3 text-center items-center hover:cursor-pointer hover:text-blue-500 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors select-none"
                    onClick={() => router.push("/dashboard")}
                >
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                </div>
            )}
            {paths?.find((path) => path == "profile") ? (
                <div className="flex text-blue-500 flex-row gap-3 text-center items-center hover:cursor-pointer p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 transition-colors select-none">
                    <UserIcon className="h-5 w-5" />
                    <span>Profile</span>
                </div>
            ) : (
                <div
                    className="flex opacity-75 flex-row gap-3 text-center items-center hover:cursor-pointer hover:text-blue-500 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors select-none"
                    onClick={() => router.push("/profile")}
                >
                    <UserIcon className="h-5 w-5" />
                    <span>Profile</span>
                </div>
            )}
        </div>
    );
}
