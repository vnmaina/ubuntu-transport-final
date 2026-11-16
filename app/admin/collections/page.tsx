"use client";

import { useState, Suspense, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  buildCollectionJsonLd,
  parseManualStructuredData,
  serializeJsonLd,
  stripHtml,
  suggestCollectionSeo,
} from "@/lib/seo";
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
  Trash2,
  Edit,
  Plus,
  FolderOpen,
  Globe,
  Search,
  Sparkles,
  Loader2,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  LayoutGrid,
  ExternalLink,
  Filter,
  ClipboardList,
  Braces,
  Wand2,
  Tags,
  MapPin,
  Link2,
  X,
} from "lucide-react";
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

type SortingState = Array<{
  id: string;
  desc: boolean;
}>;

const QUICK_COLLECTION_ICONS = ["📦", "💼", "🚀", "👥", "🛍️", "📝", "💡", "🎨", "🛡️", "⚡", "⭐", "🏆"];

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
  // If it's already an emoji (single character or emoji), return as is
  if (icon.length > 1 && !/^[a-zA-Z]+$/.test(icon)) return icon;
  // Otherwise, map text name to emoji
  return ICON_NAME_TO_EMOJI[icon] || "📦";
}

const initialFormData = {
  name: "",
  slug: "",
  description: "",
  summary: "",
  icon: "📦",
  cardLayout: "grid" as "grid" | "list" | "masonry",
  cardColumns: 3,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  areasServed: "",
  ogImage: "",
  ogTitle: "",
  ogDescription: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  canonicalUrl: "",
  robots: "index, follow",
  jsonLd: "",
  internalLinks: [] as Array<{ title: string; url: string }>,
  externalLinks: [] as Array<{ title: string; url: string }>,
  published: false,
};

const cleanLinks = (links: Array<{ title: string; url: string }>) =>
  links
    .map((l) => ({ title: l.title.trim() || l.url.trim(), url: l.url.trim() }))
    .filter((l) => l.url.length > 0);

const toList = (value: string) =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

type CollectionRow = {
  _id: Id<"collections">;
  name: string;
  slug: string;
  description?: string;
  summary?: string;
  icon?: string;
  cardLayout?: string;
  cardColumns?: number;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  areasServed?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  jsonLd?: string;
  internalLinks?: Array<{ title: string; url: string }>;
  externalLinks?: Array<{ title: string; url: string }>;
};

function SortButton({
  column,
  children,
}: {
  column: {
    getIsSorted?: () => "asc" | "desc" | false;
    toggleSorting?: (desc?: boolean) => void;
  };
  children: React.ReactNode;
}) {
  const sorted = column.getIsSorted?.();
  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors font-medium group"
      onClick={() => column.toggleSorting?.()}
    >
      {children}
      <span className="ml-1 text-muted-foreground group-hover:text-primary transition-colors">
        {sorted === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : sorted === "desc" ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-50" />
        )}
      </span>
    </button>
  );
}

function AdminCollectionsContent() {
  const router = useRouter();
  const collections = useQuery(api.collections.listCollections);
  const organization = useQuery(api.organization.getOrganization);
  const createCollection = useMutation(api.collections.createCollection);
  const updateCollection = useMutation(api.collections.updateCollection);
  const deleteCollection = useMutation(api.collections.deleteCollection);
  const initializeDefaultCollections = useMutation(api.collections.initializeDefaultCollections);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<Id<"collections"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [formData, setFormData] = useState(initialFormData);

  const handleNameChange = (val: string, mode: "create" | "edit") => {
    if (mode === "create" && !isManualSlug) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, name: val, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleInitializeDefaults = async () => {
    try {
      await initializeDefaultCollections();
      toast.success("Default collections initialized successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initialize collections");
    }
  };

  const handleCreateCollection = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Please fill in required fields (Name & Slug)");
      return;
    }
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await createCollection({
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description || undefined,
        summary: formData.summary || undefined,
        icon: formData.icon || undefined,
        cardLayout: formData.cardLayout,
        cardColumns: formData.cardColumns,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: toList(formData.keywords).length > 0 ? toList(formData.keywords) : undefined,
        areasServed: toList(formData.areasServed).length > 0 ? toList(formData.areasServed) : undefined,
        ogImage: formData.ogImage || undefined,
        ogTitle: formData.ogTitle || undefined,
        ogDescription: formData.ogDescription || undefined,
        twitterCard: formData.twitterCard || undefined,
        twitterTitle: formData.twitterTitle || undefined,
        twitterDescription: formData.twitterDescription || undefined,
        twitterImage: formData.twitterImage || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        jsonLd: formData.jsonLd || undefined,
        internalLinks: cleanLinks(formData.internalLinks),
        externalLinks: cleanLinks(formData.externalLinks),
        published: formData.published,
      });
      toast.success("Collection created successfully");
      setIsCreateOpen(false);
      setFormData(initialFormData);
      setIsManualSlug(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCollection = async () => {
    if (!editingCollectionId) return;
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Please fill in required fields (Name & Slug)");
      return;
    }
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await updateCollection({
        id: editingCollectionId,
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description || undefined,
        summary: formData.summary || undefined,
        icon: formData.icon || undefined,
        cardLayout: formData.cardLayout,
        cardColumns: formData.cardColumns,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: toList(formData.keywords).length > 0 ? toList(formData.keywords) : undefined,
        areasServed: toList(formData.areasServed).length > 0 ? toList(formData.areasServed) : undefined,
        ogImage: formData.ogImage || undefined,
        ogTitle: formData.ogTitle || undefined,
        ogDescription: formData.ogDescription || undefined,
        twitterCard: formData.twitterCard || undefined,
        twitterTitle: formData.twitterTitle || undefined,
        twitterDescription: formData.twitterDescription || undefined,
        twitterImage: formData.twitterImage || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        jsonLd: formData.jsonLd || undefined,
        internalLinks: cleanLinks(formData.internalLinks),
        externalLinks: cleanLinks(formData.externalLinks),
        published: formData.published,
      });
      toast.success("Collection updated successfully");
      setIsEditOpen(false);
      setEditingCollectionId(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id: Id<"collections">) => {
    if (
      !confirm(
        "Are you sure you want to delete this collection? All items in this collection will also be permanently deleted."
      )
    )
      return;
    try {
      await deleteCollection({ id });
      toast.success("Collection deleted successfully");
    } catch {
      toast.error("Failed to delete collection");
    }
  };

  const openCreateSheet = () => {
    setFormData({ ...initialFormData, icon: getIconDisplay(initialFormData.icon) });
    setIsManualSlug(false);
    setIsCreateOpen(true);
  };

  const openEditSheet = (col: CollectionRow) => {
    setEditingCollectionId(col._id);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      summary: col.summary || "",
      icon: getIconDisplay(col.icon),
      cardLayout: (col.cardLayout as "grid" | "list" | "masonry") || "grid",
      cardColumns: col.cardColumns || 3,
      metaTitle: col.metaTitle || "",
      metaDescription: col.metaDescription || "",
      keywords: (col.keywords || []).join(", "),
      areasServed: (col.areasServed || []).join(", "),
      ogImage: col.ogImage || "",
      ogTitle: col.ogTitle || "",
      ogDescription: col.ogDescription || "",
      twitterCard: col.twitterCard || "summary_large_image",
      twitterTitle: col.twitterTitle || "",
      twitterDescription: col.twitterDescription || "",
      twitterImage: col.twitterImage || "",
      canonicalUrl: col.canonicalUrl || "",
      robots: col.robots || "index, follow",
      jsonLd: col.jsonLd || "",
      internalLinks: col.internalLinks || [],
      externalLinks: col.externalLinks || [],
      published: col.published || false,
    });
    setIsManualSlug(true);
    setIsEditOpen(true);
  };

  // Filter data
  const filteredData = useMemo(() => {
    if (!collections) return [];
    let data = collections as CollectionRow[];
    if (statusFilter === "published") data = data.filter((c) => c.published);
    if (statusFilter === "draft") data = data.filter((c) => !c.published);
    return data;
  }, [collections, statusFilter]);

  const columns: ColumnDef<CollectionRow>[] = useMemo(
    () => [
      {
        id: "icon_name",
        accessorKey: "name",
        header: ({ column }) => <SortButton column={column}>Collection</SortButton>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {getIconDisplay(row.original.icon)}
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-foreground text-sm truncate">{row.original.name}</div>
              <div className="text-xs font-mono text-muted-foreground truncate">/collections/{row.original.slug}</div>
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
            {row.original.description
              ? stripHtml(row.original.description)
              : <span className="italic">No description</span>}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "layout",
        accessorKey: "cardLayout",
        header: ({ column }) => <SortButton column={column}>Layout</SortButton>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs capitalize font-medium">{row.original.cardLayout || "grid"}</span>
            <span className="text-xs text-muted-foreground">· {row.original.cardColumns || 3} cols</span>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "status",
        accessorKey: "published",
        header: ({ column }) => <SortButton column={column}>Status</SortButton>,
        cell: ({ row }) => (
          <Badge
            variant={row.original.published ? "default" : "secondary"}
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {row.original.published ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Published
              </span>
            ) : (
              "Draft"
            )}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => router.push(`/admin/collections/${row.original.slug}/items`)}
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 hover:bg-primary/10 hover:text-primary"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Items
            </Button>
            <Button
              onClick={() => openEditSheet(row.original)}
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button
              onClick={() => window.open(`/collections/${row.original.slug}`, "_blank")}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => handleDeleteCollection(row.original._id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (!collections) {
    return (
      <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading collections...</span>
      </div>
    );
  }

  const seoTitle = formData.metaTitle.trim() || formData.name || "Collection Title";
  const seoDesc =
    formData.metaDescription.trim() ||
    formData.summary.trim() ||
    stripHtml(formData.description).slice(0, 160) ||
    "Explore our complete list of items in this collection.";
  const displayUrl = `https://yourdomain.com/collections/${formData.slug || "collection-slug"}`;

  // Auto-generate SEO fields from basic info (name, description, keywords, areas served)
  const handleAutoGenerateSeo = () => {
    const suggestion = suggestCollectionSeo({
      name: formData.name,
      description: formData.description,
      summary: formData.summary,
      keywords: toList(formData.keywords),
      areasServed: toList(formData.areasServed),
      orgName: organization?.name,
    });
    setFormData((prev) => ({
      ...prev,
      metaTitle: suggestion.metaTitle || prev.metaTitle,
      metaDescription: suggestion.metaDescription || prev.metaDescription,
      ogTitle: suggestion.metaTitle || prev.ogTitle,
      ogDescription: suggestion.metaDescription || prev.ogDescription,
      twitterTitle: suggestion.metaTitle || prev.twitterTitle,
      twitterDescription: suggestion.metaDescription || prev.twitterDescription,
    }));
    toast.success("SEO fields auto-generated from basic info");
  };

  // JSON-LD: manual validation + live preview of auto-generated schema
  const manualJsonLd = parseManualStructuredData(formData.jsonLd);
  const manualJsonLdInvalid = formData.jsonLd.trim() !== "" && manualJsonLd === null;
  const siteUrlPreview =
    typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const autoJsonLdPreview = buildCollectionJsonLd(
    {
      name: formData.name || "Collection Name",
      slug: formData.slug || "collection-slug",
      description: formData.description,
      summary: formData.summary,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      keywords: toList(formData.keywords),
      areasServed: toList(formData.areasServed),
      ogImage: formData.ogImage,
      canonicalUrl: formData.canonicalUrl,
    },
    organization,
    siteUrlPreview
  );

  // Generate editable JSON-LD from basic info (fills the manual field)
  const handleGenerateJsonLd = () => {
    const generated = serializeJsonLd({
      "@context": "https://schema.org",
      "@graph": autoJsonLdPreview,
    });
    setFormData((prev) => ({ ...prev, jsonLd: generated }));
    toast.success("JSON-LD generated from basic info — review and save");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Content Collections</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Organize structured content — services, projects, team, products, and more.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleInitializeDefaults}
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 font-medium"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Initialize Collections</span>
            </Button>
            <Button onClick={openCreateSheet} size="sm" className="rounded-xl gap-2 font-semibold shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </Button>
          </div>
        </div>

        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search collections..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 h-9 rounded-xl text-sm bg-muted/30 border-border/60 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex rounded-xl border border-border overflow-hidden text-xs font-medium">
              {(["all", "published", "draft"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-colors ${
                    statusFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded-lg">
              {table.getRowModel().rows.length} result{table.getRowModel().rows.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Collections Table */}
        {collections.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl mb-4 border border-primary/20">
              📦
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No collections yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Create your first collection or initialize the default sets (Services, Team, Projects, Products).
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleInitializeDefaults} variant="outline" className="rounded-xl font-medium">
                Initialize Collections
              </Button>
              <Button onClick={openCreateSheet} className="rounded-xl gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                <span>Create Collection</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30 border-b-2 border-border">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4"
                      >
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
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground text-sm">
                      No collections match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0"
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
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* RIGHT-SIDE CREATE / EDIT SHEET */}
      <Sheet
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
            setEditingCollectionId(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl focus:outline-none !w-full sm:!max-w-none md:!w-1/2 md:!max-w-[50%]"
        >
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-card shrink-0 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0 border border-primary/20">
                {getIconDisplay(formData.icon)}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl font-bold truncate text-foreground">
                  {isCreateOpen ? "Create New Collection" : `Edit Collection`}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground truncate">
                  {isCreateOpen
                    ? "Organize content groups, display layouts, and SEO tags"
                    : `Configure settings for /collections/${formData.slug}`}
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 mr-8">
              <Badge variant={formData.published ? "default" : "secondary"} className="text-xs px-2.5 py-0.5 font-medium">
                {formData.published ? "Published" : "Draft"}
              </Badge>
            </div>
          </SheetHeader>

          {/* Form Tabs */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/80 p-1 rounded-xl mb-6 border border-border/50">
                <TabsTrigger
                  value="basic"
                  className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4" /> Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
                >
                  <Search className="w-4 h-4" /> SEO &amp; Social
                </TabsTrigger>
                <TabsTrigger
                  value="jsonld"
                  className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer"
                >
                  <Braces className="w-4 h-4" /> JSON-LD
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: BASIC INFO */}
              <TabsContent value="basic" className="space-y-6">
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="col-name" className="text-sm font-bold text-foreground">
                      Collection Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="col-name"
                      placeholder="e.g., Services, Portfolio, Executive Team"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value, isCreateOpen ? "create" : "edit")}
                      className="h-11 text-base rounded-xl font-medium"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">The display title shown in navigation and headers.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="col-slug" className="text-sm font-bold text-foreground">
                      URL Slug <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-stretch rounded-xl border border-input bg-muted/20 focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all">
                      <div className="flex items-center px-3.5 bg-muted/50 border-r border-border text-xs font-mono text-muted-foreground select-none shrink-0">
                        /collections/
                      </div>
                      <Input
                        id="col-slug"
                        placeholder="services"
                        value={formData.slug}
                        onChange={(e) => {
                          setIsManualSlug(true);
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                          }));
                        }}
                        className="border-0 shadow-none focus-visible:ring-0 rounded-none bg-transparent font-mono text-sm h-11 px-3 flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Public path: <code className="text-primary font-mono font-semibold">/collections/{formData.slug || "slug"}</code>
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <Label htmlFor="col-icon" className="text-sm font-semibold text-foreground">
                      Collection Icon
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl shrink-0">
                        {getIconDisplay(formData.icon)}
                      </div>
                      <Input
                        id="col-icon"
                        placeholder="Icon name or emoji"
                        value={formData.icon}
                        onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                        className="h-10 text-base rounded-xl flex-1"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COLLECTION_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                            formData.icon === icon
                              ? "bg-primary text-primary-foreground scale-110 shadow-xs ring-2 ring-primary"
                              : "bg-muted/60 hover:bg-muted text-foreground hover:scale-105"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="col-desc" className="text-sm font-semibold text-foreground">
                      Description / Overview
                    </Label>
                    <div className="border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                      <RichTextEditor
                        content={formData.description}
                        onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                        placeholder="Describe this collection — supports headings, lists, links, and formatting..."
                        minHeight="160px"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rendered as rich text on the public page and used to auto-generate SEO fields.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="col-summary" className="text-sm font-semibold text-foreground">
                      Summary
                    </Label>
                    <Input
                      id="col-summary"
                      placeholder="One-line summary used on cards and as meta description fallback..."
                      value={formData.summary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                      className="h-10 text-sm rounded-xl"
                      maxLength={160}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Short plain-text excerpt — preferred for collection cards and the meta description fallback ({formData.summary.length}/160).
                    </p>
                  </div>

                  {/* Keywords & Areas Served — feed meta keywords + JSON-LD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="col-keywords" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Tags className="w-3.5 h-3.5 text-primary" /> Keywords
                      </Label>
                      <Input
                        id="col-keywords"
                        placeholder="tours, safari, transport, Nairobi"
                        value={formData.keywords}
                        onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
                        className="h-10 text-sm rounded-xl"
                      />
                      <p className="text-[11px] text-muted-foreground">Comma-separated. Used in meta keywords and structured data.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="col-areas" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Areas Served
                      </Label>
                      <Input
                        id="col-areas"
                        placeholder="Nairobi, Kenya, East Africa"
                        value={formData.areasServed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, areasServed: e.target.value }))}
                        className="h-10 text-sm rounded-xl"
                      />
                      <p className="text-[11px] text-muted-foreground">Comma-separated regions emitted as areaServed in JSON-LD.</p>
                    </div>
                  </div>
                </div>

                {/* Useful Links — internal pages & external resources */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-primary" /> Useful Links
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Helpful resources shown on the public collection page — internal pages and external references.
                    </p>
                  </div>

                  {/* Internal Links */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-primary" /> Internal Links
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Links to other pages on this site (e.g. /services, /fleet).</p>
                    <div className="space-y-2">
                      {formData.internalLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Link title"
                            value={link.title}
                            onChange={(e) => {
                              const next = [...formData.internalLinks];
                              next[index] = { ...next[index], title: e.target.value };
                              setFormData((prev) => ({ ...prev, internalLinks: next }));
                            }}
                            className="h-9 text-sm rounded-xl w-2/5"
                          />
                          <Input
                            placeholder="/collections/other or https://..."
                            value={link.url}
                            onChange={(e) => {
                              const next = [...formData.internalLinks];
                              next[index] = { ...next[index], url: e.target.value };
                              setFormData((prev) => ({ ...prev, internalLinks: next }));
                            }}
                            className="h-9 text-sm rounded-xl flex-1 font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                internalLinks: prev.internalLinks.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 rounded-lg text-xs gap-1.5"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            internalLinks: [...prev.internalLinks, { title: "", url: "" }],
                          }))
                        }
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Internal Link
                      </Button>
                    </div>
                  </div>

                  {/* External Resources */}
                  <div className="space-y-3 border-t border-border/60 pt-4">
                    <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-primary" /> External Resources
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Links to external websites (partners, regulators, documentation).</p>
                    <div className="space-y-2">
                      {formData.externalLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Resource title"
                            value={link.title}
                            onChange={(e) => {
                              const next = [...formData.externalLinks];
                              next[index] = { ...next[index], title: e.target.value };
                              setFormData((prev) => ({ ...prev, externalLinks: next }));
                            }}
                            className="h-9 text-sm rounded-xl w-2/5"
                          />
                          <Input
                            placeholder="https://example.com"
                            value={link.url}
                            onChange={(e) => {
                              const next = [...formData.externalLinks];
                              next[index] = { ...next[index], url: e.target.value };
                              setFormData((prev) => ({ ...prev, externalLinks: next }));
                            }}
                            className="h-9 text-sm rounded-xl flex-1 font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                externalLinks: prev.externalLinks.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 rounded-lg text-xs gap-1.5"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            externalLinks: [...prev.externalLinks, { title: "", url: "" }],
                          }))
                        }
                      >
                        <Plus className="w-3.5 h-3.5" /> Add External Resource
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Card Layout Settings */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Display &amp; Card Layout
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="col-layout" className="text-xs font-semibold text-foreground">
                        Card Layout Style
                      </Label>
                      <Select
                        value={formData.cardLayout}
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, cardLayout: (val ?? "grid") as "grid" | "list" | "masonry" }))}
                      >
                        <SelectTrigger id="col-layout" className="h-10 rounded-xl">
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid Layout</SelectItem>
                          <SelectItem value="list">List View</SelectItem>
                          <SelectItem value="masonry">Masonry Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="col-cols" className="text-xs font-semibold text-foreground">
                        Columns (Desktop)
                      </Label>
                      <Select
                        value={String(formData.cardColumns)}
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, cardColumns: parseInt(val ?? "3") || 3 }))}
                      >
                        <SelectTrigger id="col-cols" className="h-10 rounded-xl">
                          <SelectValue placeholder="Select column count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column (Full Width)</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns (Standard)</SelectItem>
                          <SelectItem value="4">4 Columns (Compact)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: SEO & SOCIAL */}
              <TabsContent value="seo" className="space-y-6">
                {/* Google Preview */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-primary" /> Google SERP Preview
                    </span>
                    <span className="text-[11px] text-muted-foreground">Live Simulation</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border/80 bg-background/80 space-y-1.5 font-sans">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground truncate font-mono">
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="truncate">{displayUrl}</span>
                    </div>
                    <h5 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                      {seoTitle}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{seoDesc}</p>
                  </div>
                </div>

                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                  {/* Auto-generate banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-2.5 text-xs text-primary">
                      <Wand2 className="w-4 h-4 shrink-0" />
                      <span>Auto-generate title, description, and social tags from Basic Info (name, description, keywords, areas served).</span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAutoGenerateSeo}
                      className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Auto-Generate
                    </Button>
                  </div>

                  {/* Meta Title & Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="col-metaTitle" className="text-xs font-semibold text-foreground">
                        Meta Title
                      </Label>
                      <span className={`text-[11px] font-mono ${formData.metaTitle.length > 60 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                        {formData.metaTitle.length}/60 chars
                      </span>
                    </div>
                    <Input
                      id="col-metaTitle"
                      placeholder="Defaults to Collection Name if blank..."
                      value={formData.metaTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      className="h-10 text-sm rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="col-metaDesc" className="text-xs font-semibold text-foreground">
                        Meta Description
                      </Label>
                      <span className={`text-[11px] font-mono ${formData.metaDescription.length > 160 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                        {formData.metaDescription.length}/160 chars
                      </span>
                    </div>
                    <Textarea
                      id="col-metaDesc"
                      placeholder="1–2 sentence search summary..."
                      value={formData.metaDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                      rows={3}
                      className="text-sm rounded-xl resize-none"
                    />
                  </div>

                  {formData.keywords.trim() && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Meta Keywords</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {toList(formData.keywords).map((kw) => (
                          <Badge key={kw} variant="secondary" className="text-[11px] px-2 py-0.5 rounded-md font-medium">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Managed under Basic Info — rendered as a keywords meta tag and in JSON-LD.</p>
                    </div>
                  )}

                  {/* Open Graph */}
                  <div className="space-y-3 border-t border-border/60 pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Open Graph (Social Sharing)</h4>
                    <div className="space-y-2">
                      <ImageUpload
                        value={formData.ogImage}
                        onChange={(value) => setFormData((prev) => ({ ...prev, ogImage: value }))}
                        label="OG Image"
                        placeholder="https://example.com/banner.jpg (1200x630px recommended)"
                        aspectRatio="video"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="col-ogTitle" className="text-xs font-semibold text-foreground">OG Title</Label>
                        <Input
                          id="col-ogTitle"
                          placeholder="Defaults to meta title"
                          value={formData.ogTitle}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ogTitle: e.target.value }))}
                          className="h-10 text-sm rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="col-ogDesc" className="text-xs font-semibold text-foreground">OG Description</Label>
                        <Input
                          id="col-ogDesc"
                          placeholder="Defaults to meta description"
                          value={formData.ogDescription}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ogDescription: e.target.value }))}
                          className="h-10 text-sm rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div className="space-y-3 border-t border-border/60 pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">X (Twitter) Card</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="col-twitter" className="text-xs font-semibold text-foreground">Card Type</Label>
                        <Select
                          value={formData.twitterCard}
                          onValueChange={(val) => setFormData((prev) => ({ ...prev, twitterCard: val ?? "summary_large_image" }))}
                        >
                          <SelectTrigger id="col-twitter" className="h-10 rounded-xl">
                            <SelectValue placeholder="Card format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summary">Summary Card</SelectItem>
                            <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="col-robots" className="text-xs font-semibold text-foreground">Robots Directive</Label>
                        <Input
                          id="col-robots"
                          placeholder="index, follow"
                          value={formData.robots}
                          onChange={(e) => setFormData((prev) => ({ ...prev, robots: e.target.value }))}
                          className="h-10 text-sm rounded-xl font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="col-twitterTitle" className="text-xs font-semibold text-foreground">Twitter Title</Label>
                        <Input
                          id="col-twitterTitle"
                          placeholder="Defaults to meta title"
                          value={formData.twitterTitle}
                          onChange={(e) => setFormData((prev) => ({ ...prev, twitterTitle: e.target.value }))}
                          className="h-10 text-sm rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="col-twitterDesc" className="text-xs font-semibold text-foreground">Twitter Description</Label>
                        <Input
                          id="col-twitterDesc"
                          placeholder="Defaults to meta description"
                          value={formData.twitterDescription}
                          onChange={(e) => setFormData((prev) => ({ ...prev, twitterDescription: e.target.value }))}
                          className="h-10 text-sm rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <ImageUpload
                        value={formData.twitterImage}
                        onChange={(value) => setFormData((prev) => ({ ...prev, twitterImage: value }))}
                        label="Twitter Image (optional)"
                        placeholder="https://example.com/twitter-image.jpg"
                        aspectRatio="video"
                      />
                    </div>
                  </div>

                  {/* Canonical */}
                  <div className="space-y-2 border-t border-border/60 pt-4">
                    <Label htmlFor="col-canon" className="text-xs font-semibold text-foreground">Canonical URL</Label>
                    <Input
                      id="col-canon"
                      placeholder="https://yourdomain.com/collections/services"
                      value={formData.canonicalUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                      className="h-10 text-sm rounded-xl font-mono"
                    />
                    <p className="text-[11px] text-muted-foreground">Leave blank to auto-generate from the collection slug.</p>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: JSON-LD */}
              <TabsContent value="jsonld" className="space-y-6">
                {/* Auto-generated schema explanation + preview */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Braces className="w-4 h-4 text-primary" /> Auto-Generated Structured Data
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Every published collection automatically renders <strong>CollectionPage</strong>,{" "}
                      <strong>BreadcrumbList</strong>, and an <strong>ItemList</strong> of its published items on the
                      frontend — built live from the Basic Info and SEO fields above. Site-wide{" "}
                      <strong>Organization</strong> and <strong>WebSite</strong> schema is emitted by the root layout.
                    </p>
                  </div>
                  <details className="rounded-xl border border-border/80 bg-muted/30">
                    <summary className="cursor-pointer px-4 py-2.5 text-xs font-semibold text-foreground">
                      Preview auto-generated JSON-LD for this collection
                    </summary>
                    <pre className="max-h-72 overflow-auto border-t border-border/60 p-4 text-[10px] leading-relaxed text-muted-foreground whitespace-pre-wrap break-all font-mono">
                      {JSON.stringify(autoJsonLdPreview, null, 2)}
                    </pre>
                  </details>
                </div>

                {/* Manual JSON-LD */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">Manual JSON-LD (optional)</h4>
                      <p className="text-xs text-muted-foreground">
                        Add any extra schema not covered automatically — FAQPage, Service, Product, Event, etc.
                        Accepts a single JSON object or an array of objects. Rendered in addition to the auto-generated schema.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleGenerateJsonLd}
                      className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Generate from Basic Info
                    </Button>
                  </div>
                  <Textarea
                    id="col-jsonLd"
                    placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [...]\n}`}
                    value={formData.jsonLd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jsonLd: e.target.value }))}
                    rows={12}
                    className="font-mono text-xs rounded-xl resize-none bg-muted/20"
                  />
                  {formData.jsonLd.trim() !== "" && (
                    <p className={`text-[11px] font-medium ${manualJsonLdInvalid ? "text-destructive" : "text-emerald-600"}`}>
                      {manualJsonLdInvalid
                        ? "Invalid JSON — must be a valid JSON object or array of objects. It will be ignored on the frontend."
                        : `Valid JSON-LD — ${manualJsonLd?.length ?? 0} block(s) will be rendered.`}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Validate at{" "}
                    <a
                      href="https://validator.schema.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline font-medium"
                    >
                      validator.schema.org
                    </a>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Footer */}
          <SheetFooter className="px-8 py-5 border-t bg-card/95 backdrop-blur shrink-0 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="col-sheet-pub-switch"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="col-sheet-pub-switch" className="text-xs font-semibold cursor-pointer select-none">
                {formData.published ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Published
                  </span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> Draft Mode
                  </span>
                )}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                }}
                disabled={isSubmitting}
                className="h-10 px-4 rounded-xl font-medium"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={isCreateOpen ? handleCreateCollection : handleEditCollection}
                disabled={isSubmitting || !formData.name.trim() || !formData.slug.trim()}
                className="h-10 px-6 rounded-xl font-semibold gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : isCreateOpen ? (
                  <>
                    <Plus className="w-4 h-4" /> Create Collection
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function AdminCollections() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading collections...</span>
        </div>
      }
    >
      <AdminCollectionsContent />
    </Suspense>
  );
}