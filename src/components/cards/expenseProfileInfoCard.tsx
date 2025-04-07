import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { TExpenseProfile } from "~/types/types";
import { HeartIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function ExpenseProfileInfoCard({ id }: { id: string }) {
    const expenseProfileQuery = useQuery<TExpenseProfile>({
        queryKey: ["getExpenseProfile"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfile/${id}`);
            return response.data.expenseProfile;
        },
    });

    useEffect(() => {
        const fetchExpenseProfile = async () => {
            await expenseProfileQuery.refetch();
        };
        fetchExpenseProfile();
    }, []);

    const expenseProfile = expenseProfileQuery.data;

    const spent = "75";
    const budget = "100";
    return (
        <div>
            {expenseProfileQuery.isFetching ? (
                <div className="text-primary/70 text-2xl text-center mt-32 italic">
                    Loading...
                </div>
            ) : (
                <div className="flex flex-row pt-16 gap-6">
                    <div className="h-fit border-2 rounded-md p-10 w-1/4">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <HeartIcon
                                className={`w-8 transition-colors duration-200 ${expenseProfile?.favorite ? "fill-red-500 text-red-500 hover:fill-none hover:text-primary" : "hover:fill-red-500 hover:text-red-500"} hover:cursor-pointer `}
                            />
                            <PencilIcon className="w-7 hover:cursor-pointer" />
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
                                    <span className="font-medium">0 €</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Remaining:</span>
                                    <span className="font-medium text-emerald-600">
                                        remaining
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 w-full">
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(Number.parseFloat(spent.replace(/[^0-9.]/g, "")) / Number.parseFloat(budget.replace(/[^0-9.]/g, ""))) * 100}%`,
                                            backgroundColor:
                                                expenseProfile?.color ?? "",
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground text-center">
                                    {Math.round(
                                        (Number.parseFloat(spent) /
                                            Number.parseFloat(budget)) *
                                            100,
                                    )}
                                    % of budget used
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-3/4 border-2 rounded-md">graphs</div>
                </div>
            )}
        </div>
    );
}
