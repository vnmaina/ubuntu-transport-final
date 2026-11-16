"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Folder,
  Heart,
  MapPin,
  Package,
  Plane,
  ShieldCheck,
  Trees,
  Truck,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface CollectionItemMetadata {
  duration?: string;
  client?: string;
  projectDate?: string;
  role?: string;
  stock?: number;
  features?: string[];
  location?: string;
}

export interface CollectionItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  tags?: string[];
  metadata?: CollectionItemMetadata;
}

export interface CollectionCardProps {
  item: CollectionItem;
  collectionSlug: string;
  ctaLabel?: string;
  priority?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  folder: Folder,
  users: Users,
  package: Package,
  services: BriefcaseBusiness,
  projects: Folder,
  team: Users,
  products: Package,
  truck: Truck,
  "truck-moving": Truck,
  shield: ShieldCheck,
  heart: Heart,
  plane: Plane,
  trees: Trees,
  "map-pin": MapPin,
  "user-check": UserCheck,
};

function getCardIcon(icon?: string): LucideIcon {
  if (!icon) return Package;
  return ICON_MAP[icon.trim().toLowerCase()] ?? Package;
}

export function CollectionCard({
  item,
  collectionSlug,
  ctaLabel = "Learn More",
  priority = false,
}: CollectionCardProps) {
  const {
    title,
    slug,
    description,
    imageUrl,
    icon,
    tags = [],
    metadata,
  } = item;

  const Icon = getCardIcon(icon);
  const visibleTags = tags.filter(Boolean).slice(0, 2);
  const extraTagCount = Math.max(0, tags.filter(Boolean).length - 2);
  const topFeatures = metadata?.features?.filter(Boolean).slice(0, 2) ?? [];

  const hasMetadata = Boolean(
    metadata?.duration || metadata?.location || metadata?.client
  );

  return (
    <Link
      href={`/collections/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(slug)}`}
      aria-label={`${ctaLabel}: ${title}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
        {/* Top Hover Accent Bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-secondary transition-transform duration-500 ease-out group-hover:scale-x-100"
        />

        {/* Media Header */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority={priority}
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-secondary/10"
              />
            </>
          ) : (
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 size-48 rounded-full bg-secondary/30 blur-3xl transition-transform duration-700 group-hover:scale-125"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-16 -left-12 size-48 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125"
              />

              <div className="relative flex size-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white/15 sm:size-24 sm:rounded-3xl">
                <Icon
                  aria-hidden="true"
                  className="size-10 text-primary-foreground sm:size-11"
                  strokeWidth={1.5}
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent"
              />
            </div>
          )}
        
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-base font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-secondary sm:text-xl">
              {title}
            </h3>

            {description && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Highlighted Features */}
          {topFeatures.length > 0 && (
            <ul className="space-y-2">
              {topFeatures.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-secondary"
                    strokeWidth={2}
                  />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}

       </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between border-t border-border/60 bg-primary px-5 py-3.5 text-primary-foreground transition-colors duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground sm:px-6">
          <span className="text-xs font-bold uppercase tracking-wider">
            {ctaLabel}
          </span>

          <span
            aria-hidden="true"
            className="size-8 flex  items-center justify-center rounded-full bg-primary-foreground/80 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary"
          >
            <ArrowRight
            strokeWidth={2}
            className="size-4 text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-secondary-foreground"
          />
          
          </span>
        </div>
      </article>
    </Link>
  );
}