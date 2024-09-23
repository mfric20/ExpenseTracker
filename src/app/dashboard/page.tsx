"use client";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import axios from "axios";

export default function DashboardPage() {
    const [screenWidth, setScreenWidth] = useState(0);

    const expenseProfilesQuery = useQuery({
        queryKey: ["getExpenseProfiles"],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfiles`);
            return response.data;
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
        <div>
            <div className="flex flex-col gap-6 px-10 md:px-36 py-8 drop-shadow-md">
                <div className="mx-auto text-2xl md:text-4xl font-semibold">
                    <span className="text-blue-600">Expense</span> profiles
                </div>

                <hr />
            </div>
            <PlusCircleIcon className="w-14 fixed md:bottom-20 md:right-20 bottom-12 right-12 text-button drop-shadow-md hover:text-button/90 hover:cursor-pointer" />
        </div>
    );
}
