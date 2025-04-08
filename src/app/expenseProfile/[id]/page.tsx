"use client";

import { useState } from "react";
import ExpenseProfileExpensesCard from "~/components/cards/expenseProfileExpensesCard";
import ExpenseProfileInfoCard from "~/components/cards/expenseProfileInfoCard";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default function ExpenseProfile({ params }: Props) {
    const router = useRouter();

    const deleteExpenseProfileMutation = useMutation({
        mutationKey: ["deleteExpenseProfileMutation"],
        mutationFn: async () => {
            const expenseProfileId = params.id;
            const response = await axios.delete(
                `/api/expenseProfiles?expenseProfileId=${expenseProfileId}`,
            );
            return response.data;
        },
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    const [selectedTab, setSelectedTab] = useState<String>("info");
    const { id } = params;

    return (
        <div className="flex flex-col px-10 md:px-20 py-14 drop-shadow-md w-full text-primary/75 ">
            <div className="flex flex-col">
                <div className="flex flex-row justify-center text-2xl md:text-3xl text-primary/80">
                    <div
                        className={`px-6 py-2 border-b-2 border-r-2 w-[200px] flex justify-center hover:cursor-pointer ${
                            selectedTab === "info" ? "border-b-blue-500" : ""
                        }`}
                        onClick={() => setSelectedTab("info")}
                    >
                        <span>Info</span>
                    </div>
                    <div
                        className={`px-6 py-2 border-b-2 w-[200px] flex justify-center hover:cursor-pointer ${
                            selectedTab === "expenses"
                                ? "border-b-blue-500"
                                : ""
                        }`}
                        onClick={() => setSelectedTab("expenses")}
                    >
                        <span>Expenses</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="text-base bg-red-500 hover:bg-red-600 font-semibold">
                                <TrashIcon className="w-5" />
                                <span className="ml-2">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this Expense profile!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        deleteExpenseProfileMutation.mutate()
                                    }
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            {selectedTab === "info" ? (
                <ExpenseProfileInfoCard id={id} />
            ) : selectedTab === "expenses" ? (
                <ExpenseProfileExpensesCard id={id} />
            ) : (
                <></>
            )}
        </div>
    );
}
