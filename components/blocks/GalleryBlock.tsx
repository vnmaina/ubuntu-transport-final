"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Camera } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "./SectionHeader";

export interface GalleryImage {
  url: string;
  type?: "image" | "video";
  title?: string;
  alt?: string;
  credit?: string;
  link?: string;
}

export interface GalleryBlockProps {
  variant?: "grid" | "carousel";
  title?: string;
  subtitle?: string;
  text?: string;
  images?: (GalleryImage | string)[];
}

function normalizeImages(images?: (GalleryImage | string)[]): GalleryImage[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img): GalleryImage | null => {
      if (typeof img === "string") return img.trim() ? { url: img.trim() } : null;
      if (img && typeof img.url === "string" && img.url.trim()) {
        const ext = img.url.split("?")[0].split(".").pop()?.toLowerCase() || "";
        const isVideo = img.type === "video" || ["mp4", "webm", "mov", "m4v", "ogg"].includes(ext);
        return {
          url: img.url.trim(),
          type: isVideo ? "video" : "image",
          title: img.title?.trim() || undefined,
          alt: img.alt?.trim() || undefined,
          credit: img.credit?.trim() || undefined,
          link: img.link?.trim() || undefined,
        };
      }
      return null;
    })
    .filter((i): i is GalleryImage => i !== null);
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
  const alt = image.alt || image.title || fallbackTitle || "Gallery image";
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
        <img
          src={image.url}
          alt={alt}
          title={image.title || alt}
          loading="lazy"
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
  const items = normalizeImages(images);
  if (items.length === 0) return null;

  const heading = title || "Gallery";
  const isCarousel = variant === "carousel";

  // Media SEO: ImageGallery + ItemList of ImageObject
  const galleryLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: heading,
    description: text || subtitle || undefined,
    image: items.map((i) =>
      i.type === "video"
        ? {
            "@type": "VideoObject",
            contentUrl: i.url,
            name: i.title || i.alt || heading,
            description: i.alt || i.title || undefined,
          }
        : {
            "@type": "ImageObject",
            url: i.url,
            name: i.title || i.alt || heading,
            description: i.alt || i.title || undefined,
            creditText: i.credit || undefined,
            ...(i.link ? { contentUrl: i.link } : {}),
          }
    ),
  };

  return (
    <section className="bg-background px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <JsonLd data={galleryLd} />
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
