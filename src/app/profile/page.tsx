"use client";

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

import { useSession } from "next-auth/react";
import { Label } from "~/components/ui/label";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "Password must be at least 3 characters.",
    }),
});

export default function ProfilePage() {
    const { data: session } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {}

    return (
        <div>
            {session?.user ? (
                <div className="flex flex-row justify-center md:py-32">
                    <div className="rounded-sm border-2 flex flex-col gap-8 md:justify-center md:flex-row ">
                        <div className="flex p-10 flex-col gap-4 justify-center">
                            <img
                                src={session.user?.image ?? ""}
                                className="rounded-lg"
                            />
                            <div className="justify-center flex flex-col gap-2">
                                <Label
                                    htmlFor="picture"
                                    className="text-center"
                                >
                                    Change profile picture
                                </Label>
                                <div className="flex flex-row gap-2">
                                    <Input id="picture" type="file" />
                                    <Button>Upload</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex p-10 justify-center pr-20">
                            <div className="flex flex-col gap-6 justify-center">
                                <div className="text-2xl mx-8 font-semibold text-center">
                                    Profile information
                                </div>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Username
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                disabled
                                                                placeholder={
                                                                    session
                                                                        ?.user
                                                                        ?.name ??
                                                                    ""
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                disabled
                                                                placeholder={
                                                                    session
                                                                        ?.user
                                                                        ?.email ??
                                                                    ""
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                            >
                                                Change username
                                            </Button>
                                            <Button className="w-full">
                                                Change password{" "}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
