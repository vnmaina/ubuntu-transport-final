"use client";

import { Calendar, ChevronRight, Star, ArrowRight, Check, FileText, Image as ImageIcon, Layers, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBlock as MarketingHeroBlock } from "@/components/blocks/HeroBlock";
import Image from "next/image";

interface ContentBlock {
  id: string;
  type: "hero" | "timeline" | "specifications" | "testimonials" | "cta" | "image" | "text" | "divider";
  title?: string;
  content?: string;
  data?: any;
  order: number;
}

interface ContentBlocksRendererProps {
  blocks: ContentBlock[];
}

export function ContentBlocksRenderer({ blocks }: ContentBlocksRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {sortedBlocks.map((block) => (
        <ContentBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function ContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "timeline":
      return <TimelineBlock block={block} />;
    case "specifications":
      return <SpecificationsBlock block={block} />;
    case "testimonials":
      return <TestimonialsBlock block={block} />;
    case "cta":
      return <CTABlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "divider":
      return <DividerBlock block={block} />;
    default:
      return null;
  }
}

function HeroBlock({ block }: { block: ContentBlock }) {
  return (
    <MarketingHeroBlock
      variant="split-content"
      title={block.title || "Hero Title"}
      subtitle={block.content || "Hero subtitle content"}
      ctaText={block.data?.ctaText || "Get Started"}
      ctaLink={block.data?.ctaLink || "#"}
      imageUrl={block.content || "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"}
      badge={block.data?.badge || "Featured"}
      features={block.data?.features || ["Feature 1", "Feature 2", "Feature 3"]}
    />
  );
}

function TimelineBlock({ block }: { block: ContentBlock }) {
  const timelineData = block.data?.timeline || [];
  
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
      {block.title && (
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> {block.title}
        </h3>
      )}
      <div className="space-y-6">
        {timelineData.map((item: any, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              {index !== timelineData.length - 1 && (
                <div className="w-0.5 h-full bg-border/50 min-h-12" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="text-sm text-muted-foreground mb-1">{item.date}</div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecificationsBlock({ block }: { block: ContentBlock }) {
  const specs = block.data?.specifications || [];
  
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
      {block.title && (
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> {block.title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-xl border border-border/50">
            <span className="text-sm text-muted-foreground">{spec.label}</span>
            <span className="font-semibold text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsBlock({ block }: { block: ContentBlock }) {
  const testimonials = block.data?.testimonials || [];
  
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
      {block.title && (
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" /> {block.title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="p-6 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {testimonial.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
      {block.title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{block.title}</h2>
      )}
      {block.content && (
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">{block.content}</p>
      )}
      {block.data?.ctaText && (
        <Button variant="secondary" size="lg" className="bg-background text-foreground hover:bg-background/90">
          {block.data.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

function ImageBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/80">
      <div className="relative aspect-[4/3]">
        <Image
          src={block.content ?? ""}
          alt={block.title || "Image"}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      {block.title && (
        <div className="p-4 bg-background">
          <p className="font-semibold text-foreground">{block.title}</p>
        </div>
      )}
    </div>
  );
}

function TextBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
      {block.title && (
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> {block.title}
        </h3>
      )}
      {block.content && (
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{block.content}</p>
      )}
    </div>
  );
}

function DividerBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="border-t border-border/80">
      {block.title && (
        <div className="text-center py-4">
          <span className="text-sm font-medium text-muted-foreground">{block.title}</span>
        </div>
      )}
    </div>
  );
}
