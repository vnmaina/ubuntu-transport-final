
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Shield,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CardItem {
  id?: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: string;
  value?: string;
  change?: string;
  imageUrl?: string;
  linkText?: string;
  linkUrl?: string;
  metadata?: {
    duration?: string;
    features?: string[];
    location?: string;
    client?: string;
  };
  tags?: string[];
}

export interface CardBlockProps {
  variant?: "grid" | "stats" | "action" | "image-cards" | "list" | "masonry";
  title?: string;
  subtitle?: string;
  badge?: string;
  cards?: CardItem[];
  columns?: 2 | 3 | 4;
  collectionSlug?: string;
  limit?: number;
  tagFilter?: string;
  showViewAll?: boolean;
  viewAllText?: string;
}

// -----------------------------------------------------------------------------
// Default Cards
// -----------------------------------------------------------------------------

const DEFAULT_CARDS: CardItem[] = [
  {
    id: "1",
    title: "Instant Analytics",
    description:
      "Get real-time insights into user activity and engagement with an integrated analytics dashboard.",
    badge: "Popular",
    icon: "Zap",
    linkText: "Learn More",
    linkUrl: "#",
  },
  {
    id: "2",
    title: "Automated Workflows",
    description:
      "Connect your tools and streamline everyday operations with automated workflows.",
    badge: "Automated",
    icon: "Activity",
    linkText: "Explore Features",
    linkUrl: "#",
  },
  {
    id: "3",
    title: "Enterprise Security",
    description:
      "Protect your business with advanced security, access controls, and reliable infrastructure.",
    badge: "Secure",
    icon: "Shield",
    linkText: "Learn More",
    linkUrl: "#",
  },
];

// -----------------------------------------------------------------------------
// Icon Mapping
// -----------------------------------------------------------------------------

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Activity,
  Star,
  Sparkles,
  Layers,
  BriefcaseBusiness,
  CheckCircle2,
  DollarSign,
  Tag,
  Clock,
};

function CardIcon({
  name,
  className = "size-6",
}: {
  name?: string;
  className?: string;
}) {
  const Icon = name ? ICONS[name] || Layers : Layers;

  return <Icon className={className} strokeWidth={1.8} />;
}

// -----------------------------------------------------------------------------
// Image Component
// -----------------------------------------------------------------------------

function CardImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={className}
    />
  );
}

// -----------------------------------------------------------------------------
// Loading Skeleton
// -----------------------------------------------------------------------------

function CardBlockSkeleton({
  variant,
  columns,
}: {
  variant: CardBlockProps["variant"];
  columns: 2 | 3 | 4;
}) {
  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  if (variant === "list") {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row"
          >
            <div className="h-28 w-full animate-pulse rounded-xl bg-muted sm:w-36" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
      {Array.from({
        length: columns === 4 ? 4 : 3,
      }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          {variant !== "stats" && (
            <div className="aspect-[4/3] animate-pulse bg-muted" />
          )}

          <div className="space-y-4 p-6">
            <div className="size-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

function EmptyState({
  collectionSlug,
}: {
  collectionSlug?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
        <BriefcaseBusiness className="size-8" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-primary">
        {collectionSlug ? "Nothing to display yet" : "No cards available"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
        {collectionSlug
          ? "There are currently no published items in this collection. Please check back soon."
          : "There are no cards available to display at the moment."}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Card Block
// -----------------------------------------------------------------------------

export function CardBlock({
  variant = "grid",
  title,
  subtitle,
  badge,
  cards,
  columns = 3,
  collectionSlug,
  limit,
  tagFilter,
  showViewAll = true,
  viewAllText,
}: CardBlockProps) {
  // Fetch collection
  const collection = useQuery(
    api.collections.getCollectionBySlug,
    collectionSlug ? { slug: collectionSlug } : "skip"
  );

  // Fetch published collection items
  const collectionItems = useQuery(
    api.collections.getPublishedItemsByCollection,
    collection?._id
      ? { collectionId: collection._id }
      : "skip"
  );

  // Loading state
  const isLoading =
    !!collectionSlug &&
    (collection === undefined ||
      (!!collection && collectionItems === undefined));

  // Prepare cards
  const displayCards: CardItem[] = useMemo(() => {
    if (collectionSlug) {
      if (!collectionItems) return [];

      let filtered = collectionItems;

      if (tagFilter?.trim()) {
        const normalizedTag = tagFilter.trim().toLowerCase();

        filtered = filtered.filter((item) =>
          item.tags?.some(
            (tag) => tag.toLowerCase() === normalizedTag
          )
        );
      }

      if (limit && limit > 0) {
        filtered = filtered.slice(0, limit);
      }

      return filtered.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        badge: item.tags?.[0],
        icon: item.icon,
        imageUrl: item.imageUrl,
        linkText: "View Details",
        linkUrl: `/collections/${collectionSlug}/${item.slug}`,
        metadata: item.metadata,
        tags: item.tags,
      }));
    }

    if (cards?.length) return cards;

    return DEFAULT_CARDS;
  }, [collectionSlug, collectionItems, tagFilter, limit, cards]);

  // Section content
  const displayTitle =
    title || collection?.name || "Explore Our Highlights";

  const displaySubtitle =
    subtitle || collection?.description;

  const displayBadge =
    badge || collection?.name;

  // Responsive columns
  const gridColsClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // Action variant uses the grid layout
  const effectiveVariant =
    variant === "action" ? "grid" : variant;

  const hasCards = displayCards.length > 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 py-16 md:px-8 lg:py-24">
      {/* Decorative Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-96 rounded-full bg-primary/[0.035] blur-3xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 lg:space-y-14">
        {/* Section Header */}
        {(displayTitle || displaySubtitle || displayBadge) && (
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            {displayBadge && (
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className="gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  <Sparkles className="size-3.5 text-secondary" />
                  {displayBadge}
                </Badge>
              </div>
            )}

            {displayTitle && (
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {displayTitle}
              </h2>
            )}

            {displaySubtitle && (
              <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {displaySubtitle}
              </p>
            )}

            <div className="mx-auto h-1 w-16 rounded-full bg-secondary" />
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <CardBlockSkeleton
            variant={effectiveVariant}
            columns={columns}
          />
        ) : !collectionSlug || collection ? (
          <>
            {/* Collection Information */}
            {hasCards && collectionSlug && (
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Layers className="size-4 text-secondary" />
                  <span>
                    {displayCards.length}{" "}
                    {displayCards.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {tagFilter && (
                  <Badge
                    variant="secondary"
                    className="max-w-[50%] truncate rounded-full bg-primary/5 px-3 py-1.5 text-primary"
                  >
                    {tagFilter}
                  </Badge>
                )}
              </div>
            )}

            {/* Empty State */}
            {!hasCards ? (
              <EmptyState collectionSlug={collectionSlug} />
            ) : (
              <>
                {/* =========================================================
                    GRID CARDS
                ========================================================== */}
                {effectiveVariant === "grid" && (
                  <div className={`grid ${gridColsClass} gap-6 lg:gap-8`}>
                    {displayCards.map((card, idx) => (
                      <Card
                        key={card.id || idx}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                      >
                        <CardHeader className="flex-1 space-y-5 p-6">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                              <CardIcon name={card.icon} />
                            </div>

                            {card.badge && (
                              <Badge
                                variant="secondary"
                                className="max-w-[160px] truncate rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary"
                              >
                                {card.badge}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-3">
                            <CardTitle className="text-xl font-bold leading-snug tracking-tight text-primary transition-colors group-hover:text-secondary">
                              {card.title}
                            </CardTitle>

                            {card.description && (
                              <CardDescription className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                                {card.description}
                              </CardDescription>
                            )}
                          </div>

                          {card.metadata?.duration && (
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                              <Clock className="size-4 text-secondary" />
                              {card.metadata.duration}
                            </div>
                          )}
                        </CardHeader>

                        {card.linkText && (
                          <CardFooter className="mt-auto border-t border-border/70 p-4">
                            <Button
                              
                              variant="default"
                              className="h-11 w-full justify-between rounded-xl px-3 font-semibold "
                            >
                              <Link href={card.linkUrl || "#"}>
                                {card.linkText}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* =========================================================
                    IMAGE CARDS
                ========================================================== */}
                {effectiveVariant === "image-cards" && (
                  <div className={`grid ${gridColsClass} gap-6 lg:gap-8`}>
                    {displayCards.map((card, idx) => (
                      <Card
                        key={card.id || idx}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                          {card.imageUrl ? (
                            <CardImage
                              src={card.imageUrl}
                              alt={card.title}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-primary/[0.04] text-primary">
                              <CardIcon name={card.icon} className="size-12 opacity-40" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                          {card.badge && (
                            <Badge className="absolute right-4 top-4 max-w-[180px] truncate rounded-full border border-white/30 bg-background/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-md">
                              {card.badge}
                            </Badge>
                          )}

                          <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-md">
                            <CardIcon name={card.icon} className="size-5" />
                          </div>
                        </div>

                        {/* Content */}
                        <CardHeader className="flex-1 space-y-3 p-6">
                          <CardTitle className="text-xl font-bold leading-snug tracking-tight text-primary transition-colors group-hover:text-secondary">
                            {card.title}
                          </CardTitle>

                          {card.description && (
                            <CardDescription className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                              {card.description}
                            </CardDescription>
                          )}

                          {card.metadata?.duration && (
                            <div className="flex items-center gap-2 pt-1 text-xs font-medium text-muted-foreground">
                              <Clock className="size-4 text-secondary" />
                              {card.metadata.duration}
                            </div>
                          )}
                        </CardHeader>

                        {/* CTA */}
                        {card.linkText && (
                          <CardFooter className="mt-auto px-6 pb-6 pt-0">
                            <Button
                              
                              className="group/btn h-11 w-full gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                            >
                              <Link href={card.linkUrl || "#"}>
                                {card.linkText}
                                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* =========================================================
                    HORIZONTAL LIST
                ========================================================== */}
                {effectiveVariant === "list" && (
                  <div className="mx-auto max-w-5xl space-y-4">
                    {displayCards.map((card, idx) => (
                      <Card
                        key={card.id || idx}
                        className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:flex-row sm:items-center sm:p-5"
                      >
                        {/* Image / Icon */}
                        {card.imageUrl ? (
                          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-36">
                            <CardImage
                              src={card.imageUrl}
                              alt={card.title}
                              sizes="(max-width: 640px) 100vw, 144px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex size-16 shrink-0 items-center justify-center self-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10 sm:self-auto">
                            <CardIcon name={card.icon} />
                          </div>
                        )}

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h3 className="text-lg font-bold tracking-tight text-primary transition-colors group-hover:text-secondary">
                              {card.title}
                            </h3>

                            {card.badge && (
                              <Badge
                                variant="secondary"
                                className="rounded-full bg-secondary/10 text-xs font-semibold text-secondary"
                              >
                                {card.badge}
                              </Badge>
                            )}
                          </div>

                          {card.description && (
                            <p className="mx-auto line-clamp-2 max-w-xl text-sm leading-6 text-muted-foreground sm:mx-0">
                              {card.description}
                            </p>
                          )}

                          {card.metadata?.duration && (
                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:justify-start">
                              <Clock className="size-3.5 text-secondary" />
                              {card.metadata.duration}
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        {card.linkText && (
                          <div className="w-full shrink-0 sm:w-auto">
                            <Button
                              
                              variant="outline"
                              className="h-11 w-full gap-2 rounded-xl border-primary/20 font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
                            >
                              <Link href={card.linkUrl || "#"}>
                                {card.linkText}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* =========================================================
                    MASONRY
                ========================================================== */}
                {effectiveVariant === "masonry" && (
                  <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                    {displayCards.map((card, idx) => (
                      <Card
                        key={card.id || idx}
                        className="group mb-6 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
                      >
                        {card.imageUrl && (
                          <div className="relative h-52 overflow-hidden bg-muted">
                            <CardImage
                              src={card.imageUrl}
                              alt={card.title}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {card.badge && (
                              <Badge className="absolute right-4 top-4 max-w-[180px] truncate rounded-full bg-background/95 text-primary shadow-sm">
                                {card.badge}
                              </Badge>
                            )}
                          </div>
                        )}

                        <CardHeader className="space-y-3 p-6">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-lg font-bold leading-snug text-primary transition-colors group-hover:text-secondary">
                              {card.title}
                            </CardTitle>

                            {!card.imageUrl && card.badge && (
                              <Badge
                                variant="secondary"
                                className="shrink-0 rounded-full bg-secondary/10 text-xs text-secondary"
                              >
                                {card.badge}
                              </Badge>
                            )}
                          </div>

                          {card.description && (
                            <CardDescription className="text-sm leading-7 text-muted-foreground">
                              {card.description}
                            </CardDescription>
                          )}

                          {card.metadata?.duration && (
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                              <Clock className="size-4 text-secondary" />
                              {card.metadata.duration}
                            </div>
                          )}
                        </CardHeader>

                        {card.linkText && (
                          <CardFooter className="border-t border-border/70 p-4">
                            <Button
                              
                              variant="ghost"
                              className="h-10 w-full justify-between rounded-xl font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              <Link href={card.linkUrl || "#"}>
                                {card.linkText}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* =========================================================
                    STATISTICS
                ========================================================== */}
                {effectiveVariant === "stats" && (
                  <div className={`grid ${gridColsClass} gap-6`}>
                    {displayCards.map((card, idx) => (
                      <Card
                        key={card.id || idx}
                        className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                      >
                        <div className="absolute right-0 top-0 size-32 rounded-full bg-primary/[0.035] blur-2xl transition-colors group-hover:bg-secondary/10" />

                        <CardContent className="relative space-y-5 p-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10">
                              <CardIcon name={card.icon} className="size-5" />
                            </div>

                            {card.badge && (
                              <Badge
                                variant="outline"
                                className="rounded-full border-secondary/20 bg-secondary/5 text-xs font-semibold text-secondary"
                              >
                                {card.badge}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {card.title}
                            </p>

                            <div className="break-words text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                              {card.value || "—"}
                            </div>

                            {card.description && (
                              <p className="text-sm leading-6 text-muted-foreground">
                                {card.description}
                              </p>
                            )}
                          </div>

                          {card.change && (
                            <div className="flex items-center gap-2 border-t border-border pt-4 text-xs font-semibold text-secondary">
                              <TrendingUp className="size-4" />
                              {card.change}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <EmptyState collectionSlug={collectionSlug} />
        )}

        {/* ===============================================================
            VIEW ALL CTA
        ================================================================ */}
        {!isLoading &&
          hasCards &&
          showViewAll &&
          collectionSlug &&
          collection && (
            <div className="flex justify-center pt-4">
              <Button
                
                size="lg"
                className="group h-12 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
              >
                <Link href={`/collections/${collectionSlug}`}>
                  {viewAllText || `View All ${collection.name}`}

                  <ArrowUpRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Button>
            </div>
          )}
      </div>
    </section>
  );
}
