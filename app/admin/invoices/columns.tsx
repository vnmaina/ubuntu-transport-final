"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/currency";

export type InvoiceRow = {
    _id: string;
    invoiceNumber: string;
    clientId: string;
    quotationId?: string;
    invoiceDate: number;
    dueDate?: number;
    status: "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";
    items: any[];
    subtotal: string;
    taxRate?: number;
    taxAmount?: string;
    discountAmount?: string;
    total: string;
    currency?: string;
    paidAmount?: string;
    balanceDue?: string;
    paymentType?: "MPESA" | "BANK" | "CASH" | "OTHER";
    paymentReference?: string;
    paymentDate?: string;
    notes?: string;
    terms?: string;
    templateId?: string;
    client?: any;
    quotation?: any;
    _creationTime: number;
};

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    partially_paid: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-orange-100 text-orange-700",
};

interface ColumnsProps {
    currentUserRole?: string;
    onEdit: (invoice: InvoiceRow) => void;
    onDelete: (invoice: InvoiceRow) => void;
    onPreview: (invoice: InvoiceRow) => void;
}

export function getColumns({
    currentUserRole,
    onEdit,
    onDelete,
    onPreview,
}: ColumnsProps): ColumnDef<InvoiceRow, any>[] {
    const canManage = currentUserRole && ["superadmin", "admin", "staff"].includes(currentUserRole);

    return [
        // Select column
        {
            id: "select",
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        // Invoice Number
        {
            accessorKey: "invoiceNumber",
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invoice #
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) => (
                <span className="font-medium">{row.getValue("invoiceNumber")}</span>
            ),
        },
        // Client
        {
            accessorKey: "client",
            header: "Client",
            cell: ({ row }: { row: any }) => {
                const client = row.original.client;
                return <span className="text-muted-foreground">{client?.name || "—"}</span>;
            },
        },
        // Date
        {
            accessorKey: "invoiceDate",
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) =>
                new Date(row.getValue("invoiceDate")).toLocaleDateString(),
        },
        // Due Date
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }: { row: any }) => {
                const dueDate = row.getValue("dueDate");
                return dueDate ? new Date(dueDate).toLocaleDateString() : "—";
            },
        },
        // Total
        {
            accessorKey: "total",
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) => (
                <span className="font-medium">{formatCurrency(row.getValue("total"), row.original.currency)}</span>
            ),
        },
        // Balance Due
        {
            accessorKey: "balanceDue",
            header: "Balance",
            cell: ({ row }: { row: any }) => {
                const balance = row.getValue("balanceDue");
                const total = parseFloat(row.getValue("total"));
                const balanceNum = balance ? parseFloat(balance) : total;
                return (
                    <span className={balanceNum > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                        {formatCurrency(balance || row.getValue("total"), row.original.currency)}
                    </span>
                );
            },
        },
        // Status
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: any }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge
                        className={STATUS_COLORS[status] ?? STATUS_COLORS.draft}
                        variant="outline"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
            filterFn: (row: any, id: any, value: any) => value.includes(row.getValue(id)),
        },
        // Created
        {
            accessorKey: "_creationTime",
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) =>
                new Date(row.getValue("_creationTime")).toLocaleDateString(),
        },
        // Actions
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }: { row: any }) => {
                const invoice = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div
                                role="button"
                                className="flex size-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer"
                            >
                                <MoreHorizontal className="size-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => onPreview(invoice)}
                                    className="cursor-pointer"
                                >
                                    <Eye className="size-4 mr-2" />
                                    Preview & Print
                                </DropdownMenuItem>
                                {canManage && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => onEdit(invoice)}
                                            className="cursor-pointer"
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(invoice)}
                                            className="cursor-pointer text-red-500 focus:text-red-500"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {!canManage && (
                                    <DropdownMenuItem disabled>No actions</DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
