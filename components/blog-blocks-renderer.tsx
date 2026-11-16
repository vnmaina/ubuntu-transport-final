"use client";

import Image from "next/image";
import { Quote, Code, Sparkles, Video } from "lucide-react";

interface BlogContentBlock {
  id: string;
  type: "text" | "image" | "video" | "quote" | "code" | "callout" | "divider";
  content?: string;
  caption?: string;
  data?: Record<string, unknown>;
  order: number;
}

interface BlogBlocksRendererProps {
  blocks: BlogContentBlock[];
}

export function BlogBlocksRenderer({ blocks }: BlogBlocksRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {sortedBlocks.map((block) => (
        <BlogBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlogBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "divider":
      return <DividerBlock block={block} />;
    default:
      return null;
  }
}

function TextBlock({ block }: { block: BlogContentBlock }) {
  return (
    <div className="blog-article-prose">
      <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-lg">{block.content}</div>
      {block.caption && (
        <p className="text-sm text-muted-foreground mt-2 italic border-l-2 border-secondary/40 pl-3">{block.caption}</p>
      )}
    </div>
  );
}

function ImageBlock({ block }: { block: BlogContentBlock }) {
  if (!block.content) return null;

  return (
    <figure className="rounded-2xl overflow-hidden border border-border/80 shadow-md my-8 bg-muted/20">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={block.content}
          alt={block.caption || "Blog article image"}
          fill
          sizes="(max-width: 1024px) 100vw, 850px"
          className="object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="p-3 bg-muted/30 border-t border-border/60">
          <p className="text-xs sm:text-sm text-muted-foreground text-center italic">{block.caption}</p>
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ block }: { block: BlogContentBlock }) {
  const videoType = (block.data?.videoType as string) || "youtube";
  const videoId = extractVideoId(block.content || "", videoType);

  if (videoType === "youtube" && videoId) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden border border-border/80">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (block.data?.videoType === "vimeo" && videoId) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden border border-border/80">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (block.data?.videoType === "custom" && block.content) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden border border-border/80 bg-black flex items-center justify-center">
        <video controls className="w-full h-full">
          <source src={block.content} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden border border-border/80 bg-muted/30 flex items-center justify-center">
      <Video className="w-12 h-12 text-muted-foreground" />
    </div>
  );
}

function extractVideoId(url: string, type: string): string | null {
  if (type === "youtube") {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  }
  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }
  return null;
}

function QuoteBlock({ block }: { block: BlogContentBlock }) {
  return (
    <div className="border-l-4 border-secondary pl-6 pr-4 py-5 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-r-2xl shadow-sm my-6">
      <Quote className="w-8 h-8 text-secondary mb-3 opacity-90" />
      <blockquote className="text-xl sm:text-2xl font-medium text-foreground italic leading-relaxed">
        &ldquo;{block.content}&rdquo;
      </blockquote>
      {block.caption && (
        <cite className="text-sm font-semibold text-muted-foreground mt-3 block not-italic">— {block.caption}</cite>
      )}
    </div>
  );
}

function CodeBlock({ block }: { block: BlogContentBlock }) {
  return (
    <div className="bg-slate-950 rounded-xl overflow-hidden border border-border/80">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-border/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <Code className="w-4 h-4 text-muted-foreground" />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono">{block.content}</code>
      </pre>
      {block.caption && (
        <div className="px-4 py-2 bg-slate-900 border-t border-border/50">
          <p className="text-xs text-muted-foreground">{block.caption}</p>
        </div>
      )}
    </div>
  );
}

function CalloutBlock({ block }: { block: BlogContentBlock }) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent rounded-2xl p-6 border border-primary/20 shadow-sm my-6">
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-foreground font-semibold text-lg leading-snug">{block.content}</p>
          {block.caption && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{block.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DividerBlock({ block }: { block: BlogContentBlock }) {
  return (
    <div className="border-t border-border/80">
      {block.caption && (
        <div className="text-center py-4">
          <span className="text-sm font-medium text-muted-foreground">{block.caption}</span>
        </div>
      )}
    </div>
  );
}
