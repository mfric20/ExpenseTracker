import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    color: z.string(),
});

export default function CreateExpenseProfileComponent() {
    const [selectedColor, setSelectedColor] = useState<string>("#FFFFFF");

    const createExpenseProfileMutation = useMutation({
        mutationKey: ["createExpenseProfileMutation"],
        mutationFn: async (expenseProfile: z.infer<typeof formSchema>) => {
            const response = await axios.post(
                "/api/expenseProfiles/",
                expenseProfile,
            );
            return response.data;
        },
        onSuccess: () => {
            window.location.reload();
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: "#FFFFFF",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        values.color = selectedColor;
        createExpenseProfileMutation.mutate(values);
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Create <span className="text-blue-600">Expense</span>{" "}
                    profile
                </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                defaultValue=""
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center gap-2">
                                            <FormLabel className="text-right">
                                                Name
                                            </FormLabel>
                                            <FormControl className="col-span-3">
                                                <Input
                                                    placeholder="Name of the profile..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="col-start-2 col-span-3" />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-4 items-center gap-2">
                                <Label htmlFor="color" className="text-right">
                                    Color
                                </Label>
                                <div className="flex flex-row gap-2">
                                    <div
                                        className={`p-3 bg-[#FFFFFF] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#FFFFFF" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#FFFFFF")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#000000] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#000000" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#000000")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#031CFC] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#031CFC" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#031CFC")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#FC0324] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#FC0324" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#FC0324")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#FC03FC] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#FC03FC" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#FC03FC")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#962705] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#962705" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#962705")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#BCC206] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#BCC206" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#BCC206")
                                        }
                                    ></div>
                                    <div
                                        className={`p-3 bg-[#06C270] rounded-sm hover:cursor-pointer border-2 ${selectedColor == "#06C270" ? "border-gray-500" : "border-opacity-0"}`}
                                        onClick={() =>
                                            setSelectedColor("#06C270")
                                        }
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="px-6">
                                Finish
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </div>
        </DialogContent>
    );
}
