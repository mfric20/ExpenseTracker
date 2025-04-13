import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
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

const newExpenseFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    amount: z.coerce
        .number()
        .min(0, { message: "Amount must be a positive number." }),
    type: z.string().min(1, { message: "Please select a category." }),
});

const columnHelper = createColumnHelper<Expense>();

interface Props {
    readonly id: string;
}

const renderExpenseTypeOptions = (expenseTypesQuery: {
    isLoading: boolean;
    isError: boolean;
    data?: ExpenseType[];
}) => {
    if (expenseTypesQuery.isLoading) {
        return (
            <option value="" disabled>
                Loading categories...
            </option>
        );
    }
    if (expenseTypesQuery.isError) {
        return (
            <option value="" disabled>
                Error loading categories
            </option>
        );
    }
    return expenseTypesQuery.data?.map((type) => (
        <option key={type.id} value={type.name}>
            {type.name}
        </option>
    ));
};

export default function ExpenseProfileExpensesCard({ id }: Props) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const expensesQuery = useQuery({
        queryKey: ["getExpenses", id],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfile/${id}`);
            return response.data.expenses || [];
        },
    });

    const expenseTypesQuery = useQuery({
        queryKey: ["expenseTypes"],
        queryFn: async () => {
            const response = await axios.get("/api/expenseTypes");
            return response.data.expenseTypes;
        },
    });

    const form = useForm<z.infer<typeof newExpenseFormSchema>>({
        resolver: zodResolver(newExpenseFormSchema),
        defaultValues: {
            name: "",
            amount: undefined,
            type: "",
        },
    });

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
            setDialogOpen(false);
        },
    });

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
            filterFn: (row, id, value) => {
                if (value === "all") return true;
                return row.getValue(id) === value;
            },
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

    const filteredData = useMemo(() => {
        if (!expensesQuery.data) return [];
        let filtered = expensesQuery.data;

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (expense: Expense) => expense.typeName === selectedCategory,
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((expense: Expense) =>
                expense.name.toLowerCase().includes(query),
            );
        }

        return filtered;
    }, [expensesQuery.data, selectedCategory, searchQuery]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        state: {
            pagination,
            sorting,
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
        <div className="w-full p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Expenses List
                </h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-[200px]"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="all">All Categories</option>
                        {renderExpenseTypeOptions(expenseTypesQuery)}
                    </select>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
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
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            field.onChange(
                                                                value === ""
                                                                    ? undefined
                                                                    : Number(
                                                                          value,
                                                                      ),
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
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Select a category
                                                        </option>
                                                        {renderExpenseTypeOptions(
                                                            expenseTypesQuery,
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
            </div>

            {/* Expenses Table */}
            <div className="rounded-md border overflow-x-auto">
                {!expensesQuery.data || expensesQuery.data.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        No expenses found. Create one using the "New Expense"
                        button.
                    </div>
                ) : (
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    key={headerGroup.id}
                                    className="border-b bg-muted/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="h-10 px-2 sm:px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {{
                                                    asc: " ↓",
                                                    desc: " ↑",
                                                }[
                                                    header.column.getIsSorted() as string
                                                ] ?? null}
                                            </div>
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
                                            className="p-2 sm:p-4 align-middle"
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

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} expense(s) total
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            className="rounded border p-1 px-2 disabled:opacity-50 flex-1 sm:flex-none"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <span className="text-sm whitespace-nowrap">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                        <button
                            className="rounded border p-1 px-2 disabled:opacity-50 flex-1 sm:flex-none"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </button>
                    </div>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded border p-1 w-full sm:w-auto"
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
