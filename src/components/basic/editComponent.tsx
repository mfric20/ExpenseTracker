"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";

import { Tuser, TError } from "~/types/types";

import axios from "axios";

const usernameFormSchema = z.object({
    userName: z.string().min(2, {
        message: "Username must be at least 2 letters long.",
    }),
});

const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(3, {
            message: "Password must be at least 3 letters long.",
        }),
        newPassword: z.string().min(3, {
            message: "Password must be at least 3 letters long.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function EditComponent({ userInfo }: { userInfo: Tuser }) {
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
        resolver: zodResolver(usernameFormSchema),
        defaultValues: {
            userName: userInfo.name ?? "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const changeUsernameMutation = useMutation({
        mutationKey: ["usernameMutation"],
        mutationFn: async (values: z.infer<typeof usernameFormSchema>) => {
            const response = await axios.put(
                `/api/user?userEmail=${userInfo.email}&newUsername=${values.userName}`,
            );
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
    });

    const changePasswordMutation = useMutation({
        mutationKey: ["passwordMutation"],
        mutationFn: async (values: z.infer<typeof passwordFormSchema>) => {
            const response = await axios.post(
                `/api/user?userEmail=${userInfo.email}`,
                values,
            );
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            window.location.reload();
        },
        onError(error: TError, variables, context) {
            if (error.response.status == 403) setWrongPassword(true);
        },
    });

    function onUsernameFormSubmit(values: z.infer<typeof usernameFormSchema>) {
        changeUsernameMutation.mutate(values);
    }

    function onPasswordFormSubmit(values: z.infer<typeof passwordFormSchema>) {
        changePasswordMutation.mutate(values);
    }

    return (
        <div className="flex flex-row gap-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Change username
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change username</DialogTitle>
                        <DialogDescription>
                            Enter your new username below.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...usernameForm}>
                        <form
                            onSubmit={usernameForm.handleSubmit(
                                onUsernameFormSubmit,
                            )}
                            className="space-y-6 px-6"
                        >
                            <FormField
                                control={usernameForm.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="w-full"
                        variant="outline"
                        disabled={userInfo.provider == "google"}
                    >
                        Change password
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change password</DialogTitle>
                        <DialogDescription>
                            Enter your new password below.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(
                                onPasswordFormSubmit,
                            )}
                            className="space-y-2 px-6"
                        >
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel
                                            className={`${wrongPassword ? "text-red-600" : " "}`}
                                        >
                                            Current password
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        {wrongPassword ? (
                                            <div className="text-red-600 text-sm">
                                                Invalid password!
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Confirm new password
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button className="mt-4" type="submit">
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
