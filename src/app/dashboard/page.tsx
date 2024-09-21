"use client";

import { Button } from "~/components/ui/button";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export default function DashboardPage() {
    const expenseProfilesQuery = useQuery({
        queryKey: ["getExpenseProfiles"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfiles`);
            return response.data;
        },
    });

    console.log(expenseProfilesQuery.data);

    return (
        <div className="flex flex-col gap-6 px-36 py-8 drop-shadow-md">
            <div className="flex flex-row">
                <div className="ml-auto text-4xl font-semibold ">
                    <span className="text-blue-600">Expense</span> profiles
                </div>
                <Button className="ml-auto flex flex-row gap-2 justify-end">
                    <div className="flex m-auto">Create new</div>{" "}
                    <FolderPlusIcon className="w-5 mb-[2px]" />
                </Button>
            </div>
            <hr />
        </div>
    );
}
