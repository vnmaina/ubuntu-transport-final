
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CollectionCard } from "@/components/collection-card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Compass,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export interface DestinationsBlockProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  columns?: 2 | 3 | 4;
  tagFilter?: string;
  showViewAll?: boolean;
  viewAllText?: string;
  variant?: "grid" | "list" | "masonry";
}

function DestinationsSkeleton({
  columns = 3,
}: {
  columns?: 2 | 3 | 4;
}) {
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
          {Array.from({
            length: columns === 4 ? 4 : 3,
          }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />

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

export function DestinationsBlock({
  title = "Our Destinations",
  subtitle,
  limit = 6,
  columns = 3,
  tagFilter,
  showViewAll = true,
  viewAllText = "View All Destinations",
  variant = "grid",
}: DestinationsBlockProps) {
  const collection = useQuery(
    api.collections.getCollectionBySlug,
    { slug: "destinations" }
  );

  const items = useQuery(
    api.collections.getPublishedItemsByCollection,
    collection?._id
      ? { collectionId: collection._id }
      : "skip"
  );

  // Loading state
  if (collection === undefined || items === undefined) {
    return <DestinationsSkeleton columns={columns} />;
  }

  // Collection unavailable
  if (!collection || !items) {
    return null;
  }

  // Filter destinations by tag
  const filteredItems = items
    .filter((item) => {
      if (!tagFilter?.trim()) return true;

      return item.tags?.some(
        (tag) =>
          tag.toLowerCase() === tagFilter.trim().toLowerCase()
      );
    })
    .slice(0, limit > 0 ? limit : undefined);

  const displayTitle = title || collection.name;
  const displaySubtitle = subtitle || collection.description;

  const gridColsClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const layoutClass =
    variant === "list"
      ? "mx-auto flex max-w-5xl flex-col gap-5"
      : variant === "masonry"
        ? "columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"
        : `grid ${gridColsClass} gap-6 lg:gap-8`;

  return (
    <section className="relative isolate overflow-hidden border-b bg-background px-4 py-16 md:px-8 lg:py-24">
      {/* Decorative brand accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-96 rounded-full bg-primary/[0.035] blur-3xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 lg:space-y-14">
        {/* Section Header */}
        {(displayTitle || displaySubtitle) && (
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="h-1 w-7 rounded-full bg-secondary" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Explore Destinations
              </span>

              <span className="h-1 w-7 rounded-full bg-secondary" />
            </div>

            {displayTitle && (
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {displayTitle}
              </h2>
            )}

            {displaySubtitle && (
              <p className="mx-auto max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
                {displaySubtitle}
              </p>
            )}

            <div className="mx-auto h-1 w-16 rounded-full bg-secondary" />
          </div>
        )}

        {/* Destinations */}
        {filteredItems.length === 0 ? (
          <div className="-mt-4 mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
              <MapPin
                className="size-8"
                strokeWidth={1.5}
              />
            </div>

            <h3 className="text-xl font-bold text-primary">
              No Destinations Available
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
              We are currently updating our destinations. Please check back soon for new places to explore.
            </p>
          </div>
        ) : (
          <div className={layoutClass}>
            {filteredItems.map((item) => (
              <CollectionCard
                key={item._id}
                item={item}
                collectionSlug="destinations"
              />
            ))}
          </div>
        )}

        {/* View All CTA */}
        {showViewAll && filteredItems.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              
              size="lg"
              className="group h-12 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              <Link href="/collections/destinations">
                {viewAllText}
  </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
