"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Camera } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { MediaJsonLd, normalizeMediaItems, mediaAlt, type MediaSeoItem } from "./media-seo";
import Image from "next/image";

export type GalleryImage = MediaSeoItem;

export interface GalleryBlockProps {
  variant?: "grid" | "carousel";
  title?: string;
  subtitle?: string;
  text?: string;
  images?: (GalleryImage | string)[];
}

function GalleryFigure({
  image,
  fallbackTitle,
  className = "",
}: {
  image: GalleryImage;
  fallbackTitle: string;
  className?: string;
}) {
  const alt = mediaAlt(image, fallbackTitle || "Gallery image");
  const isVideo = image.type === "video";
  const media = (
    <figure className={`group relative overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 ${className}`}>
      {isVideo && image.link && (
        <a
          href={image.link}
          target={image.link.startsWith("http") ? "_blank" : undefined}
          rel={image.link.startsWith("http") ? "noopener noreferrer" : undefined}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {image.title || "Watch"}
        </a>
      )}
      {isVideo ? (
        <video
          controls
          preload="none"
          {...({ loading: "lazy" } as React.VideoHTMLAttributes<HTMLVideoElement>)}
          width={800}
          height={600}
          className="aspect-[4/3] w-full bg-black object-cover"
          aria-label={alt}
        >
          <source src={image.url} />
        </video>
      ) : (
        <Image
          src={image.url}
          alt={alt}
          title={image.title || alt}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {(image.title || image.credit) && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {image.title && (
            <p className="text-sm font-semibold text-white drop-shadow">{image.title}</p>
          )}
          {image.credit && (
            <p className="mt-0.5 text-xs text-white/80 drop-shadow">{image.credit}</p>
          )}
        </figcaption>
      )}
    </figure>
  );

  if (image.link && !isVideo) {
    return (
      <a
        href={image.link}
        target={image.link.startsWith("http") ? "_blank" : undefined}
        rel={image.link.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={image.title || alt}
        className="block"
      >
        {media}
        <span className="sr-only">{image.title || alt}</span>
      </a>
    );
  }
  return media;
}

export function GalleryBlock({ variant = "grid", title, subtitle, text, images }: GalleryBlockProps) {
  const items = normalizeMediaItems(images);
  if (items.length === 0) return null;

  const heading = title || "Gallery";
  const isCarousel = variant === "carousel";

  return (
    <section className="bg-background px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <MediaJsonLd items={items} name={heading} description={text || subtitle} />
      <div className="mx-auto max-w-7xl">
        {/* Header — shared section header for site-wide title uniformity */}
        <SectionHeader
          eyebrow={subtitle}
          title={title}
          subtitle={text}
          className="mb-12"
        />

        {/* Grid variant */}
        {!isCarousel && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((image, i) => (
              <GalleryFigure key={i} image={image} fallbackTitle={heading} />
            ))}
          </div>
        )}

        {/* Carousel variant */}
        {isCarousel && (
          <Carousel opts={{ align: "start", loop: items.length > 2 }} className="w-full">
            <CarouselContent className="-ml-3">
              {items.map((image, i) => (
                <CarouselItem key={i} className="pl-3 sm:basis-1/2 lg:basis-1/3">
                  <GalleryFigure image={image} fallbackTitle={heading} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {items.length > 1 && (
              <>
                <CarouselPrevious className="left-2 border-border/60 bg-background/80 backdrop-blur-sm" />
                <CarouselNext className="right-2 border-border/60 bg-background/80 backdrop-blur-sm" />
              </>
            )}
          </Carousel>
        )}

        {/* Empty-ish footer note for SEO context */}
        {items.some((i) => i.credit) && (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Camera className="h-3.5 w-3.5" />
            Photo credits: {items.filter((i) => i.credit).map((i) => i.credit).join(" · ")}
          </p>
        )}
      </div>
    </section>
  );
}
