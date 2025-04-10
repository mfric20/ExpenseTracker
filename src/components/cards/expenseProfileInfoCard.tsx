import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { TExpenseProfile } from "~/types/types";
import { HeartIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import EditExpenseProfileComponent from "../basic/editExpenseProfileComponent";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
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
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
);
interface Texpense {
    id: string;
    name: string;
    amount: number;
    createdAt: string;
    type: string;
    typeName: string;
}

export default function ExpenseProfileInfoCard({ id }: { id: string }) {
    const router = useRouter();
    const [budget, setBudget] = useState<number>(0);
    const [spent, setSpent] = useState<number>(0);

    const expenseProfileQuery = useQuery<{
        expenseProfile: TExpenseProfile;
        expenses: Array<Texpense>;
    }>({
        queryKey: ["getExpenseProfile"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfile/${id}`);
            return response.data;
        },
    });

    const setFavoriteMutation = useMutation({
        mutationKey: ["setFavoriteMutation"],
        mutationFn: async () => {
            const response = await axios.put(
                `/api/expenseProfiles/favorites?expenseProfileId=${id}`,
            );
            return response.data;
        },
        onSuccess: () => {
            expenseProfileQuery.refetch();
        },
    });

    const deleteExpenseProfileMutation = useMutation({
        mutationKey: ["deleteExpenseProfileMutation"],
        mutationFn: async () => {
            const response = await axios.delete(
                `/api/expenseProfiles?expenseProfileId=${id}`,
            );
            return response.data;
        },
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    useEffect(() => {
        const fetchExpenseProfile = async () => {
            await expenseProfileQuery.refetch();
        };
        fetchExpenseProfile();
    }, []);

    useEffect(() => {
        setBudget(expenseProfileQuery?.data?.expenseProfile?.budget ?? 0);
        let totalSpent = 0;
        expenseProfileQuery?.data?.expenses?.forEach((expense: Texpense) => {
            totalSpent += expense.amount ?? 0;
        });
        setSpent(totalSpent);
    }, [expenseProfileQuery.isFetching]);

    const expenseProfile = expenseProfileQuery?.data?.expenseProfile;
    const expenses = expenseProfileQuery?.data?.expenses;

    const typeCounts =
        expenses?.reduce((acc: Record<string, number>, expense) => {
            acc[expense.typeName] = (acc[expense.typeName] || 0) + 1;
            return acc;
        }, {}) || {};

    const barOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const data = {
        labels: Object.keys(typeCounts),
        datasets: [
            {
                label: "Number of Expenses",
                data: Object.values(typeCounts),
                backgroundColor: [
                    "#FF5733",
                    "#33C1FF",
                    "#FFC300",
                    "#8E44AD",
                    "#2ECC71",
                    "#fa278b",
                ],
                borderWidth: 1,
            },
        ],
    };

    const categorySpending =
        expenses?.reduce((acc: Record<string, number>, expense) => {
            acc[expense.typeName] =
                (acc[expense.typeName] || 0) + expense.amount;
            return acc;
        }, {}) || {};

    const barData = {
        labels: Object.keys(categorySpending),
        datasets: [
            {
                label: "Amount Spent (€)",
                data: Object.values(categorySpending),
                backgroundColor: [
                    "#FF5733",
                    "#33C1FF",
                    "#FFC300",
                    "#8E44AD",
                    "#2ECC71",
                    "#fa278b",
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div>
            {expenseProfileQuery.isFetching ? (
                <div className="text-primary/70 text-2xl text-center mt-32 italic">
                    Loading...
                </div>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="text-base bg-red-500 hover:bg-red-600 font-semibold">
                                    <TrashIcon className="w-5" />
                                    <span className="ml-2">Delete Profile</span>
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
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
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
                    <div className="flex flex-row pt-10 gap-6">
                        <div className="h-fit border-2 rounded-md p-10 w-1/4">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <HeartIcon
                                    onClick={() => {
                                        setFavoriteMutation.mutate();
                                    }}
                                    className={`w-8 transition-colors duration-200 ${expenseProfile?.favorite ? "fill-red-500 text-red-500 hover:fill-none hover:text-primary" : "hover:fill-red-500 hover:text-red-500"} hover:cursor-pointer `}
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <PencilIcon className="w-7 hover:cursor-pointer" />
                                    </DialogTrigger>
                                    {expenseProfile ? (
                                        <EditExpenseProfileComponent
                                            expenseProfile={expenseProfile}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </Dialog>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className="h-20 w-20 mb-4 rounded-full"
                                    style={{
                                        backgroundColor:
                                            expenseProfile?.color ?? "",
                                    }}
                                ></div>
                                <h3 className="text-lg font-semibold mb-6">
                                    {expenseProfile?.name}
                                </h3>
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Created at:</span>
                                        <span className="font-medium">
                                            {expenseProfile?.createdAt?.toString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Monthly Budget:</span>
                                        <span className="font-medium">
                                            {expenseProfile?.budget} €
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Spent:</span>
                                        <span className="font-medium">
                                            {spent} €
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Remaining:</span>
                                        <span className="font-medium text-emerald-600">
                                            {budget - spent} €
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 w-full">
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(Number.parseFloat(spent?.toString()) / Number.parseFloat(budget?.toString())) * 100}%`,
                                                backgroundColor:
                                                    expenseProfile?.color ?? "",
                                            }}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground text-center">
                                        {Math.round(
                                            (Number.parseFloat(
                                                spent?.toString(),
                                            ) /
                                                Number.parseFloat(
                                                    budget?.toString(),
                                                )) *
                                                100,
                                        )}
                                        % of budget used
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-3/4 p-8 pt-16 flex gap-8 justify-center max-h-[432px] border-2 rounded-md">
                            <div>
                                <Pie data={data} />
                            </div>
                            <div className="flex pt-36 justify-self-end max-h-[300px] ">
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
