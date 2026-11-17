"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  categories?: string[];
}

export default function GridGallery() {
  // Configuration options
  const enableFiltering = true;

  // Static images array
  const images: GalleryImage[] = [
    {
      src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop',
      alt: 'New York City skyline with Empire State Building',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Architecture'],
    },
    {
      src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1544&auto=format&fit=crop',
      alt: 'Chicago downtown with river and bridges',
      width: 1544,
      height: 1026,
      categories: ['Cities', 'Landscape'],
    },
    {
      src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop',
      alt: 'San Francisco view with Golden Gate Bridge',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Landmarks'],
    },
    {
      src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1470&auto=format&fit=crop',
      alt: 'London cityscape with Tower Bridge',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Rivers'],
    },
    {
      src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1470&auto=format&fit=crop',
      alt: 'Tokyo skyline at night with illuminated buildings',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Night'],
    },
    {
      src: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1470&auto=format&fit=crop',
      alt: 'Sydney Opera House and Harbour Bridge',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Landmarks'],
    },
    {
      src: 'https://images.unsplash.com/photo-1569587112025-0d460e81a126?q=80&w=1470&auto=format&fit=crop',
      alt: 'Dubai skyline with Burj Khalifa',
      width: 1470,
      height: 980,
      categories: ['Cities', 'Architecture'],
    },
    {
      src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1473&auto=format&fit=crop',
      alt: 'Paris with Eiffel Tower view',
      width: 1473,
      height: 982,
      categories: ['Cities', 'Landmarks'],
    },
  ];

  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  // Extract all unique categories from images
  const categories = React.useMemo(() => {
    if (!enableFiltering) return [];

    const allCategories = new Set<string>();
    images.forEach((image) => {
      image.categories?.forEach((category) => {
        allCategories.add(category);
      });
    });

    return Array.from(allCategories).sort();
  }, [images, enableFiltering]);

  // Filter images based on active category
  const filteredImages = React.useMemo(() => {
    if (!activeFilter) return images;
    return images.filter((image) => image.categories?.includes(activeFilter));
  }, [images, activeFilter]);

  return (
    <div className="w-full p-4 md:p-6">
      {enableFiltering && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredImages.map((image, index) => (
          <div
            key={`img-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            
              fill
            />
            <div className="absolute inset-0 flex items-end bg-black/30 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="line-clamp-2 text-sm font-medium text-white">
                {image.alt}
              </p>
            </div>
            {image.categories && image.categories.length > 0 && (
              <div className="absolute top-2 right-2 flex max-w-[calc(100%-16px)] flex-wrap justify-end gap-1">
                {image.categories.slice(0, 2).map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {image.categories.length > 2 && (
                  <Badge variant="secondary">
                    +{image.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
