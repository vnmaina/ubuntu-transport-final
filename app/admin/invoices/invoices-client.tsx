"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import InvoiceForm from "@/components/admin/forms/invoice-form";
import InvoicePreview, { InvoiceDocument } from "@/components/admin/invoice-preview";
import { generateInvoicePDF } from "@/utils/pdf-generator";
import { useInvoice } from "@/context/invoice-context";
import { InvoiceProvider } from "@/context/invoice-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InvoiceData } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Eye,
  Download,
  Save,
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/currency";
import { getNextDocumentNumber } from "@/utils/document-number";

interface InvoicesClientProps {
  initialInvoices?: InvoiceData[];
}

export default function InvoicesClient({ initialInvoices }: InvoicesClientProps) {
  return (
    <InvoiceProvider>
      <InvoicesClientInner initialInvoices={initialInvoices} />
    </InvoiceProvider>
  );
}

function InvoicesClientInner({ initialInvoices }: InvoicesClientProps) {
  const [view, setView] = useState<"list" | "form" | "preview">("list");
  const [previousView, setPreviousView] = useState<"list" | "form">("list");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadInvoiceData, setDownloadInvoiceData] = useState<InvoiceData | null>(null);
  const invoices = useQuery(api.invoices.getInvoices) || [];
  const deleteInvoice = useMutation(api.invoices.deleteInvoice);
  const updateInvoiceMutation = useMutation(api.invoices.updateInvoice);

  // TanStack Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Horizontal scroll ref + helper
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const scrollTable = (direction: "left" | "right") => {
    const el = tableScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "right" ? 300 : -300, behavior: "smooth" });
  };

  const { invoice, updateInvoice, saveInvoice } = useInvoice();

  const refreshInvoices = useCallback(async () => {
    // Convex queries are reactive, no manual refresh needed
  }, []);

  const handleCreateNew = () => {
    const today = new Date().toISOString().split("T")[0];
    const newInvoiceNumber = getNextDocumentNumber("INV", invoices.map((i) => i.invoiceNumber));

    updateInvoice({
      _id: undefined,
      invoiceNumber: newInvoiceNumber,
      date: today,
      dueDate: "",
      fromName: "Ubuntu Logistics & Transport",
      fromEmail: "info@ubuntulogistics.co.ke",
      toName: "",
      toEmail: "",
      items: [
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          rate: 0,
          numberOfDays: 1,
          amount: 0,
        },
      ],
      taxRate: 16,
      taxAmount: 0,
      subtotal: 0,
      total: 0,
      currency: "KES",
      notes: "",
      status: "draft",
      numberOfDays: 1,
    });

    toast.info("Created new invoice draft.");
    setView("form");
  };

  const handleLoadInvoice = (inv: InvoiceData) => {
    updateInvoice(inv);
    toast.info(`Loaded invoice #${inv.invoiceNumber} for editing.`);
    setView("form");
  };

  const handlePreviewInvoice = (inv: InvoiceData) => {
    updateInvoice(inv);
    setPreviousView("list");
    setView("preview");
  };

  const handleDownloadInvoiceRow = async (inv: InvoiceData) => {
    const rowId = inv._id || inv.invoiceNumber;
    setDownloadingId(rowId);
    setDownloadInvoiceData(inv);
    const toastId = "row-download-" + inv.invoiceNumber;
    toast.loading(`Generating PDF for Invoice #${inv.invoiceNumber}...`, {
      id: toastId,
    });

    try {
      await new Promise((r) => setTimeout(r, 150));
      const targetEl = document.getElementById("hidden-invoice-download-target");
      if (!targetEl) throw new Error("Document element could not be prepared");
      await generateInvoicePDF(
        inv,
        `invoice-${inv.invoiceNumber}`,
        (targetEl.firstElementChild as HTMLElement) || targetEl
      );
      toast.success(`Invoice #${inv.invoiceNumber} PDF downloaded! (<200KB)`, {
        id: toastId,
      });
    } catch (err) {
      console.error("Direct download failed:", err);
      toast.error("Failed to generate and download invoice PDF.", { id: toastId });
    } finally {
      setDownloadInvoiceData(null);
      setDownloadingId(null);
    }
  };

  const handleSave = async () => {
    if (!invoice.toName || !invoice.toEmail) {
      toast.warning("Please provide client name and email before saving.");
      return;
    }

    try {
      // Save to history using context
      await saveInvoice();
      toast.success(`Invoice #${invoice.invoiceNumber} saved successfully!`);
      refreshInvoices();
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast.error("Failed to save invoice. Please check your data.");
    }
  };

  const handleDeleteInvoice = async (id: Id<"invoices"> | string) => {
    const confirmed = window.confirm(`Are you sure you want to delete this invoice?`);
    if (!confirmed) return;

    try {
      await deleteInvoice({ id: id as Id<"invoices"> });
      toast.success(`Invoice deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      toast.error(`Failed to delete invoice.`);
    }
  };

  const handleStatusChange = async (id: Id<"invoices"> | string, newStatus: string) => {
    try {
      await updateInvoiceMutation({ id: id as Id<"invoices">, status: newStatus as any });
      toast.success(`Invoice updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(`Failed to update status.`);
    }
  };

  const handleBackToList = () => {
    setView("list");
  };

  // Table Columns Definition
  const columns = useMemo<ColumnDef<InvoiceData>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Invoice ID</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-sm text-foreground">
            {row.original.invoiceNumber}
          </span>
        ),
      },
      {
        accessorKey: "toName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Client</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-sm">{row.original.toName || "N/A"}</div>
            <div className="text-xs text-muted-foreground">{row.original.toEmail}</div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Date</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.date || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "numberOfDays",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Days</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const days =
            row.original.items?.reduce(
              (sum, item) => sum + (item.numberOfDays === "" ? 1 : Number(item.numberOfDays) || 1),
              0
            ) || row.original.numberOfDays || 1;
          return <span className="text-xs font-medium">{days}</span>;
        },
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="-mr-3 h-8 font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span>Total Amount</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 size-3.5" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 size-3.5" />
              ) : (
                <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-semibold text-sm">
            {formatCurrency(row.original.total || 0, row.original.currency)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Status</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-3.5" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground/60" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const rawStatus = row.original.status || "draft";
          const isPaid = rawStatus === "paid";
          const isSent = rawStatus === "sent";
          const isDraft = rawStatus === "draft";
          const isOverdue = rawStatus === "overdue";
          const isCancelled = rawStatus === "cancelled";
          const isPartiallyPaid = rawStatus === "partially_paid";

          let badgeClasses = "bg-muted/60 text-muted-foreground border-border";
          let dotColor = "bg-muted-foreground";

          if (isPaid) {
            badgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50";
            dotColor = "bg-emerald-500";
          } else if (isSent) {
            badgeClasses = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50";
            dotColor = "bg-blue-500";
          } else if (isDraft) {
            badgeClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50";
            dotColor = "bg-amber-500";
          } else if (isOverdue) {
            badgeClasses = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50";
            dotColor = "bg-rose-500";
          } else if (isCancelled) {
            badgeClasses = "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
            dotColor = "bg-slate-500";
          } else if (isPartiallyPaid) {
            badgeClasses = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/50";
            dotColor = "bg-purple-500";
          }

          return (
            <Select
              value={rawStatus}
              onValueChange={(val) => {
                if (val && row.original._id) handleStatusChange(row.original._id, val);
              }}
            >
              <SelectTrigger className="h-7 w-auto border-0 p-0 shadow-none bg-transparent hover:opacity-80 focus:ring-0">
                <Badge
                  variant="outline"
                  className={`px-2 py-0.5 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${badgeClasses}`}
                >
                  {isPaid ? (
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className={`size-1.5 rounded-full ${dotColor}`} />
                  )}
                  <span>{rawStatus.replace("_", " ")}</span>
                </Badge>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const inv = row.original;
          const isDownloading = downloadingId === (inv._id || inv.invoiceNumber);

          return (
            <div className="flex justify-end items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 gap-1.5 text-xs text-slate-700 hover:text-[#262559] hover:bg-slate-50 border-slate-200"
                onClick={() => handlePreviewInvoice(inv)}
                title="Preview invoice"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 gap-1.5 text-xs text-slate-700 hover:text-[#262559] hover:bg-slate-50 border-slate-200"
                onClick={() => handleDownloadInvoiceRow(inv)}
                disabled={isDownloading}
                title="Download PDF"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#262559]" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Download</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 gap-1 text-xs border-slate-200"
                onClick={() => {
                  setPreviousView("list");
                  handleLoadInvoice(inv);
                }}
                title="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Edit</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2"
                onClick={() => inv._id && handleDeleteInvoice(inv._id)}
                disabled={!inv._id}
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [downloadingId]
  );

  const table = useReactTable({
    data: (invoices ?? []) as unknown as InvoiceData[],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  if (view === "preview") {
    return (
      <InvoicePreview
        onBack={() => setView(previousView)}
        onDownloadComplete={() => {
          handleCreateNew();
          setView("list");
          refreshInvoices();
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {view === "list" ? (
        <>
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
              <p className="text-muted-foreground text-sm">
                Manage and generate professional invoices for your clients.
              </p>
            </div>

            <Button onClick={handleCreateNew} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Invoice History</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <p className="text-muted-foreground mb-4">No invoices found in database.</p>
                  <Button onClick={handleCreateNew} variant="outline">
                    Create your first invoice
                  </Button>
                </div>
              ) : (
                <>
                  {/* Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border">
                    <div className="flex flex-1 items-center gap-2 flex-wrap">
                      <div className="relative flex-1 min-w-[100px] max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Search client name..."
                          value={(table.getColumn("toName")?.getFilterValue() as string) ?? ""}
                          onChange={(event) =>
                            table.getColumn("toName")?.setFilterValue(event.target.value)
                          }
                          className="pl-8 h-8 text-xs bg-background"
                        />
                      </div>
                       <div className="relative flex-1 min-w-[100px] max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Search invoice number..."
                          value={(table.getColumn("invoiceNumber")?.getFilterValue() as string) ?? ""}
                          onChange={(event) =>
                            table.getColumn("invoiceNumber")?.setFilterValue(event.target.value)
                          }
                          className="pl-8 h-8 text-xs bg-background"
                        />
                      </div>

                      <Select
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(val) => {
                          table.getColumn("status")?.setFilterValue(val === "all" ? "" : val);
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs bg-background">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partially_paid">Partially Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {isFiltered && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => table.resetColumnFilters()}
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3.5 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs ml-auto">
                            <SlidersHorizontal className="size-3.5" />
                            <span>Columns</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          {table
                            .getAllColumns()
                            .filter(
                              (column) =>
                                typeof column.accessorFn !== "undefined" &&
                                column.getCanHide()
                            )
                            .map((column) => (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize text-xs"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Table Component */}
                  <div className="relative group">
                    {/* Scroll Left Button */}
                    <button
                      onClick={() => scrollTable("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-50 hover:shadow-lg"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>

                    {/* Scrollable Table Wrapper */}
                    <div
                      ref={tableScrollRef}
                      className="overflow-x-auto rounded-xl border bg-card scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                    >
                      <Table className="min-w-[700px]">
                        <TableHeader className="bg-muted/50">
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="py-3 px-4">
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
                                className="hover:bg-muted/30 transition-colors"
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id} className="py-3 px-4">
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
                                className="h-28 text-center text-muted-foreground"
                              >
                                No matching invoices found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Scroll Right Button */}
                    <button
                      onClick={() => scrollTable("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-50 hover:shadow-lg"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  {/* Shadcn Radix Pagination Controls */}
                  <div className="flex items-center justify-between flex-wrap gap-4 py-2 px-1">
                    <div className="text-xs text-muted-foreground">
                      Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} invoice(s)
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="rows-per-page" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                          Rows per page
                        </Label>
                        <Select
                          value={`${table.getState().pagination.pageSize}`}
                          onValueChange={(value) => {
                            table.setPageSize(Number(value));
                          }}
                        >
                          <SelectTrigger size="sm" className="w-[70px] h-8 text-xs bg-background" id="rows-per-page">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            <SelectGroup>
                              {[5, 10, 20, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                                  {pageSize}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-xs font-medium whitespace-nowrap">
                        Page {table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          className="size-8 p-0"
                          onClick={() => table.setPageIndex(0)}
                          disabled={!table.getCanPreviousPage()}
                          title="First page"
                        >
                          <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8 p-0"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          title="Previous page"
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8 p-0"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          title="Next page"
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8 p-0"
                          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                          disabled={!table.getCanNextPage()}
                          title="Last page"
                        >
                          <ChevronsRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToList}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div>
              <h1 className="text-xl font-bold">
                {invoice._id ? "Edit Invoice" : "Create New Invoice"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Document ID: {invoice.invoiceNumber}
              </p>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button
                onClick={() => {
                  setPreviousView("form");
                  setView("preview");
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Invoice
              </Button>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-2xl border shadow-sm">
            <InvoiceForm />
          </div>
        </>
      )}

      {/* Hidden off-screen worker element for row-level instant PDF downloads */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        {downloadInvoiceData && (
          <div id="hidden-invoice-download-target">
            <InvoiceDocument invoice={downloadInvoiceData} />
          </div>
        )}
      </div>
    </div>
  );
}
