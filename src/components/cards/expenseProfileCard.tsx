"use client";

import { TExpenseProfile } from "~/types/types";
import { Button } from "../ui/button";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ExpenseProfileCard({
    expenseProfile,
}: {
    expenseProfile: TExpenseProfile;
}) {
    return (
        <div className="flex flex-row justify-items-start">
            <div
                className={`border-2 rounded-md gap-2 flex flex-col flex-1 min-w-72 h-64 pb-4 drop-shadow-none`}
            >
                <div
                    style={{ backgroundColor: expenseProfile.color ?? "" }}
                    className="mb-0 rounded-sm m-6 h-2/4"
                />
                <div className="text-xl font-semibold text-center p-4 h-1/4 overflow-clip">
                    {expenseProfile.name}
                </div>
                <div className="flex gap-2 justify-center items-center h-1/4">
                    <Button className="px-8">View</Button>
                    <HeartIcon
                        className={`w-8 transition-colors duration-200 ${expenseProfile.favorite ? "fill-red-500 text-red-500 hover:fill-none hover:text-primary" : "hover:fill-red-500 hover:text-red-500"} hover:cursor-pointer `}
                    />
                </div>
            </div>
            <div className="flex -mr-5">
                <TrashIcon className="w-8 my-auto bg-red-600 p-1 rounded-md -translate-x-4 hover:cursor-pointer hover:bg-red-600/80 transition-colors duration-300" />
            </div>
        </div>
    );
}
