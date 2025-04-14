"use client";

import { useState } from "react";
import ExpenseProfileExpensesCard from "~/components/cards/expenseProfileExpensesCard";
import ExpenseProfileInfoCard from "~/components/cards/expenseProfileInfoCard";
import ExpenseProfileAICard from "~/components/cards/expenseProfileAICard";

interface Props {
    params: {
        id: string;
    };
}

export default function ExpenseProfile({ params }: Props) {
    const [selectedTab, setSelectedTab] = useState<String>("info");
    const { id } = params;

    return (
        <div className="flex flex-col px-10 md:px-20 py-14 drop-shadow-sm w-full text-primary/75 ">
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
                        className={`px-6 py-2 border-b-2 border-r-2 w-[200px] flex justify-center hover:cursor-pointer ${
                            selectedTab === "expenses"
                                ? "border-b-blue-500"
                                : ""
                        }`}
                        onClick={() => setSelectedTab("expenses")}
                    >
                        <span>Expenses</span>
                    </div>
                    <div
                        className={`px-6 py-2 border-b-2 w-[200px] flex justify-center hover:cursor-pointer ${
                            selectedTab === "ai" ? "border-b-blue-500" : ""
                        }`}
                        onClick={() => setSelectedTab("ai")}
                    >
                        <span>AI</span>
                    </div>
                </div>
            </div>
            {selectedTab === "info" ? (
                <ExpenseProfileInfoCard id={id} />
            ) : selectedTab === "expenses" ? (
                <ExpenseProfileExpensesCard id={id} />
            ) : selectedTab === "ai" ? (
                <ExpenseProfileAICard id={id} />
            ) : (
                <></>
            )}
        </div>
    );
}
