"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Tag } from 'lucide-react';
import Image from "next/image";

interface PortfolioImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  size: 'small' | 'medium' | 'large';
}

export default function PortfolioGallery() {
  const [filter, setFilter] = React.useState<string | null>(null);

  // Images with their categories and size variations for portfolio layout
  const images = React.useMemo<PortfolioImage[]>(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1627483297886-49710ae1fc22?q=80&w=1470&auto=format&fit=crop',
        alt: 'Minimalist white kitchen with marble countertops',
        width: 1470,
        height: 980,
        category: 'Interior',
        size: 'large',
      },
      {
        src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1470&auto=format&fit=crop',
        alt: 'Modern living room with accent furniture',
        width: 1470,
        height: 980,
        category: 'Interior',
        size: 'medium',
      },
      {
        src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1475&auto=format&fit=crop',
        alt: 'Contemporary house exterior with landscaping',
        width: 1475,
        height: 983,
        category: 'Exterior',
        size: 'medium',
      },
      {
        src: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?q=80&w=1470&auto=format&fit=crop',
        alt: 'Modern dining room with pendant lighting',
        width: 1470,
        height: 980,
        category: 'Interior',
        size: 'small',
      },
      {
        src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1470&auto=format&fit=crop',
        alt: 'Minimalist bathroom with freestanding tub',
        width: 1470,
        height: 980,
        category: 'Interior',
        size: 'small',
      },
      {
        src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1470&auto=format&fit=crop',
        alt: 'Luxury high-rise apartment building exterior',
        width: 1470,
        height: 980,
        category: 'Exterior',
        size: 'large',
      },
      {
        src: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1470&auto=format&fit=crop',
        alt: 'Open concept kitchen and living area',
        width: 1470,
        height: 980,
        category: 'Interior',
        size: 'medium',
      },
      {
        src: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=1374&auto=format&fit=crop',
        alt: 'Modern residential architecture with large windows',
        width: 1374,
        height: 916,
        category: 'Exterior',
        size: 'medium',
      },
      {
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632&auto=format&fit=crop',
        alt: 'Elegant home office with wooden desk and natural lighting',
        width: 1632,
        height: 1088,
        category: 'Interior',
        size: 'small',
      },
      {
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1474&auto=format&fit=crop',
        alt: 'Contemporary garden and landscape design',
        width: 1474,
        height: 983,
        category: 'Landscape',
        size: 'medium',
      },
    ],
    []
  );

  // Extract all unique categories
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    images.forEach((image) => categorySet.add(image.category));
    return Array.from(categorySet);
  }, [images]);

  // Filter images based on selected category
  const filteredImages = React.useMemo(() => {
    if (!filter) return images;
    return images.filter((image) => image.category === filter);
  }, [images, filter]);

  return (
    <div className="w-full p-4 md:p-6">
      {/* Category filter */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Design Portfolio
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(null)}
            className="gap-1.5 rounded-full"
          >
            <Tag className="h-3.5 w-3.5" />
            <span>All Projects</span>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(category)}
              className="gap-1.5 rounded-full"
            >
              <Tag className="h-3.5 w-3.5" />
              <span>{category}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Portfolio grid with varying image sizes */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((image, index) => {
          // Set different spans for different sized images
          const spanClasses = {
            small: '',
            medium: 'sm:col-span-1 md:col-span-1',
            large: 'sm:col-span-2 md:col-span-2',
          };

          return (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-lg ${spanClasses[image.size]}`}
            >
              <div className="relative aspect-square sm:aspect-auto sm:h-64 md:h-80">
                <Image
                  src={image.src}
                  alt={image.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                
              fill
            />

                {/* Overlay with details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="mb-2 text-center text-xl font-bold text-white">
                    {image.alt}
                  </h3>

                  <span className="mb-4 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                    {image.category}
                  </span>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2 gap-1.5"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Project</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
