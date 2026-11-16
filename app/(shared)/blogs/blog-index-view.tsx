"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Clock,
  Tag,
  FileText,
  X,
  ArrowRight,
  ChevronRight,
  Phone,
  MessageCircle,
  Car,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

interface BlogIndexViewProps {
  posts: Doc<"blogPosts">[];
  categories: Doc<"blogCategories">[];
}

export function BlogIndexView({ posts, categories }: BlogIndexViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "readTime">("latest");

  const categoryMap = useMemo(() => {
    const map = new Map<string, Doc<"blogCategories">>();
    categories.forEach((c) => map.set(c.slug, c));
    return map;
  }, [categories]);

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let data = [...posts];
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      data = data.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((t) => t.toLowerCase().includes(query)) ||
          categoryMap.get(post.category)?.name.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "all") {
      data = data.filter((post) => post.category === categoryFilter);
    }

    // Sort order
    if (sortBy === "readTime") {
      data.sort((a, b) => {
        const getMinutes = (rt?: string) => {
          if (!rt) return 0;
          const match = rt.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getMinutes(b.readTime) - getMinutes(a.readTime);
      });
    } else {
      data.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    }

    return data;
  }, [posts, searchQuery, categoryFilter, sortBy, categoryMap]);

  const hasFilters = searchQuery !== "" || categoryFilter !== "all";

  // When no filters are active and posts are available, post[0] is the Featured Spotlight
  const featuredPost = !hasFilters && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = !hasFilters && featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const whatsappInquiryUrl = `https://wa.me/254728798589?text=${encodeURIComponent(
    "Hello Ubuntu Transport, I am browsing your blog and would like to inquire about Kenya safari and transport services."
  )}`;

  return (
    <div className="bg-background min-h-screen">
      {/* ── Editorial Hero Header ───────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-8 border-b border-border/50">
       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">Blog</span>
          </nav>

          {/* Badge & Title */}
          <div className="max-w-5xl">
           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12] font-heading">
              Travel Guides & Safari Insights
            </h1>

            <p className="text-md text-muted-foreground/90 font-normal mt-4">
              Expert advice on 4x4 safaris, airport transfers, Kenya wildlife reserves, and seamless East Africa transport solutions from the Ubuntu Logistics team.
            </p>

           
          </div>
        </div>
      </section>

    

      {/* ── Search, Filters & Article Grid ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 ">
        {/* Controls Container */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, destination, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 h-11 rounded-2xl bg-card border-border/80 focus:border-primary text-sm shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortBy(sortBy === "latest" ? "readTime" : "latest")}
                className="h-11 px-4 rounded-2xl border border-border/80 bg-card hover:border-primary/50 text-xs font-semibold text-foreground inline-flex items-center gap-2 transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Sort: {sortBy === "latest" ? "Newest First" : "In-Depth Reads"}</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer",
                categoryFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                  : "bg-card text-muted-foreground border border-border/80 hover:border-primary/40 hover:text-foreground"
              )}
            >
              <span>All Guides</span>
              <span className="text-[10px] opacity-75 font-normal">({posts.length})</span>
            </button>

            {categories.map((cat) => {
              const count = posts.filter((p) => p.category === cat.slug).length;
              const isActive = categoryFilter === cat.slug;

              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                      : "bg-card text-muted-foreground border border-border/80 hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter / Filter status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 pb-2 border-b border-border/50">
          <p>
            Showing <strong className="text-foreground">{filteredPosts.length}</strong> guide
            {filteredPosts.length !== 1 ? "s" : ""}
            {hasFilters && " matching your criteria"}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="text-secondary hover:underline font-semibold flex items-center gap-1"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* ── Articles Grid ─────────────────────────────────────── */}
        {filteredPosts.length === 0 ? (
          <div className="border border-dashed border-border/80 rounded-3xl py-20 px-4 text-center bg-card/40 my-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No matching articles found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
              We could not find any guides matching &ldquo;{searchQuery}&rdquo;. Try searching for popular topics like &ldquo;safari&rdquo;, &ldquo;airport transfer&rdquo;, or &ldquo;Masai Mara&rdquo;.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 rounded-full"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
            >
              Clear filters and view all articles
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => {
              const category = categoryMap.get(post.category);

              return (
                <Link
                  key={post._id}
                  href={`/blogs/${post.slug}`}
                  className="group rounded-3xl border border-border/80 overflow-hidden bg-card shadow-2xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail container */}
                  <div className="aspect-[16/10] w-full bg-muted/40 overflow-hidden relative">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-secondary/10">
                        <FileText className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}

                    {category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-2xs">
                        {category.icon ? `${category.icon} ` : ""}
                        {category.name}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/60">
                      {/* Author + Date/Time */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          {post.author?.avatar ? (
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              width={20}
                              height={20}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {(post.author?.name || "U").charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="line-clamp-1 max-w-[110px]">
                            {post.author?.name || "Ubuntu"}
                          </span>
                        </span>

                        {post.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-secondary" />
                            {post.readTime}
                          </span>
                        )}
                      </div>

                      {/* Footer Read Action */}
                      <div className="flex items-center justify-between pt-1">
                        {post.tags && post.tags.length > 0 ? (
                          <span className="text-[11px] text-muted-foreground/80 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-secondary/70" />
                            {post.tags[0]}
                          </span>
                        ) : (
                          <span />
                        )}

                        <span className="text-xs font-bold text-primary group-hover:text-secondary group-hover:gap-1.5 transition-all inline-flex items-center gap-1">
                          Read Story <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Commercial Kenya Safari & Transport Planning Banner ── */}
        <div className="mt-16 relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-primary/25 bg-gradient-to-br from-[#262559] via-[#1c1b47] to-[#121133] text-white shadow-xl">
          {/* Decorative glowing ambient spots */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D72533]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-[#262559]/80 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D72533] text-white shadow-sm">
                <Car className="w-3.5 h-3.5" />
                Ubuntu Fleet & Safari Logistics
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-heading">
                Ready to Experience Kenya? Travel with the Experts.
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Whether you need a rugged 4x4 Safari Land Cruiser for Masai Mara, a reliable JKIA airport transfer, or a corporate fleet for VIP guests, Ubuntu Transport guarantees comfort and punctuality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us Now
              </a>

              <a
                href="tel:+254728798589"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-[#D72533]" />
                +254 728 798589
              </a>

              <Link
                href="/collections/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white text-foreground hover:bg-white/90 transition-all shadow-sm"
              >
                View Services <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
