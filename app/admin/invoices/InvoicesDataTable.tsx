"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

type ColumnFiltersState = Array<{
    id: string;
    value: unknown;
}>;

type SortingState = Array<{
    id: string;
    desc: boolean;
}>;

type VisibilityState = Record<string, boolean>;
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Plus, Download } from "lucide-react";
import { getColumns, InvoiceRow } from "./columns";
import { InvoiceFormSheet } from "./InvoiceFormSheet";
import { InvoicePreview } from "./InvoicePreview";

const STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];

interface InvoicesDataTableProps {
    data: InvoiceRow[];
    clients: any[];
    services: any[];
    quotations: any[];
    templates: any[];
    currentUserRole?: string;
}

export function InvoicesDataTable({ data, clients, services, quotations, templates, currentUserRole }: InvoicesDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Dialogs
    const [editingInvoice, setEditingInvoice] = useState<InvoiceRow | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<InvoiceRow | null>(null);

    const columns = getColumns({
        currentUserRole,
        onEdit: (invoice) => setEditingInvoice(invoice),
        onDelete: (invoice) => {
            console.log("Delete invoice:", invoice);
        },
        onPreview: (invoice) => setPreviewInvoice(invoice),
    });

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: { pageIndex: 0, pageSize: 10 },
        },
    });

    return (
        <div className="flex flex-col gap-4">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Add Invoice Button */}
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="size-4 mr-2" />
                    New Invoice
                </Button>

                {/* Search */}
                <Input
                    placeholder="Search invoices..."
                    value={(table.getColumn("invoiceNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("invoiceNumber")?.setFilterValue(e.target.value)
                    }
                    className="max-w-xs"
                />
                 <Input
                    placeholder="Search by Client Name..."
                    value={(table.getColumn("client.name")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("client.name")?.setFilterValue(e.target.value)
                    }
                    className="max-w-xs"
                />
                 <Input
                    placeholder="Search by Invoice Number..."
                    value={(table.getColumn("invoiceNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("invoiceNumber")?.setFilterValue(e.target.value)
                    }
                    className="max-w-xs"
                />

                {/* Status filter */}
                <Select
                    onValueChange={(val) =>
                        table
                            .getColumn("status")
                            ?.setFilterValue(val === "all" ? undefined : [val])
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        {STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Column visibility */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div
                            role="button"
                            className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                        >
                            Columns <ChevronDown className="size-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        className="capitalize cursor-pointer"
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(val) => col.toggleVisibility(!!val)}
                                    >
                                        {col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
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
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
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

            {/* Dialogs */}
            <InvoiceFormSheet
                invoice={editingInvoice}
                clients={clients}
                services={services}
                quotations={quotations}
                templates={templates}
                open={!!editingInvoice || isCreating}
                onClose={() => {
                    setEditingInvoice(null);
                    setIsCreating(false);
                }}
                isCreating={isCreating}
            />

            <InvoicePreview
                invoice={previewInvoice}
                clients={clients}
                templates={templates}
                open={!!previewInvoice}
                onClose={() => setPreviewInvoice(null)}
            />
        </div>
    );
}
