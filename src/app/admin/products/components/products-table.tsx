"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ProductDialog } from "./product-dialog";
import { DeleteButtonDialog } from "@/components/delete-btn-dialog";
import { FeatureButton } from "./feature-button";
import { ServerError } from "@/components/server-error";

interface Product {
    id: string;
    name: string;
    category: { name: string };
    price: number;
    stock: number;
    featured: boolean;
}

interface ProductsTableProps {
    data: Product[];
    categories: { id: string; name: string; }[];  
    deleteProduct: (id: string) => Promise<void>;
    toggleFeature: (formData: FormData) => Promise<void>;
}

export function ProductsTable({ data, categories, deleteProduct, toggleFeature }: ProductsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
                    </Button>
                )
            },
        },
        {
            accessorKey: "category.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Category
                        {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
                    </Button>
                )
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
                    </Button>
                )
            },
            cell: ({ row }) => {
                return `₱ ${row.getValue("price")}`;
            },
        },
        {
            accessorKey: "stock",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Stock
                        {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
                    </Button>
                )
            },
            cell: ({ row }) => {
                return `${row.getValue("stock")} pcs.`;
            },
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const product = row.original;

                return (
                <div className="flex items-center space-x-2">
                    <ProductDialog categories={categories} product={product} />
                    <DeleteButtonDialog
                    title="Delete Product"
                    description={`Are you sure you want to delete "${product.name}"?`}
                    action={() => deleteProduct(product.id)}
                    errorComponent={ServerError}
                    />
                    <FeatureButton
                    productId={product.id}
                    featured={product.featured}
                    onToggle={toggleFeature}
                    />
                </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            }
        }
    });

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search products here..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            );
                            })}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                            >
                                No products found.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="border rounded-md p-1 mr-1"
                >
                    {[10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div className="text-sm text-gray-700 dark:text-gray-400">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}