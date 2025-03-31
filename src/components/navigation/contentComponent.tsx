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
                <div className="flex flex-row gap-0 md:gap-0 min-h-screen">
                    <SideNavBar />
                    {children}
                </div>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
}
