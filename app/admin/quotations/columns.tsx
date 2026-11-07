"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
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

export type QuotationRow = {
    _id: string;
    quotationNumber: string;
    clientId: string;
    quotationDate: number;
    validUntil?: number;
    status: "draft" | "sent" | "accepted" | "rejected" | "expired";
    items: any[];
    subtotal: string;
    taxRate?: number;
    taxAmount?: string;
    discountAmount?: string;
    total: string;
    currency?: string;
    notes?: string;
    terms?: string;
    convertedToInvoiceId?: string;
    client?: any;
    _creationTime: number;
};

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    expired: "bg-orange-100 text-orange-700",
};

interface ColumnsProps {
    currentUserRole?: string;
    onEdit: (quotation: QuotationRow) => void;
    onDelete: (quotation: QuotationRow) => void;
    onPreview?: (quotation: QuotationRow) => void;
}

export function getColumns({
    currentUserRole,
    onEdit,
    onDelete,
    onPreview,
}: ColumnsProps): ColumnDef<QuotationRow, any>[] {
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
        // Quotation Number
        {
            accessorKey: "quotationNumber",
            header: ({ column }: { column: any }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quote #
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            ),
            cell: ({ row }: { row: any }) => (
                <span className="font-medium">{row.getValue("quotationNumber")}</span>
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
            accessorKey: "quotationDate",
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
                new Date(row.getValue("quotationDate")).toLocaleDateString(),
        },
        // Valid Until
        {
            accessorKey: "validUntil",
            header: "Valid Until",
            cell: ({ row }: { row: any }) => {
                const validUntil = row.getValue("validUntil");
                return validUntil ? new Date(validUntil).toLocaleDateString() : "—";
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
                const quotation = row.original;
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
                                {onPreview && (
                                    <DropdownMenuItem
                                        onClick={() => onPreview(quotation)}
                                        className="cursor-pointer"
                                    >
                                        <Eye className="size-4 mr-2" />
                                        Preview & Print
                                    </DropdownMenuItem>
                                )}
                                {canManage && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => onEdit(quotation)}
                                            className="cursor-pointer"
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(quotation)}
                                            className="cursor-pointer text-red-500 focus:text-red-500"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {!canManage && !onPreview && (
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
