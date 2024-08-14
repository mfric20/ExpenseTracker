"use client";

import { Button } from "~/components/ui/button";

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

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
});

export default function ResetPasswordPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const resetPasswordMutation = useMutation({
        mutationKey: ["resetPasswordMutation"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await axios.post(
                "/api/auth/resetPassword",
                JSON.stringify({ email: values.email }),
            );
            return response.data;
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        resetPasswordMutation.mutate(values);
    }

    return (
        <div className="flex justify-center pt-32">
            <div className="m-6 flex w-full flex-col gap-8 rounded-sm border-2 p-10 md:m-0 md:w-1/5">
                <div className="flex justify-center text-3xl font-semibold">
                    <span className="text-blue-600">Expense</span>Tracker
                </div>
                <div>
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
                                                <FormControl>
                                                    <FormLabel>Email</FormLabel>
                                                    <Input
                                                        placeholder="Your email address..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    {resetPasswordMutation.isPending ? (
                                        <>Submiting...</>
                                    ) : (
                                        <>Reset password</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
                <div className="flex justify-center font-semibold">
                    {resetPasswordMutation.isSuccess ? (
                        <div>Email for password reset sent!</div>
                    ) : (
                        <></>
                    )}
                    {resetPasswordMutation.isError ? (
                        <div className="text-red-600">
                            User with this email not found!
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
