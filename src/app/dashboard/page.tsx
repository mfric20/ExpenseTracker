"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session } = useSession();

    console.log(session);
    return <div></div>;
}
