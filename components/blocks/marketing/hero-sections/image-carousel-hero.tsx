"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageCarouselHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
  imageUrl?: string;
  imageUrls?: string[];
}

export default function ImageCarouselHero({
  title = "Build exceptional digital experiences",
  subtitle = "Our platform helps you create stunning websites and applications with ease, designed to engage your audience and drive results.",
  ctaText = "Get Started",
  ctaLink = "#",
  secondaryCtaText = "Explore Features",
  secondaryCtaLink = "#features",
  badge = "Enterprise Platform 3.0",
  imageUrl,
  imageUrls,
}: ImageCarouselHeroProps) {
  const images = useMemo(() => {
    if (imageUrls?.length) {
      return imageUrls.map((src, index) => ({
        src,
        alt: `${title} - Slide ${index + 1}`,
      }));
    }

    if (imageUrl) {
      return [
        {
          src: imageUrl,
          alt: title,
        },
      ];
    }

    return [];
  }, [imageUrls, imageUrl, title]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentImageIndex((current) =>
      Math.min(current, Math.max(images.length - 1, 0))
    );
  }, [images.length]);

  // Auto-advance carousel (pauses on hover)
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = window.setInterval(() => {
      setCurrentImageIndex((current) => (current + 1) % images.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [images.length, isPaused]);

  const goToNextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((current) => (current + 1) % images.length);
  };

  const goToPreviousImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(
      (current) => (current - 1 + images.length) % images.length
    );
  };

  return (
    <section
      aria-label="Hero Carousel"
      className="relative isolate min-h-[90vh] lg:min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Cinematic Overlay */}
      {images.length > 0 && (
        <div className="absolute inset-0 -z-10">
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentImageIndex
                  ? "opacity-100 scale-100"
                  : "pointer-events-none opacity-0 scale-105"
              }`}
              aria-hidden={index !== currentImageIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Multi-stage Vignette & Darkening Gradients for High Readability */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-primary/20" />
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPreviousImage}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white sm:left-8 md:flex items-center justify-center shadow-2xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToNextImage}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white sm:right-8 md:flex items-center justify-center shadow-2xl"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center sm:px-8 lg:py-32">
        <div className="flex flex-col items-center justify-center space-y-4">
          
     

          {/* Elite Heading with Gradient Highlight */}
          <h1 className="mt-16 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.08]">
            <span>{title}</span>{" "}
            
          </h1>

          {/* Subtitle with Optimized Readability Measure */}
          {subtitle && (
            <p className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-slate-200 ">
              {subtitle}
            </p>
          )}

          {/* Action Group */}
          {ctaText && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Button
                
                size="lg"
                className="group h-13 w-full sm:w-auto rounded-full px-8 text-base font-semibold border border-white/30  text-white hover:bg-slate-100 shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link href={ctaLink} className="flex items-center justify-center gap-2">
                  <span>{ctaText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              {secondaryCtaText && (
                <Button
                  
                  size="lg"
                  variant="outline"
                  className="h-13 w-full sm:w-auto rounded-full  bg-secondary px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:border-white/40 transition-all duration-200"
                >
                  <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Carousel Indicators / Pagination Pills */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-8"
          role="tablist"
          aria-label="Hero images"
        >
          {images.map((image, index) => (
            <button
              key={`${image.src}-indicator`}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              role="tab"
              aria-selected={index === currentImageIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentImageIndex
                  ? "w-10 bg-white shadow-md"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}