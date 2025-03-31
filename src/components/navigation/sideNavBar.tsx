import { BookOpenIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";

export default function SideNavBar() {
    const router = useRouter();
    const path = usePathname();
    const paths = path?.split("/").filter((path) => path != "");

    return (
        <div className="min-w-[180px] gap-4 pt-8 pl-4 pr-2 text-xl font-normal  flex flex-col top-0 min-h-full border-r-[1px] border-secondary">
            {paths?.find((path) => path == "dashboard") ? (
                <div className="flex text-blue-500 flex-row gap-2 text-center items-center hover:cursor-pointer">
                    <BookOpenIcon className="h-6 w-6" />
                    <span>Dashboard</span>
                </div>
            ) : (
                <div
                    className="flex opacity-75 flex-row gap-2 text-center items-center hover:cursor-pointer hover:text-blue-500"
                    onClick={() => router.push("/dashboard")}
                >
                    <BookOpenIcon className="h-6 w-6" />
                    <span>Dashboard</span>
                </div>
            )}
            {paths?.find((path) => path == "profile") ? (
                <div className="flex text-blue-500 flex-row gap-2 text-center items-center hover:cursor-pointer hover:text-blue-500">
                    <UserIcon className="h-6 w-6" />
                    <span>Profile</span>
                </div>
            ) : (
                <div
                    className="flex opacity-75 flex-row gap-2 text-center items-center hover:cursor-pointer hover:text-blue-500"
                    onClick={() => router.push("/profile")}
                >
                    <UserIcon className="h-6 w-6" />
                    <span>Profile</span>
                </div>
            )}
        </div>
    );
}
