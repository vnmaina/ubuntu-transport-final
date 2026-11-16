"use client";

import HeroSectionAnimatedGradient from './marketing/hero-sections/animated-gradient';
import SplitContentHero from './marketing/hero-sections/split-content-hero';
import GradientMeshHero from './marketing/hero-sections/gradient-mesh-hero';
import VideoBackgroundHero from './marketing/hero-sections/video-background-hero';
import ImageCarouselHero from './marketing/hero-sections/image-carousel-hero';
import CountdownHero from './marketing/hero-sections/countdown-hero';
import SplitWithVideo from './marketing/hero-sections/split-with-video';
import With3DMockup from './marketing/hero-sections/with-3d-mockup';
import { Hero } from './Hero';
import { MediaJsonLd } from './media-seo';

export interface HeroBlockProps {
  variant?: 'animated-gradient' | 'split-content' | 'gradient-mesh' | 'video-background' | 'image-carousel' | 'countdown' | 'split-video' | '3d-mockup' | 'simple';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  badge?: string;
  features?: string[];
  tags?: string[];
  imageAlt?: string;
  imageTitle?: string;
  imageCredit?: string;
  imageLink?: string;
  videoTitle?: string;
  videoDescription?: string;
}

export function HeroBlock({
  variant = 'split-content',
  title = "Transform Your Digital Experience",
  subtitle = "Discover our powerful platform with cutting-edge features designed to elevate your workflow and boost productivity.",
  ctaText = "Get Started",
  ctaLink = "#",
  imageUrl = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  imageUrls = [],
  videoUrl,
  badge = "New Release",
  features = ["Free 14-day trial", "No credit card required", "Cancel anytime"],
  tags = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Radix UI"],
  imageAlt,
  imageTitle,
  imageCredit,
  imageLink,
  videoTitle,
  videoDescription,
}: HeroBlockProps) {
  const commonProps = { title, subtitle, ctaText, ctaLink };

  // Media SEO: emit ImageObject/VideoObject structured data for hero media
  const mediaItems = [
    ...(imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [])
      .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
      .map((url) => ({
        url,
        title: imageTitle || title,
        alt: imageAlt || undefined,
        credit: imageCredit || undefined,
        link: imageLink || undefined,
      })),
    ...(videoUrl
      ? [{
          url: videoUrl,
          type: 'video' as const,
          title: videoTitle || title,
          alt: videoDescription || imageAlt || undefined,
        }]
      : []),
  ];

  const renderVariant = () => {
    switch (variant) {
      case 'animated-gradient':
        return <HeroSectionAnimatedGradient {...commonProps} badge={badge} tags={tags} />;
      case 'gradient-mesh':
        return <GradientMeshHero {...commonProps} badge={badge} features={features} />;
      case 'video-background':
        return <VideoBackgroundHero {...commonProps} videoUrl={videoUrl} />;
      case 'image-carousel':
        return <ImageCarouselHero {...commonProps} imageUrl={imageUrl} imageUrls={imageUrls} />;
      case 'countdown':
        return <CountdownHero {...commonProps} />;
      case 'split-video':
        return <SplitWithVideo {...commonProps} videoUrl={videoUrl} />;
      case '3d-mockup':
        return <With3DMockup {...commonProps} imageUrl={imageUrl} />;
      case 'simple':
        return <Hero {...commonProps} />;
      case 'split-content':
      default:
        return <SplitContentHero {...commonProps} imageUrl={imageUrl} badge={badge} features={features} />;
    }
  };

  return (
    <>
      <MediaJsonLd items={mediaItems} name={title} description={subtitle} />
      {renderVariant()}
    </>
  );
}
