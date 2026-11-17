"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Calendar,
  MapPin,
  Info,
  X,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import Image from "next/image";

interface SplitGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  description: string;
  photographer: string;
  date: string;
  location: string;
  tags: string[];
}

export default function SplitGallery() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [infoExpanded, setInfoExpanded] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  // Static images array with detailed metadata
  const images = React.useMemo<SplitGalleryImage[]>(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1474&auto=format&fit=crop',
        alt: 'Mountain lake with snow-capped peaks in background',
        width: 1474,
        height: 983,
        title: 'Alpine Serenity',
        description:
          'A pristine alpine lake reflects the majestic snow-capped mountains that surround it. The stillness of the water creates a perfect mirror image of the landscape, while the early morning light bathes everything in a golden glow.',
        photographer: 'Thomas Raynor',
        date: 'August 15, 2023',
        location: 'Banff National Park, Canada',
        tags: ['Nature', 'Landscape', 'Mountains', 'Water'],
      },
      {
        src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1470&auto=format&fit=crop',
        alt: 'Sunset over mountain range with dramatic clouds',
        width: 1470,
        height: 980,
        title: 'Twilight Mountains',
        description:
          'As the day comes to a close, the setting sun casts dramatic rays through the clouds, illuminating the mountain range with a spectrum of warm colors. The interplay of light and shadow emphasizes the rugged texture of the peaks.',
        photographer: 'Emma Walters',
        date: 'October 3, 2023',
        location: 'Dolomites, Italy',
        tags: ['Sunset', 'Mountains', 'Clouds', 'Dramatic'],
      },
      {
        src: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1528&auto=format&fit=crop',
        alt: 'Desert landscape with rock formations at sunrise',
        width: 1528,
        height: 1019,
        title: 'Desert Dawn',
        description:
          'The first light of day breaks over ancient rock formations in the desert, creating long shadows and revealing the rich textures and colors of the arid landscape. The silence and vastness create a profound sense of solitude and timelessness.',
        photographer: 'Hassan Khan',
        date: 'March 21, 2023',
        location: 'Wadi Rum, Jordan',
        tags: ['Desert', 'Sunrise', 'Rock Formations', 'Landscape'],
      },
      {
        src: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=1470&auto=format&fit=crop',
        alt: 'Foggy forest with sunlight streaming through trees',
        width: 1470,
        height: 980,
        title: 'Mystic Forest',
        description:
          'Morning fog weaves between ancient trees as rays of sunlight pierce through the canopy. The ethereal atmosphere transforms the forest into an enchanted realm where time seems to stand still and every sound is muffled by the mist.',
        photographer: 'Lucia Fernandez',
        date: 'November 12, 2023',
        location: 'Olympic National Park, USA',
        tags: ['Forest', 'Fog', 'Sunlight', 'Trees', 'Mystical'],
      },
      {
        src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1494&auto=format&fit=crop',
        alt: 'Aerial view of turquoise ocean water meeting white sand beach',
        width: 1494,
        height: 996,
        title: 'Coastal Paradise',
        description:
          'A birds-eye view reveals the stunning meeting point of crystal-clear turquoise waters and pristine white sand beaches. The natural patterns formed by ocean currents create a mesmerizing tapestry of colors and textures along the shoreline.',
        photographer: 'Michael Chen',
        date: 'January 8, 2023',
        location: 'Whitsunday Islands, Australia',
        tags: ['Aerial', 'Ocean', 'Beach', 'Coastal', 'Turquoise'],
      },
    ],
    []
  );

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    if (infoExpanded) setInfoExpanded(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    if (infoExpanded) setInfoExpanded(false);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      } else if (e.key === 'i') {
        setInfoExpanded((prev) => !prev);
      } else if (e.key === 'f') {
        setFullscreen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, infoExpanded]);

  const currentImage = images[currentIndex]!;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-black text-white',
        fullscreen ? 'fixed inset-0 z-50' : 'h-screen max-h-[800px]'
      )}
    >
      {/* Main gallery container */}
      <div className="relative h-full w-full">
        {/* Image container */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            sizes="100vw"
            className="object-cover"
          
              fill
            />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>

        {/* Header with title and navigation */}
        <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4 md:p-6">
          <h2 className="animate-fade-in text-xl font-bold text-white md:text-3xl">
            {currentImage.title}
          </h2>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 md:h-10 md:w-10" onClick={() => setInfoExpanded(!infoExpanded)} />}><Info className="h-4 w-4 md:h-5 md:w-5" /></TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Image details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {fullscreen && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 md:h-10 md:w-10" onClick={() => setFullscreen(false)} />}><X className="h-4 w-4 md:h-5 md:w-5" /></TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Exit fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute top-1/2 right-0 left-0 z-10 flex -translate-y-1/2 justify-between px-4 md:px-6">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 md:h-12 md:w-12"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 md:h-12 md:w-12"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        {/* Bottom info bar */}
        <div
          className={cn(
            'absolute right-0 bottom-0 left-0 z-20 transform transition-transform duration-500',
            infoExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
          )}
        >
          {/* Info toggle button */}
          <button
            onClick={() => setInfoExpanded(!infoExpanded)}
            className="mx-auto flex h-10 w-full items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <ChevronUp
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                infoExpanded && 'rotate-180'
              )}
            />
          </button>

          {/* Expanded info panel */}
          <div className="bg-black/60 p-5 backdrop-blur-md md:p-6">
            <div className="mb-4 grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div className="animate-fade-in text-sm md:text-base">
                  {currentImage.description}
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentImage.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase">
                        Photographer
                      </span>
                    </div>
                    <p className="text-sm">{currentImage.photographer}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase">
                        Date
                      </span>
                    </div>
                    <p className="text-sm">{currentImage.date}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase">
                        Location
                      </span>
                    </div>
                    <p className="text-sm">{currentImage.location}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="w-full sm:w-auto"
                    variant={fullscreen ? 'destructive' : 'default'}
                  >
                    {fullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom indicator bar */}
        <div className="absolute bottom-[60px] left-0 z-10 flex w-full justify-center gap-1 p-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (infoExpanded) setInfoExpanded(false);
              }}
              className={cn(
                'h-1 transition-all',
                index === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Add animation classes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
