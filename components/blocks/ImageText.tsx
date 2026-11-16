
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Compass,
  MapPin,
  Plane,
} from "lucide-react";

export interface ImageTextProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  imagePosition?: "left" | "right";
  variant?: string;
  badge?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  highlights?: string[];
  statValue?: string;
  statLabel?: string;
}

export function ImageText({
  title = "",
  content = "",
  imageUrl,
  imagePosition,
  variant,
  badge,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  highlights = [],
  statValue,
  statLabel,
}: ImageTextProps) {
  const safeTitle = title || "";
  const safeContent = typeof content === "string" ? content : "";

  const isImageLeft =
    (imagePosition || (variant === "right" ? "right" : "left")) === "left";

  const paragraphs = safeContent
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const validHighlights = Array.isArray(highlights)
    ? highlights.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : [];

  const hasPrimaryCta = Boolean(ctaText && ctaLink);
  const hasSecondaryCta = Boolean(secondaryCtaText && secondaryCtaLink);

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[420px] rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-[420px] rounded-full bg-accent/[0.07] blur-[100px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 ">

          {/* Image */}
          <div
            className={`relative lg:col-span-7 ${
              isImageLeft ? "" : "lg:order-2"
            }`}
          >
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/10 ring-1 ring-border sm:rounded-[2rem]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={safeTitle || "Featured image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-accent/10">
                    <Compass className="size-16 text-primary/30" />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              {badge && (
                <div className="absolute -top-4 left-4 flex max-w-[85%] items-center gap-3 rounded-xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-md sm:-left-5 sm:top-8 sm:rounded-2xl sm:p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Plane className="size-5" />
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {badge}
                  </span>
                </div>
              )}

              {/* Floating statistics */}
              {statValue && (
                <div className="absolute -bottom-5 right-4 min-w-32 rounded-xl border border-border/70 bg-background/95 p-4 shadow-xl backdrop-blur-md sm:-bottom-6 sm:right-8 sm:min-w-40 sm:rounded-2xl sm:p-5">
                  <p className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    {statValue}
                  </p>

                  {statLabel && (
                    <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                      {statLabel}
                    </p>
                  )}
                </div>
              )}

              {/* Decorative outline */}
              <div className="pointer-events-none absolute -bottom-4 -left-4 -z-10 hidden size-full rounded-[2rem] border border-primary/20 sm:block" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`lg:col-span-5 ${
              isImageLeft ? "" : "lg:order-1"
            }`}
          >
            {subtitle && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2">
                <span className="size-1.5 rounded-full bg-accent" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {subtitle}
                </span>
              </div>
            )}

            <h2 className="text-3xl font-extrabold leading-[1.12] text-primary sm:text-4xl lg:text-5xl">
              {safeTitle}
            </h2>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-primary" />
              <span className="h-1 w-5 rounded-full bg-accent" />
              <MapPin className="size-4 text-primary/60" />
            </div>

            {/* Description */}
            {paragraphs.length > 0 && (
              <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground sm:text-lg">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Highlights */}
            {validHighlights.length > 0 && (
              <ul className="mt-8 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                {validHighlights.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 text-sm font-medium leading-relaxed text-foreground"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA buttons */}
            {(hasPrimaryCta || hasSecondaryCta) && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {hasPrimaryCta && (
                  <Button
                    
                    size="lg"
                    className="group h-12 rounded-xl px-7 font-bold shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Link href={ctaLink!}>
                      {ctaText}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}

                {hasSecondaryCta && (
                  <Button
                    
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl border-border px-7 font-semibold transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    <Link href={secondaryCtaLink!}>
                      {secondaryCtaText}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
