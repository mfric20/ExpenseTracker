"use client";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import ExpenseProfileCard from "~/components/cards/expenseProfileCard";
import { TExpenseProfile } from "~/types/types";

export default function DashboardPage() {
    const expenseProfilesQuery = useQuery<TExpenseProfile[]>({
        queryKey: ["getExpenseProfiles"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfiles`);
            return response.data.expenseProfiles;
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-6 px-10 md:px-36 py-8 drop-shadow-md">
                <div className="mx-auto text-2xl md:text-4xl font-semibold">
                    <span className="text-blue-600">Expense</span> profiles
                </div>
                <hr />
                {expenseProfilesQuery.isLoading ? (
                    <div className="flex justify-center text-lg mt-32 italic text-primary/70">
                        Loading...
                    </div>
                ) : expenseProfilesQuery.isSuccess ? (
                    <div className="flex flex-row gap-8 h-36">
                        {expenseProfilesQuery.data.map((expenseProfile) => (
                            <div
                                key={
                                    "expenseProfile" +
                                    expenseProfilesQuery.data.indexOf(
                                        expenseProfile,
                                    )
                                }
                            >
                                <ExpenseProfileCard
                                    expenseProfile={expenseProfile}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <PlusCircleIcon className="w-14 fixed md:bottom-20 md:right-36 bottom-12 right-12 text-button drop-shadow-md hover:text-button/90 hover:cursor-pointer" />
        </div>
    );
}
