"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="px-auto w-full md:px-40 md:py-32">
      <div className="flex flex-col gap-14 md:w-full md:flex-row md:justify-between">
        <div className="flex w-full">
          <div className="flex flex-col gap-6 p-10 text-4xl font-semibold md:m-auto md:p-0 md:text-6xl">
            <span className="font-bold">
              The easiest way to track your{" "}
              <span className="text-blue-600">balance!</span>
            </span>
            <span className="text-justify text-base font-normal opacity-85 md:text-xl">
              Introducing{" "}
              <span className="text-blue-600 opacity-100">Expense</span>Tracker,
              your ultimate expense tracking app designed to simplify and
              streamline your financial management. With{" "}
              <span className="text-blue-600 opacity-100">Expense</span>Tracker,
              effortlessly monitor your spending, categorize expenses, and gain
              insights into your financial habits. Our intuitive interface
              allows you to track transactions in real-time, set budget limits,
              and receive alerts to help you stay within your means.
            </span>
            <div>
              <Button
                onClick={() => router.push("/register")}
                className="text-base font-semibold"
              >
                Try It Out
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <img
            src="phone.png"
            alt="landingpage_photo"
            className="m-auto w-[600px]"
          />
        </div>
      </div>
    </main>
  );
}
