import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Expense } from "../cards/expenseProfileExpensesCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
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
import { useEffect, useState } from "react";

interface ExpenseType {
    id: string;
    name: string;
}

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    amount: z.coerce
        .number()
        .min(0, { message: "Amount must be a positive number." }),
    type: z.string().min(1, { message: "Please select a category." }),
});

interface ExpenseRowProps {
    expense: Expense;
    onSuccess: () => void;
}

export default function ExpenseRow({ expense, onSuccess }: ExpenseRowProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    // Fetch all expense types
    const expenseTypesQuery = useQuery<ExpenseType[]>({
        queryKey: ["expenseTypes"],
        queryFn: async () => {
            const response = await axios.get("/api/expenseTypes");
            return response.data.expenseTypes;
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: expense.name,
            amount: expense.amount,
            type: expense.type || "",
        },
    });

    // Reset form when expense changes
    useEffect(() => {
        form.reset({
            name: expense.name,
            amount: expense.amount,
            type: expense.type || "",
        });
    }, [expense, form]);

    const updateExpenseMutation = useMutation({
        mutationKey: ["updateExpense", expense.id],
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const response = await axios.put(`/api/expense/${expense.id}`, {
                ...data,
                amount: Number(data.amount),
            });
            return response.data;
        },
        onSuccess: () => {
            onSuccess();
            setDialogOpen(false);
        },
    });

    const deleteExpenseMutation = useMutation({
        mutationKey: ["deleteExpense", expense.id],
        mutationFn: async () => {
            const response = await axios.delete(`/api/expense/${expense.id}`);
            return response.data;
        },
        onSuccess,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateExpenseMutation.mutate({
            ...values,
            amount: Number(values.amount),
        });
    }

    return (
        <div className="flex items-center space-x-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <PencilIcon className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>
                            Make changes to your expense here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(
                                                        value === ""
                                                            ? ""
                                                            : Number(value),
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <select
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <option value="" disabled>
                                                    Select a category
                                                </option>
                                                {expenseTypesQuery.isLoading ? (
                                                    <option value="" disabled>
                                                        Loading categories...
                                                    </option>
                                                ) : expenseTypesQuery.isError ? (
                                                    <option value="" disabled>
                                                        Error loading categories
                                                    </option>
                                                ) : (
                                                    expenseTypesQuery.data?.map(
                                                        (type) => (
                                                            <option
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                {type.name}
                                                            </option>
                                                        ),
                                                    )
                                                )}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Date:</span>
                                    <span>
                                        {new Date(
                                            expense.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={updateExpenseMutation.isPending}
                                >
                                    {updateExpenseMutation.isPending
                                        ? "Saving..."
                                        : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this expense? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteExpenseMutation.mutate()}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteExpenseMutation.isPending}
                        >
                            {deleteExpenseMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
