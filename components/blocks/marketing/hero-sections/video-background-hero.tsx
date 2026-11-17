"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";

interface VideoBackgroundHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
}

export default function VideoBackgroundHero({ title, subtitle, ctaText, ctaLink, videoUrl }: VideoBackgroundHeroProps) {
  const [videoModal, setVideoModal] = useState(false);

  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-black/90">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
      >
        <source
          src={videoUrl || "https://player.vimeo.com/progressive_redirect/playback/772380223/rendition/720p/file.mp4?loc=external"}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>

      {/* Content */}
      <div className="relative container mx-auto flex min-h-[85vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-6 md:py-32 2xl:max-w-[1400px]">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-sm font-medium text-white">
            Introducing Our Latest Innovation
          </span>
        </div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tighter text-white md:text-5xl/tight lg:text-6xl/tight">
          {title || "Revolutionize Your Digital Experience with Cutting-Edge Technology"}
        </h1>
        <p className="max-w-[700px] text-white/80 md:text-xl/relaxed">
          {subtitle || "Discover how our platform is changing the way people interact with technology, creating seamless experiences that drive results."}
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" variant={'secondary'} >
            <Link href={ctaLink || "#"}>{ctaText || "Get Started Free"}
              <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => setVideoModal(true)}
          >
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-1">
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
              className="h-5 w-5"
            >
              <path d="M12 2H2v10h10V2Z" />
              <path d="M22 12H12v10h10V12Z" />
              <path d="M22 2h-5v5h5V2Z" />
              <path d="M7 12H2v5h5v-5Z" />
            </svg>
            <span>Modern Interface</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30"></div>
          <div className="flex items-center gap-1">
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
              className="h-5 w-5"
            >
              <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
              <line x1="18" x2="12" y1="9" y2="15" />
              <line x1="12" x2="18" y1="9" y2="15" />
            </svg>
            <span>Enterprise Ready</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/30"></div>
          <div className="flex items-center gap-1">
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
              className="h-5 w-5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <span>Secure by Design</span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setVideoModal(false)}
        >
          <div
            className="relative w-full max-w-4xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-white/80"
              onClick={() => setVideoModal(false)}
            >
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
                className="h-6 w-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Product Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
