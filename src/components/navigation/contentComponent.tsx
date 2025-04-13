import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tuser } from "~/types/types";
import SideNavBar from "./sideNavBar";

interface ChildComponentProps {
    children: React.ReactNode;
}

export default function ContentComponent({ children }: ChildComponentProps) {
    const userInfoQuery = useQuery<Tuser>({
        queryKey: ["getUserInfo"],
        queryFn: async () => {
            const response = await axios.get(`/api/user`);
            return response.data.userInfo;
        },
    });

    return (
        <div className="min-h-screen">
            {userInfoQuery.isSuccess ? (
                <div className="flex flex-col md:flex-row gap-0 min-h-screen">
                    <div className="hidden md:block">
                        <SideNavBar />
                    </div>
                    <main className="flex-1 overflow-x-hidden">{children}</main>
                </div>
            ) : (
                <main className="flex-1 overflow-x-hidden">{children}</main>
            )}
        </div>
    );
}
