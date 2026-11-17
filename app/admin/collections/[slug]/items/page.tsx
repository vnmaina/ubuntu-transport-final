"use client";

import { useState, Suspense, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Trash2,
  Edit,
  Eye,
  Plus,
  ArrowLeft,
  ExternalLink,
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { flexRender, type RowSelectionState } from "@tanstack/react-table";
import { ItemFormSheet, ItemFormData } from "@/components/admin/item-form-sheet";
import Image from "next/image";

type ColumnFiltersState = Array<{
  id: string;
  value: unknown;
}>;

type SortingState = Array<{
  id: string;
  desc: boolean;
}>;

type VisibilityState = Record<string, boolean>;

const ICON_NAME_TO_EMOJI: Record<string, string> = {
  briefcase: "💼",
  folder: "📁",
  users: "👥",
  package: "📦",
  services: "💼",
  projects: "📁",
  team: "👥",
  products: "📦",
};

function getIconDisplay(icon?: string): string {
  if (!icon) return "📦";
  if (icon.length > 1 && !/^[a-zA-Z]+$/.test(icon)) return icon;
  return ICON_NAME_TO_EMOJI[icon] || "📦";
}

function getCleanDescription(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const initialFormData: ItemFormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  imageUrl: "",
  icon: "",
  tags: [],
  gallery: [],
  galleryType: "grid",
  contentBlocks: [],
  metadata: {
    duration: "",
    features: [],
    client: "",
    projectDate: "",
    technologies: [],
    projectUrl: "",
    role: "",
    email: "",
    linkedin: "",
    twitter: "",
    github: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    dribbble: "",
    behance: "",
    website: "",
    bio: "",
    department: "",
    hireDate: "",
    location: "",
    expertise: [],
    achievements: [],
    sku: "",
    stock: 0,
    price: "",
    pricingType: undefined,
  },
  faq: [],
  reviews: [],
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  twitterCard: "summary_large_image",
  canonicalUrl: "",
  robots: "index, follow",
  published: false,
  order: 0,
};

type ItemRow = {
  _id: Id<"collectionItems">;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  tags?: string[];
  published?: boolean;
  order?: number;
  metadata?: {
    duration?: string;
    features?: string[];
    client?: string;
    projectDate?: string;
    technologies?: string[];
    projectUrl?: string;
    role?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    sku?: string;
    stock?: number;
    expertise?: string;
    achievements?: string[];
    price?: string;
    pricingType?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robots?: string;
  content?: string;
  gallery?: string[];
  galleryType?: "grid" | "carousel" | "masonry" | "slider";
  contentBlocks?: Array<{
    id: string;
    type: "hero" | "timeline" | "specifications" | "testimonials" | "cta" | "image" | "text" | "divider";
    title?: string;
    content?: string;
    data?: any;
    order: number;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ author: string; rating: number; comment: string; date: string }>;
  _creationTime?: number;
};

function AdminCollectionItemsContent() {
  const { slug } = useParams();

  // ─── Convex Queries & Mutations ─────────────────────────────────────────────
  const collection = useQuery(api.collections.getCollectionBySlug, { slug: slug as string });
  const items = useQuery(api.collections.getItemsByCollection, {
    collectionId: collection?._id as Id<"collections">,
  });

  const createCollectionItem = useMutation(api.collections.createCollectionItem);
  const updateCollectionItem = useMutation(api.collections.updateCollectionItem);
  const deleteCollectionItem = useMutation(api.collections.deleteCollectionItem);

  // ─── Component State ────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<Id<"collectionItems"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>(initialFormData);

  // ─── Table State (UsersDataTable pattern) ──────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    price: false,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Stable derived values
  const collectionSlug = collection?.slug ?? "";
  const collectionIcon = collection?.icon ?? "📦";
  const collectionName = collection?.name ?? "";

  // Filtered dataset by status
  const filteredData = useMemo(() => {
    if (!items) return [];
    let data = items as ItemRow[];
    if (statusFilter === "published") data = data.filter((i) => i.published);
    if (statusFilter === "draft") data = data.filter((i) => !i.published);
    return data;
  }, [items, statusFilter]);

  // ─── Table Columns Definition ───────────────────────────────────────────────
  const columns: ColumnDef<ItemRow>[] = useMemo(
    () => [
      // Select Checkbox Column
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
      // Item Title & Slug Column
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: any) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 hover:bg-transparent hover:text-foreground font-semibold"
          >
            Item
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }: any) => (
          <div className="flex items-center gap-3 min-w-0 max-w-[240px] sm:max-w-[280px] lg:max-w-xs py-1">
            {row.original.imageUrl ? (
              <Image
                src={row.original.imageUrl}
                alt={row.original.title}
                width={40}
                height={40}
                className="size-10 object-cover rounded-lg border border-border shrink-0"
              />
            ) : (
              <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0">
                {getIconDisplay(row.original.icon || collectionIcon)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div
                className="font-semibold text-foreground text-sm truncate"
                title={row.original.title}
              >
                {row.original.title}
              </div>
              <div
                className="text-xs font-mono text-muted-foreground truncate"
                title={`/${collectionSlug}/${row.original.slug}`}
              >
                /{collectionSlug}/{row.original.slug}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
        enableHiding: false,
      },
      // Clamped Description Column
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: ({ row }: any) => {
          const desc = getCleanDescription(row.original.description);
          if (!desc) {
            return <span className="text-xs text-muted-foreground/60 italic">—</span>;
          }
          return (
            <div className="max-w-[240px] md:max-w-[300px] lg:max-w-sm min-w-0 py-1">
              <p
                className="text-xs text-muted-foreground line-clamp-2 break-words leading-relaxed"
                title={desc}
              >
                {desc}
              </p>
            </div>
          );
        },
        enableSorting: false,
      },
      // Tags Column
      {
        id: "tags",
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }: any) => {
          const tags = row.original.tags || [];
          if (!tags.length) {
            return <span className="text-xs text-muted-foreground/60 italic">—</span>;
          }
          return (
            <div className="flex flex-wrap items-center gap-1 max-w-[180px] min-w-0 py-1">
              {tags.slice(0, 2).map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-normal truncate max-w-[80px]"
                  title={`#${tag}`}
                >
                  #{tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 font-normal text-muted-foreground shrink-0 cursor-default"
                  title={tags.slice(2).map((t: string) => `#${t}`).join(", ")}
                >
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      // Order Column
      {
        id: "order",
        accessorKey: "order",
        header: ({ column }: any) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 hover:bg-transparent hover:text-foreground font-semibold"
          >
            Order
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }: any) => (
          <span className="text-xs font-mono text-muted-foreground">
            #{row.original.order ?? 0}
          </span>
        ),
        enableSorting: true,
      },
      // Status Column
      {
        id: "status",
        accessorKey: "published",
        header: ({ column }: any) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 hover:bg-transparent hover:text-foreground font-semibold"
          >
            Status
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }: any) => (
          <Badge
            variant={row.original.published ? "default" : "secondary"}
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {row.original.published ? (
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Published
              </span>
            ) : (
              "Draft"
            )}
          </Badge>
        ),
        enableSorting: true,
      },
      // Price Column (hideable)
      {
        id: "price",
        accessorKey: "metadata.price",
        header: "Price",
        cell: ({ row }: any) => {
          const price = row.original.metadata?.price;
          if (!price) return <span className="text-xs text-muted-foreground/60 italic">—</span>;
          return <span className="text-xs font-mono font-medium">{price}</span>;
        },
        enableSorting: false,
      },
      // Actions Column
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: any) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              onClick={() => openEditSheet(row.original)}
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 rounded-lg text-xs font-medium gap-1 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="size-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  role="button"
                  className="flex size-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => openEditSheet(row.original)}
                    className="cursor-pointer gap-2"
                  >
                    <Edit className="size-4" /> Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem >
                    <Link
                      href={`/collections/${collectionSlug}/${row.original.slug}`}
                      target="_blank"
                      className="cursor-pointer gap-2 flex items-center"
                    >
                      <Eye className="size-4" /> View Public
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/collections/${collectionSlug}/${row.original.slug}`
                        );
                        toast.success("Link copied to clipboard");
                      }
                    }}
                    className="cursor-pointer gap-2"
                  >
                    <Copy className="size-4" /> Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteItem(row.original._id)}
                    className="cursor-pointer text-destructive focus:text-destructive gap-2"
                  >
                    <Trash2 className="size-4" /> Delete Item
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collectionSlug, collectionIcon]
  );

  // ─── TanStack Table Instance ────────────────────────────────────────────────
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase().trim();
      if (!search) return true;
      const title = (row.original.title || "").toLowerCase();
      const slug = (row.original.slug || "").toLowerCase();
      const desc = (row.original.description || "").toLowerCase();
      const tags = (row.original.tags || []).join(" ").toLowerCase();
      return (
        title.includes(search) ||
        slug.includes(search) ||
        desc.includes(search) ||
        tags.includes(search)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  const publishedCount = items?.filter((i) => i.published).length ?? 0;
  const draftCount = items?.filter((i) => !i.published).length ?? 0;

  // ─── Actions Handlers ───────────────────────────────────────────────────────
  const handleCreateItem = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Please fill in required fields (Title & Slug)");
      return;
    }
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await createCollectionItem({
        collectionId: collection!._id,
        title: formData.title.trim(),
        slug: cleanSlug,
        description: formData.description || undefined,
        content: formData.content || undefined,
        imageUrl: formData.imageUrl || undefined,
        icon: formData.icon || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        galleryType: formData.galleryType || undefined,
        contentBlocks: formData.contentBlocks.length > 0 ? formData.contentBlocks : undefined,
        metadata: {
          duration: formData.metadata.duration || undefined,
          features: formData.metadata.features.length > 0 ? formData.metadata.features : undefined,
          client: formData.metadata.client || undefined,
          projectDate: formData.metadata.projectDate || undefined,
          technologies: formData.metadata.technologies.length > 0 ? formData.metadata.technologies : undefined,
          projectUrl: formData.metadata.projectUrl || undefined,
          role: formData.metadata.role || undefined,
          email: formData.metadata.email || undefined,
          linkedin: formData.metadata.linkedin || undefined,
          twitter: formData.metadata.twitter || undefined,
          sku: formData.metadata.sku || undefined,
          stock: formData.metadata.stock ?? undefined,
        },
        faq: formData.faq.length > 0 ? formData.faq : undefined,
        reviews: formData.reviews.length > 0 ? formData.reviews : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        ogImage: formData.ogImage || undefined,
        twitterCard: formData.twitterCard || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        published: formData.published,
        order: formData.order,
      });
      toast.success("Item created successfully");
      setIsCreateOpen(false);
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async () => {
    if (!editingItemId) return;
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Please fill in required fields (Title & Slug)");
      return;
    }
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await updateCollectionItem({
        id: editingItemId,
        title: formData.title.trim(),
        slug: cleanSlug,
        description: formData.description || undefined,
        content: formData.content || undefined,
        imageUrl: formData.imageUrl || undefined,
        icon: formData.icon || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        galleryType: formData.galleryType || undefined,
        contentBlocks: formData.contentBlocks.length > 0 ? formData.contentBlocks : undefined,
        metadata: {
          duration: formData.metadata.duration || undefined,
          features: formData.metadata.features.length > 0 ? formData.metadata.features : undefined,
          client: formData.metadata.client || undefined,
          projectDate: formData.metadata.projectDate || undefined,
          technologies: formData.metadata.technologies.length > 0 ? formData.metadata.technologies : undefined,
          projectUrl: formData.metadata.projectUrl || undefined,
          role: formData.metadata.role || undefined,
          email: formData.metadata.email || undefined,
          linkedin: formData.metadata.linkedin || undefined,
          twitter: formData.metadata.twitter || undefined,
          sku: formData.metadata.sku || undefined,
          stock: formData.metadata.stock ?? undefined,
        },
        faq: formData.faq.length > 0 ? formData.faq : undefined,
        reviews: formData.reviews.length > 0 ? formData.reviews : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        ogImage: formData.ogImage || undefined,
        twitterCard: formData.twitterCard || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        published: formData.published,
        order: formData.order,
      });
      toast.success("Item updated successfully");
      setIsEditOpen(false);
      setEditingItemId(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: Id<"collectionItems">) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    try {
      await deleteCollectionItem({ id });
      toast.success("Item deleted successfully");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleBatchDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (!selectedRows.length) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} item(s)? This action cannot be undone.`
      )
    )
      return;
    try {
      await Promise.all(
        selectedRows.map((r) => deleteCollectionItem({ id: r.original._id }))
      );
      setRowSelection({});
      toast.success(`Deleted ${selectedRows.length} item(s) successfully`);
    } catch {
      toast.error("Failed to delete selected items");
    }
  };

  const openCreateSheet = () => {
    setFormData({ ...initialFormData, icon: getIconDisplay(collectionIcon) });
    setIsCreateOpen(true);
  };

  const openEditSheet = (item: ItemRow) => {
    setEditingItemId(item._id);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      icon: getIconDisplay(item.icon),
      tags: item.tags || [],
      gallery: item.gallery || [],
      galleryType: item.galleryType || "grid",
      contentBlocks: item.contentBlocks || [],
      metadata: {
        duration: item.metadata?.duration || "",
        features: item.metadata?.features || [],
        client: item.metadata?.client || "",
        projectDate: item.metadata?.projectDate || "",
        technologies: item.metadata?.technologies || [],
        projectUrl: item.metadata?.projectUrl || "",
        role: item.metadata?.role || "",
        email: item.metadata?.email || "",
        linkedin: item.metadata?.linkedin || "",
        twitter: item.metadata?.twitter || "",
        sku: item.metadata?.sku || "",
        stock: item.metadata?.stock ?? 0,
        expertise: Array.isArray(item.metadata?.expertise) ? item.metadata.expertise : [item.metadata?.expertise || ""],
        achievements: item.metadata?.achievements || [],
      },
      faq: item.faq || [],
      reviews: item.reviews || [],
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      ogImage: item.ogImage || "",
      twitterCard: item.twitterCard || "summary_large_image",
      canonicalUrl: item.canonicalUrl || "",
      robots: item.robots || "index, follow",
      published: item.published ?? false,
      order: item.order ?? 0,
    });
    setIsEditOpen(true);
  };

  if (!collection) {
    return (
      <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading collection items...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-2">
            <Link href="/admin/collections">
              <Button variant="ghost" size="sm" className="mb-1 -ml-2 text-muted-foreground hover:text-foreground gap-1.5">
                <ArrowLeft className="size-4" />
                Back to Collections
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-xs shrink-0">
                {getIconDisplay(collection.icon)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {collection.name}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                  /collections/{collection.slug}/ &bull; {items?.length ?? 0} item{items?.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            {items && items.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {publishedCount} Published
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 rounded-full px-2.5 py-1">
                  {draftCount} Draft{draftCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/collections/${collection.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-medium">
                <ExternalLink className="size-3.5" />
                <span>View Public</span>
              </Button>
            </Link>
            <Button onClick={openCreateSheet} size="sm" className="rounded-xl gap-2 font-semibold shadow-xs">
              <Plus className="size-4" />
              <span>Add Item</span>
            </Button>
          </div>
        </div>

        {/* Toolbar - Exactly follows UsersDataTable pattern */}
        {items && items.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by title, slug, tags..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Status filter Select */}
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  if (val) setStatusFilter(val as "all" | "published" | "draft");
                }}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Column visibility dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    role="button"
                    className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer h-9 text-muted-foreground hover:text-foreground transition-colors"
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

              {/* Batch Delete when rows selected */}
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                  className="h-9 gap-1.5 animate-in fade-in-50"
                >
                  <Trash2 className="size-4" />
                  Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
            </div>

            {/* Total Filtered Count */}
            <div className="text-xs text-muted-foreground font-mono bg-muted/40 border border-border px-2.5 py-1.5 rounded-lg">
              {table.getFilteredRowModel().rows.length} item{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Table & Empty States */}
        {!items ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4 border border-primary/20">
              {getIconDisplay(collection.icon)}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No items in {collection.name} yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Create your first item to build out this collection with rich text, metadata, images, and SEO settings.
            </p>
            <Button onClick={openCreateSheet} className="rounded-xl gap-2 font-semibold">
              <Plus className="size-4" />
              <span>Add First Item</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table wrapper matching UsersDataTable */}
            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup: any) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header: any) => (
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
                    table.getRowModel().rows.map((row: any) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell: any) => (
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
                        className="h-24 text-center text-muted-foreground"
                      >
                        No items match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination footer matching UsersDataTable */}
            <div className="flex items-center justify-between py-2">
              <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="flex items-center space-x-2">
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
          </div>
        )}
      </div>

      {/* CREATE ITEM SLIDE-OUT SHEET */}
      <ItemFormSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        collectionName={collectionName}
        collectionSlug={collectionSlug}
        collectionIcon={collectionIcon}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateItem}
        isSubmitting={isSubmitting}
      />

      {/* EDIT ITEM SLIDE-OUT SHEET */}
      <ItemFormSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        collectionName={collectionName}
        collectionSlug={collectionSlug}
        collectionIcon={collectionIcon}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditItem}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function AdminCollectionItems() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
          <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading items...</span>
        </div>
      }
    >
      <AdminCollectionItemsContent />
    </Suspense>
  );
}