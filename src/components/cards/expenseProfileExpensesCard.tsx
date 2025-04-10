import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import ExpenseRow from "../table/expenseRow";
import { PlusIcon } from "@heroicons/react/24/outline";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// In expenseProfileExpensesCard.tsx
export interface Expense {
    id: string;
    name: string;
    amount: number;
    createdAt: string;
    typeName: string;
    type: string;
}

interface ExpenseType {
    id: string;
    name: string;
}

// Form schema for new expense
const newExpenseFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    amount: z.coerce
        .number()
        .min(0, { message: "Amount must be a positive number." }),
    type: z.string().min(1, { message: "Please select a category." }),
});

const columnHelper = createColumnHelper<Expense>();

export default function ExpenseProfileExpensesCard({ id }: { id: string }) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    // Add state to control dialog open/close
    const [dialogOpen, setDialogOpen] = useState(false);

    const expensesQuery = useQuery({
        queryKey: ["getExpenses", id],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfile/${id}`);
            return response.data.expenses || [];
        },
    });

    // Fetch expense types for the dropdown
    const expenseTypesQuery = useQuery({
        queryKey: ["expenseTypes"],
        queryFn: async () => {
            const response = await axios.get("/api/expenseTypes");
            return response.data.expenseTypes;
        },
    });

    // Form for new expense
    const form = useForm<z.infer<typeof newExpenseFormSchema>>({
        resolver: zodResolver(newExpenseFormSchema),
        defaultValues: {
            name: "",
            amount: undefined,
            type: "",
        },
    });

    // Create new expense mutation
    const createExpenseMutation = useMutation({
        mutationKey: ["createExpense"],
        mutationFn: async (data: z.infer<typeof newExpenseFormSchema>) => {
            const response = await axios.post("/api/expense", {
                ...data,
                amount: Number(data.amount),
                expenseProfileId: id,
            });
            return response.data;
        },
        onSuccess: () => {
            expensesQuery.refetch();
            form.reset({
                name: "",
                amount: undefined,
                type: "",
            });
            // Close dialog on successful submission
            setDialogOpen(false);
        },
    });

    // Submit handler
    function onSubmit(values: z.infer<typeof newExpenseFormSchema>) {
        createExpenseMutation.mutate(values);
    }

    const columns = [
        columnHelper.accessor("name", {
            header: "Name",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("amount", {
            header: "Amount",
            cell: (info) => `${info.getValue()} €`,
        }),
        columnHelper.accessor("typeName", {
            header: "Category",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("createdAt", {
            header: "Date",
            cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: (info) => (
                <ExpenseRow
                    expense={info.row.original}
                    onSuccess={() => expensesQuery.refetch()}
                />
            ),
        }),
    ];

    const table = useReactTable({
        data: expensesQuery.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        manualPagination: false,
    });

    if (expensesQuery.isLoading) {
        return <div className="text-center p-8">Loading expenses...</div>;
    }

    if (expensesQuery.isError) {
        return (
            <div className="text-center p-8 text-red-500">
                Error loading expenses. Please try again.
            </div>
        );
    }

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Expenses List</h2>

                {/* Use controlled Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Expense</DialogTitle>
                            <DialogDescription>
                                Create a new expense for this profile.
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
                                                <Input
                                                    {...field}
                                                    placeholder="Expense name"
                                                />
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
                                                    placeholder="Amount"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(
                                                            value === ""
                                                                ? undefined
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
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Loading
                                                            categories...
                                                        </option>
                                                    ) : expenseTypesQuery.isError ? (
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Error loading
                                                            categories
                                                        </option>
                                                    ) : (
                                                        expenseTypesQuery.data?.map(
                                                            (type: any) => (
                                                                <option
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
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
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={
                                            createExpenseMutation.isPending
                                        }
                                    >
                                        {createExpenseMutation.isPending
                                            ? "Creating..."
                                            : "Create Expense"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                {!expensesQuery.data || expensesQuery.data.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        No expenses found. Create one using the "New Expense"
                        button.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    key={headerGroup.id}
                                    className="border-b bg-muted/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="h-10 px-4 text-left align-middle font-medium"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b hover:bg-muted/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="p-4 align-middle"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} expense(s) total
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="rounded border p-1 px-2 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
                    <button
                        className="rounded border p-1 px-2 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded border p-1"
                    >
                        {[5, 10, 20].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
