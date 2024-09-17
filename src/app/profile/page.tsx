"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import EditComponent from "~/components/basic/editComponent";

import { UploadButton } from "~/utils/uploadthing";
import { Tuser } from "~/types/types";
import { useMutation } from "@tanstack/react-query";

import axios from "axios";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "Password must be at least 3 characters.",
    }),
});

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState<Tuser>();
    const { data: session } = useSession();

    useEffect(() => {
        getUserInfoMutation.mutate(session?.user.email as string);
    }, [session]);

    const getUserInfoMutation = useMutation({
        mutationKey: ["getUserInfoMutation"],
        mutationFn: async (userEmail: string) => {
            const response = await axios.get(
                `/api/user?userEmail=${userEmail}`,
            );
            return response.data;
        },
        onSuccess: (data, variables, context) => {
            setUserInfo(data.userInfo);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
        },
    });

    return (
        <div>
            {session?.user ? (
                <div className="flex flex-row justify-center md:py-32">
                    <div className="drop-shadow-lg p-2 rounded-sm flex flex-col-reverse gap-16 md:justify-center md:flex-row">
                        <div className="flex p-10 flex-col gap-4 justify-center md:w-1/2">
                            <div className="rounded-full m-auto w-64 h-64 overflow-hidden ">
                                <img
                                    src={userInfo?.image ?? ""}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                            <div className="justify-center mt-3 flex flex-col gap-2">
                                <Label
                                    htmlFor="picture"
                                    className="text-center"
                                >
                                    Change profile picture
                                </Label>

                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={() => {
                                        window.location.reload();
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex mt-6 md:mt-0 md:p-10 justify-center md:pr-20 md:w-1/2">
                            <div className="flex flex-col gap-6 justify-center">
                                <div className="text-2xl mx-8 font-semibold text-center">
                                    <div className="flex flex-col gap-2">
                                        <p>Profile information</p>
                                        <hr />
                                    </div>
                                </div>
                                <Form {...form}>
                                    <form className="space-y-6">
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
                                                                    userInfo?.name ??
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
                                                                    userInfo?.email ??
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
                                    </form>
                                </Form>
                                <hr />
                                {userInfo ? (
                                    <EditComponent userInfo={userInfo} />
                                ) : (
                                    <></>
                                )}
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
