"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { MediaJsonLd } from "./media-seo";
import type { Doc } from "@/convex/_generated/dataModel";

export interface BlogCardsBlockProps {
  variant?: "grid" | "list" | "masonry";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  categorySlug?: string;
  limit?: number;
  columns?: 2 | 3 | 4;
  tagFilter?: string;
  showViewAll?: boolean;
  viewAllText?: string;
}

function BlogCardsSkeleton({ columns = 3 }: { columns?: 2 | 3 | 4 }) {
  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="bg-background px-4 py-16 md:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-secondary/20" />
          <div className="mx-auto h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
        </div>
        <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogCardsBlock({
  variant = "grid",
  eyebrow = "From the Blog",
  title = "Latest Articles",
  subtitle,
  categorySlug,
  limit = 6,
  columns = 3,
  tagFilter,
  showViewAll = true,
  viewAllText = "View all articles",
}: BlogCardsBlockProps) {
  const posts = useQuery(api.blog.listPublishedBlogPosts);
  const categories = useQuery(api.blog.listBlogCategories);

  if (posts === undefined || categories === undefined) {
    return <BlogCardsSkeleton columns={columns} />;
  }

  const categoryMap = new Map<string, Doc<"blogCategories">>();
  categories.forEach((c) => categoryMap.set(c.slug, c));

  let filtered = posts;
  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter((p) => p.category === categorySlug);
  }
  if (tagFilter && tagFilter.trim()) {
    const tag = tagFilter.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.tags?.some((t) => t.toLowerCase() === tag) ||
        p.title.toLowerCase().includes(tag)
    );
  }
  const visiblePosts = filtered.slice(0, limit);

  if (visiblePosts.length === 0) {
    return null;
  }

  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  const isList = variant === "list";

  return (
    <section className="bg-background px-4 py-16 md:px-8 lg:py-24">
      <MediaJsonLd
        items={visiblePosts
          .filter((p) => p.featuredImage)
          .map((p) => ({
            url: p.featuredImage as string,
            title: p.title,
            alt: p.title,
            link: `/blogs/${p.slug}`,
          }))}
        name={title}
        description={subtitle}
      />
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Heading */}
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} className="max-w-2xl" />

        {/* Cards */}
        <div
          className={
            isList
              ? "space-y-4"
              : `grid grid-cols-1 gap-6 ${gridCols}`
          }
        >
          {visiblePosts.map((post) => {
            const category = post.category ? categoryMap.get(post.category) : undefined;

            if (isList) {
              return (
                <Link
                  key={post._id}
                  href={`/blogs/${post.slug}`}
                  className="group flex gap-5 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 sm:h-32 sm:w-48">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    {category && (
                      <Badge variant="secondary" className="mb-2 w-fit rounded-full text-[11px]">
                        {category.name}
                      </Badge>
                    )}
                    <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRightIcon />
                </Link>
              );
            }

            return (
              <Link
                key={post._id}
                href={`/blogs/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  {category && (
                    <div className="absolute left-3 top-3">
                      <Badge className="rounded-full border-0 bg-black/50 text-[11px] font-medium text-white backdrop-blur-sm">
                        {category.icon ? `${category.icon} ` : ""}
                        {category.name}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {post.author?.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {(post.author?.name || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                      {post.author?.name || "Ubuntu Team"}
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {post.tags && post.tags.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        {post.tags[0]}
                        {post.tags.length > 1 && <span>+{post.tags.length - 1}</span>}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        {showViewAll && (
          <div className="text-center">
            <Link href="/blogs">
              <Button variant="outline" className="rounded-xl">
                {viewAllText} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ArrowUpRightIcon() {
  return (
    <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
  );
}
