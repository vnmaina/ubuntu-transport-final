"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface HeroSectionSplitWithVideoProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
}

export default function HeroSectionSplitWithVideo({ title, subtitle, ctaText, ctaLink, videoUrl }: HeroSectionSplitWithVideoProps) {
  return (
    <>
      {/* Hero */}
      <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
        {/* Grid */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge variant="outline" className="mb-4">
              New Release v2.0
            </Badge>
            <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {title || "Transform your digital experience"}
            </h1>
            <p className="text-muted-foreground mb-6 text-xl">
              {subtitle || "Build stunning interfaces with our component library that seamlessly integrates with your workflow."}
            </p>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" >
                <Link href={ctaLink || "#"}>
                  {ctaText || "Get started"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                View documentation
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((id) => (
                  <Avatar key={id} className="h-10 w-10">
                    <AvatarImage
                      src={`https://github.com/shadcn.png`}
                      width={40}
                      height={40}
                    />
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-4 w-4 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground font-bold">4.9/5</span> from
                  over 1,200+ reviews
                </p>
              </div>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <div className="from-primary/20 absolute inset-0 z-10 rounded-xl bg-gradient-to-tr to-transparent"></div>
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={videoUrl || "https://player.vimeo.com/progressive_redirect/playback/772380223/rendition/720p/file.mp4?loc=external"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute right-4 bottom-4 z-20">
              <Button size="sm" variant="secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch demo
              </Button>
            </div>
          </div>
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
    </>
  );
}
