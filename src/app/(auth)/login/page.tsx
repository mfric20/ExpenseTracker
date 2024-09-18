"use client";

import { signIn } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 3 characters.",
    }),
});

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();

    const resendVerificationMutation = useMutation({
        mutationKey: ["resendVerification"],
        mutationFn: async (email: string) => {
            const response = await axios.put(
                "/api/auth/register/verification",
                JSON.stringify({
                    email: email,
                }),
            );
            return response.data;
        },
        onSettled: (data, variables, context) => {
            router.push(`/register/verification/${data.userId}`);
        },
    });

    const loginMutation = useMutation({
        mutationKey: ["loginMutation"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            signIn("credentials", values, { callbackurl: "/" });
        },
        onSuccess: (data, variables, context) => {
            router.push(`/`);
        },
    });

    useEffect(() => {
        if (searchParams.get("error") == "invalidCredentials") {
            setErrorMessage("invalidCredentials");
        } else if (searchParams.get("error") == "emailNotVerified") {
            setErrorMessage("emailNotVerified");
        } else if (searchParams.get("error") == "emailError") {
            setErrorMessage("emailError");
        }
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        signIn("credentials", values, { callbackurl: "/" });
    }

    async function resendVerificationCode() {
        const email = searchParams.get("email") as string;
        resendVerificationMutation.mutate(email);
    }

    return (
        <div className="flex justify-center pt-32">
            <div className="m-6 flex w-full flex-col gap-8 rounded-sm border-2 p-10 md:m-0 md:w-96 drop-shadow-lg ">
                <div className="flex justify-center text-3xl font-semibold">
                    <span className="text-blue-600">Expense</span>Tracker
                </div>
                <div>
                    {errorMessage == "invalidCredentials" ? (
                        <div className="text-center text-sm text-red-500">
                            Invalid email or password!
                        </div>
                    ) : null}
                    {errorMessage == "emailNotVerified" ? (
                        <div className="mb-3 flex flex-col gap-2 text-center text-sm text-red-500">
                            <span>Email is not verified! </span>
                            <div>
                                <Button
                                    onClick={() => {
                                        resendVerificationCode();
                                    }}
                                    variant={"destructive"}
                                >
                                    Resend verification code!
                                </Button>
                            </div>
                        </div>
                    ) : null}
                    {errorMessage == "emailError" ? (
                        <div className="text-center text-sm text-red-500">
                            Email address already in use!
                        </div>
                    ) : null}
                    <div className="flex flex-col gap-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your email address..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Your password..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end text-sm">
                                        <div
                                            onClick={() =>
                                                router.push("/resetPassword")
                                            }
                                            className="hover:cursor-pointer hover:underline"
                                        >
                                            Forgot your password?
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    {loginMutation.isPending ? (
                                        <>Submiting...</>
                                    ) : (
                                        <>Sign in</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                        <div className="text-sm text-primary">
                            Don't have an account?{" "}
                            <span
                                onClick={() => router.push("/register")}
                                className="text-blue-600 hover:cursor-pointer hover:underline"
                            >
                                Create one!
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-primary opacity-70"></div>
                    <span className="mx-4 flex-shrink font-semibold text-primary opacity-90">
                        OR
                    </span>
                    <div className="flex-grow border-t border-primary opacity-70"></div>
                </div>
                <div>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => signIn("google")}
                    >
                        <div className="flex flex-row justify-between gap-3">
                            <span className="m-auto flex text-center">
                                Sign In with Google
                            </span>
                            <img src="google.png" className="w-6"></img>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
