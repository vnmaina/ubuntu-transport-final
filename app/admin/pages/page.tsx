"use client";

import { useState, useMemo, Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  FileText,
  Eye,
  Trash2,
  Edit,
  Home,
  Copy,
  Check,
  ExternalLink,
  CopyPlus,
  MoreHorizontal,
  Search,
  Layers,
  Sparkles,
  Settings2,
  Loader2,
  Calendar,
  CheckCircle2,
  Globe,
  Briefcase,
  BookOpen,
} from "lucide-react";

type Page = {
  _id: Id<"pages">;
  title: string;
  slug: string;
  published: boolean | null;
  blocks: any[];
  _creationTime: number;
};

function formatBlockType(type: string): string {
  if (!type) return "Block";
  return type.replace(/Block$/, "");
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

function AdminPagesContent() {
  const pages = useQuery(api.pages.listAllPages);
  const createPage = useMutation(api.pages.createPage);
  const deletePage = useMutation(api.pages.deletePage);
  const setPublishStatus = useMutation(api.pages.setPublishStatus);
  const updatePage = useMutation(api.pages.updatePage);
  const duplicatePage = useMutation(api.pages.duplicatePage);
  const createBlogPage = useMutation(api.pages.createBlogPage);
  const createCareerPage = useMutation(api.pages.createCareerPage);
  const ensureHomePage = useMutation(api.pages.ensureHomePageExists);
  const getOrCreateBlogPage = useMutation(api.pages.getOrCreateBlogPage);
  const router = useRouter();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<Id<"pages"> | null>(null);

  // Create page dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Quick edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete confirm dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Auto-slug from title during creation
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setNewSlug(generated);
  };

  const handleCreatePage = async () => {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error("Please fill in both title and URL slug");
      return;
    }

    if (newSlug.trim() === "") {
      toast.error("Empty slug is reserved for the home page. Use 'Ensure Home' button.");
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const sanitizedSlug = newSlug
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const pageId = await createPage({
        title: newTitle.trim(),
        slug: sanitizedSlug,
      });

      toast.success("Page created successfully");
      setIsCreateOpen(false);
      setNewTitle("");
      setNewSlug("");
      router.push(`/admin/edit/${pageId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create page");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleQuickEditSave = async () => {
    if (!editingPage) return;
    if (!editTitle.trim()) {
      toast.error("Page title is required");
      return;
    }

    // If it's the home page, slug must stay empty
    const isHomePage = editingPage.slug === "";
    const sanitizedSlug = isHomePage
      ? ""
      : editSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    setIsSubmittingEdit(true);
    try {
      await updatePage({
        id: editingPage._id,
        title: editTitle.trim(),
        slug: sanitizedSlug,
      });
      toast.success("Page settings updated");
      setIsEditOpen(false);
      setEditingPage(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update page");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    setTogglingId(page._id);
    const newStatus = !page.published;
    try {
      await setPublishStatus({ id: page._id, published: newStatus });
      toast.success(newStatus ? `"${page.title}" published!` : `"${page.title}" set to draft.`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDuplicate = async (page: Page) => {
    try {
      const newId = await duplicatePage({ id: page._id });
      toast.success(`Duplicated "${page.title}"!`);
      router.push(`/admin/edit/${newId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to duplicate page");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    setIsSubmittingDelete(true);
    try {
      await deletePage({ id: pageToDelete._id });
      toast.success(`Deleted "${pageToDelete.title}"`);
      setIsDeleteOpen(false);
      setPageToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete page");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const handleCopyUrl = (slug: string) => {
    const path = slug === "" ? "/" : `/${slug}`;
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCreateBlog = async () => {
    try {
      const result = await getOrCreateBlogPage();
      if (result.created) {
        toast.success("Blog page template created");
      } else {
        toast.success("Blog page already exists");
      }
      router.push(`/admin/edit/${result.pageId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create blog page");
    }
  };

  const handleCreateCareer = async () => {
    try {
      const pageId = await createCareerPage();
      toast.success("Career page template created");
      router.push(`/admin/edit/${pageId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create career page");
    }
  };

  const handleEnsureHome = async () => {
    try {
      const res = await ensureHomePage();
      if (res.created) {
        toast.success("Home page created!");
      } else {
        toast.info("Home page already exists");
      }
    } catch (error) {
      toast.error("Failed to ensure home page");
    }
  };

  // Filtered pages
  const filteredPages = useMemo(() => {
    if (!pages) return [];
    return pages.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
          ? Boolean(page.published)
          : !page.published;

      return matchesSearch && matchesStatus;
    });
  }, [pages, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    if (!pages) return { total: 0, published: 0, drafts: 0, totalBlocks: 0 };
    const published = pages.filter((p) => p.published).length;
    const drafts = pages.length - published;
    const totalBlocks = pages.reduce((acc, p) => acc + (p.blocks?.length || 0), 0);
    return { total: pages.length, published, drafts, totalBlocks };
  }, [pages]);

  const hasHomePage = useMemo(() => {
    return pages?.some((p) => p.slug === "");
  }, [pages]);

  const blogPage = useMemo(() => {
    return pages?.find((p) => p.slug === "blog");
  }, [pages]);

  if (!pages) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Page Builder CMS...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Globe className="h-5 w-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Page Builder
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs ml-1">
              {stats.total} {stats.total === 1 ? "Page" : "Pages"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Manage, publish, duplicate, and design site pages with actionable table controls.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {hasHomePage ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const homePage = pages?.find((p) => p.slug === "");
                if (homePage) router.push(`/admin/edit/${homePage._id}`);
              }} 
              className="gap-1.5 rounded-xl"
            >
              <Home className="h-4 w-4 text-amber-500" />
              <span>Edit Home Page</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEnsureHome} className="gap-1.5 rounded-xl">
              <Home className="h-4 w-4 text-amber-500" />
              <span>Generate Home</span>
            </Button>
          )}

          {blogPage ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/admin/edit/${blogPage._id}`)} 
              className="gap-1.5 rounded-xl"
            >
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Edit Blog Page</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCreateBlog} 
              className="gap-1.5 rounded-xl"
            >
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Create Blog Page</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="gap-1.5 rounded-xl" />}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>More Templates</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleCreateCareer} className="cursor-pointer gap-2">
                <Briefcase className="h-4 w-4 text-emerald-500" />
                <span>Careers Page Template</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger
              render={
                <Button size="sm" className="gap-1.5 rounded-xl bg-primary shadow-sm hover:bg-primary/90 text-primary-foreground font-medium" />
              }
            >
              <Plus className="h-4 w-4" />
              <span>New Page</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl focus:outline-none"
            >
              <SheetHeader className="px-6 py-4 border-b bg-card shrink-0">
                <SheetTitle className="text-xl font-bold">Create New Page</SheetTitle>
                <SheetDescription>
                  Enter the title and path slug. You can customize layout and add visual blocks immediately after creation.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Page Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Pricing & Plans, About Us"
                      value={newTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="rounded-xl h-11 text-base font-medium"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      URL Path Slug <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border bg-muted/40 px-3 focus-within:ring-2 focus-within:ring-ring">
                      <span className="text-sm font-mono text-muted-foreground select-none">/</span>
                      <Input
                        placeholder="pricing-and-plans"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        className="border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 font-mono text-sm h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Direct route: <code className="text-primary font-mono font-semibold">/{newSlug || "slug"}</code>
                    </p>
                  </div>
                </div>
              </div>

              <SheetFooter className="px-6 py-4 border-t bg-card/95 backdrop-blur shrink-0 flex flex-row items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmittingCreate}
                  className="rounded-xl h-10 px-4 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePage}
                  disabled={isSubmittingCreate || !newTitle.trim() || !newSlug.trim()}
                  className="rounded-xl gap-2 h-10 px-6 font-semibold shadow-xs"
                >
                  {isSubmittingCreate && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create &amp; Open Editor
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Metrics / Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Pages
              </p>
              <h3 className="text-xl font-bold">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Published
              </p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.published}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Drafts
              </p>
              <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {stats.drafts}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Blocks
              </p>
              <h3 className="text-xl font-bold">{stats.totalBlocks}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-background"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border w-full sm:w-auto">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="rounded-lg text-xs h-7 px-3"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={statusFilter === "published" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("published")}
            className="rounded-lg text-xs h-7 px-3"
          >
            Published ({stats.published})
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("draft")}
            className="rounded-lg text-xs h-7 px-3"
          >
            Drafts ({stats.drafts})
          </Button>
        </div>
      </div>

      {/* Main Pages Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-3.5 pl-6">
                Page Title & Info
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-3.5">
                URL Route
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-3.5">
                Status
              </TableHead>
           
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-3.5 text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-44 text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-base font-semibold text-foreground">No pages found</p>
                    <p className="text-sm">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : "Click 'New Page' to construct your first route"}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="mt-2 rounded-xl"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page) => {
                const isHome = page.slug === "";
                const routePath = isHome ? "/" : `/${page.slug}`;
                const isToggling = togglingId === page._id;

                // Extract block summary names
                const blockNames = Array.from(
                  new Set(page.blocks?.map((b) => formatBlockType(b.type)) || [])
                );

                return (
                  <TableRow
                    key={page._id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    onClick={(e) => {
                      // Prevent navigating if clicking an interactive control
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("button") ||
                        target.closest("a") ||
                        target.closest("[role='switch']") ||
                        target.closest("[data-slot='dropdown-menu']")
                      ) {
                        return;
                      }
                      router.push(`/admin/edit/${page._id}`);
                    }}
                  >
                    {/* Column 1: Page Details */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-transform group-hover:scale-105 ${
                            isHome
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : page.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isHome ? <Home className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground hover:text-primary transition-colors text-base">
                              {page.title}
                            </span>
                            {isHome && (
                              <Badge
                                variant="secondary"
                                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300/30 text-[10px] font-semibold py-0 px-2"
                              >
                                Root Home
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {page.blocks?.length || 0}{" "}
                            {(page.blocks?.length || 0) === 1 ? "block" : "blocks"} configured
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Column 2: URL Route */}
                    <TableCell className="py-4">
                      <div className="inline-flex items-center gap-1.5 bg-muted/60 hover:bg-muted px-2.5 py-1 rounded-lg border text-xs font-mono text-foreground/80 transition-colors">
                        <span>{routePath}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(page.slug);
                          }}
                          className="text-muted-foreground hover:text-foreground p-0.5 rounded transition"
                          title="Copy Full URL"
                        >
                          {copiedSlug === page.slug ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </TableCell>

                    {/* Column 3: Status (Actionable Switch) */}
                    <TableCell className="py-4">
                      <div
                        className="flex items-center gap-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Switch
                          checked={Boolean(page.published)}
                          disabled={isToggling}
                          onCheckedChange={() => handleTogglePublish(page)}
                          aria-label={`Toggle publish for ${page.title}`}
                        />
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              page.published ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              page.published
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {page.published ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                 

                    {/* Column 6: Actionable Buttons */}
                    <TableCell className="py-4 text-right pr-6">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/edit/${page._id}`)}
                          className="h-8 gap-1 rounded-xl px-2.5 text-xs font-medium hover:border-primary/50"
                        >
                          <Edit className="h-3.5 w-3.5 text-primary" />
                          <span>Edit</span>
                        </Button>

                        {/* View Live */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(routePath, "_blank")}
                          className="h-8 px-2 rounded-xl text-muted-foreground hover:text-foreground"
                          title="Preview Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>

                        {/* More Action Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/edit/${page._id}`)}
                              className="cursor-pointer gap-2"
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                              <span>Open Block Builder</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPage(page);
                                setEditTitle(page.title);
                                setEditSlug(page.slug);
                                setIsEditOpen(true);
                              }}
                              className="cursor-pointer gap-2"
                            >
                              <Settings2 className="h-4 w-4 text-muted-foreground" />
                              <span>Rename & Slug</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDuplicate(page)}
                              className="cursor-pointer gap-2"
                            >
                              <CopyPlus className="h-4 w-4 text-indigo-500" />
                              <span>Duplicate Page</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCopyUrl(page.slug)}
                              className="cursor-pointer gap-2"
                            >
                              <Copy className="h-4 w-4 text-muted-foreground" />
                              <span>Copy Public Link</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => {
                                setPageToDelete(page);
                                setIsDeleteOpen(true);
                              }}
                              disabled={isHome}
                              variant="destructive"
                              className="cursor-pointer gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Page</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quick Edit Sheet (Title & Slug) - Slide over from right */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent
          side="right"
          className="p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl focus:outline-none"
        >
          <SheetHeader className="px-6 py-4 border-b bg-card shrink-0">
            <SheetTitle className="text-xl font-bold">Edit Page Settings</SheetTitle>
            <SheetDescription>
              Quickly update page title or route path without entering the canvas editor.
            </SheetDescription>
          </SheetHeader>

          {editingPage && (
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Page Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="rounded-xl h-11 text-base font-medium"
                    placeholder="Page Title"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    URL Slug
                  </label>
                  {editingPage.slug === "" ? (
                    <p className="text-xs font-medium text-amber-600 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      The root Home page slug is fixed to <code>/</code> and cannot be changed.
                    </p>
                  ) : (
                    <div className="flex items-center rounded-xl border bg-muted/40 px-3 focus-within:ring-2 focus-within:ring-ring">
                      <span className="text-sm font-mono text-muted-foreground select-none">/</span>
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 font-mono text-sm h-11"
                        placeholder="page-slug"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="px-6 py-4 border-t bg-card/95 backdrop-blur shrink-0 flex flex-row items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmittingEdit}
              className="rounded-xl h-10 px-4 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickEditSave}
              disabled={isSubmittingEdit || !editTitle.trim()}
              className="rounded-xl gap-2 h-10 px-6 font-semibold shadow-xs"
            >
              {isSubmittingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>Confirm Page Deletion</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">"{pageToDelete?.title}"</strong>? This will
              permanently remove the route{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                {pageToDelete?.slug === "" ? "/" : `/${pageToDelete?.slug}`}
              </code>{" "}
              and all of its blocks. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isSubmittingDelete}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmittingDelete}
              className="rounded-xl gap-2"
            >
              {isSubmittingDelete && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPages() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading Page Builder...</p>
        </div>
      }
    >
      <AdminPagesContent />
    </Suspense>
  );
}
