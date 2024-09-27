"use client";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import axios from "axios";
import ExpenseProfileCard from "~/components/cards/expenseProfileCard";
import { TExpenseProfile } from "~/types/types";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import CreateExpenseProfileComponent from "~/components/basic/createExpenseProfileComponent";

export default function DashboardPage() {
    const [screenWidth, setScreenWidth] = useState(0);

    const expenseProfilesQuery = useQuery<TExpenseProfile[]>({
        queryKey: ["getExpenseProfiles"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfiles`);
            return response.data.expenseProfiles;
        },
    });

    useEffect(() => {
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
        <>
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
                    expenseProfilesQuery.data.length == 0 ? (
                        screenWidth > 1200 ? (
                            <div className="flex justify-end lg:pr-56 pt-10">
                                <img
                                    className="w-auto opacity-60"
                                    src="dashboard_web.png"
                                />
                            </div>
                        ) : (
                            <div className="flex justify-end pr-5 pt-10">
                                <img
                                    className="w-auto opacity-60"
                                    src="dashboard_mobile.png"
                                />
                            </div>
                        )
                    ) : (
                        <div className="flex justify-center mt-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                {expenseProfilesQuery.data.map(
                                    (expenseProfile) => {
                                        return (
                                            <ExpenseProfileCard
                                                expenseProfile={expenseProfile}
                                                key={
                                                    "expenseProfile" +
                                                    expenseProfilesQuery.data.indexOf(
                                                        expenseProfile,
                                                    )
                                                }
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div></div>
                )}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <PlusCircleIcon className="w-14 fixed md:bottom-20 md:right-36 bottom-12 right-12 text-button drop-shadow-md hover:text-button/90 hover:cursor-pointer" />
                </DialogTrigger>
                <CreateExpenseProfileComponent />
            </Dialog>
        </>
    );
}
