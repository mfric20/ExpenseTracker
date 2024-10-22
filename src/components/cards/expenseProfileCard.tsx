"use client";

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
import { TExpenseProfile } from "~/types/types";
import { Button } from "../ui/button";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useToast } from "~/components/hooks/use-toast";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

export default function ExpenseProfileCard({
    expenseProfile,
    expenseProfileQuery,
}: {
    expenseProfile: TExpenseProfile;
    expenseProfileQuery: UseQueryResult<
        {
            id: string;
            name: string | null;
            color: string | null;
            favorite: boolean | null;
            userId: string;
        }[],
        Error
    >;
}) {
    const { toast } = useToast();

    const deleteExpenseProfileMutation = useMutation({
        mutationKey: ["deleteExpenseProfileMutation"],
        mutationFn: async () => {
            const response = await axios.delete(
                `/api/expenseProfiles?expenseProfileId=${expenseProfile.id}`,
            );
            return response.data;
        },
        onSuccess: () => {
            expenseProfileQuery.refetch();
        },
    });

    const setFavoriteMutation = useMutation({
        mutationKey: ["setFavoriteMutation"],
        mutationFn: async () => {
            const response = await axios.put(
                `/api/expenseProfiles/favorites?expenseProfileId=${expenseProfile.id}`,
            );
            return response.data;
        },
        onSuccess: () => {
            expenseProfileQuery.refetch();
        },
    });

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
                        onClick={async () => {
                            setFavoriteMutation.mutate();
                            if (setFavoriteMutation.isSuccess)
                                toast({
                                    description: "Your favorites are updated!",
                                });
                        }}
                        className={`w-8 transition-colors duration-200 ${expenseProfile.favorite ? "fill-red-500 text-red-500 hover:fill-none hover:text-primary" : "hover:fill-red-500 hover:text-red-500"} hover:cursor-pointer `}
                    />
                </div>
            </div>
            <div className="flex -mr-5">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <TrashIcon className="w-8 my-auto text-white bg-red-600 p-1 rounded-md -translate-x-4 hover:cursor-pointer hover:bg-red-600/80 transition-colors duration-300" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete selected Expense profile!
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
    );
}
