"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Video,
  Share2,
  Copy,
  Check,
  Phone,
  MessageCircle,
  Mail,
  Car,
  ArrowUpRight,
  FileText,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  List,
  BookOpen,
  Hash,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogBlocksRenderer } from "@/components/blog-blocks-renderer";
import {
  FacebookIcon,
  XIcon,
  LinkedinIcon,
} from "@/components/ui/brand-icons";
import type { Doc } from "@/convex/_generated/dataModel";

interface BlogPostViewProps {
  post: Doc<"blogPosts">;
  category?: {
    name: string;
    slug: string;
    icon?: string;
    color?: string;
  } | null;
  relatedPosts?: Doc<"blogPosts">[];
  relatedServices?: Doc<"services">[];
  prevPost?: Doc<"blogPosts"> | null;
  nextPost?: Doc<"blogPosts"> | null;
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function BlogPostView({
  post,
  category,
  relatedPosts = [],
  relatedServices = [],
  prevPost,
  nextPost,
}: BlogPostViewProps) {
  // ── Reading Progress & Scroll to Top ─────────────────────────
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
      setShowScrollTop(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Table of Contents (TOC) Extraction ─────────────────────────
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    headings.forEach((el, index) => {
      let id = el.id;
      if (!id) {
        const textSlug = (el.textContent || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        id = textSlug ? `section-${textSlug}-${index}` : `section-${index}`;
        el.id = id;
      }
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setToc(items);

    // Scroll spy for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible && visible.target.id) {
          setActiveHeadingId(visible.target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [post.content, post.contentBlocks]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - topOffset, behavior: "smooth" });
      setActiveHeadingId(id);
    }
  };

  // ── Share Helpers ─────────────────────────────────────────────
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${post.title} — Ubuntu Transport & Safaris`;
  const shareText = encodeURIComponent(shareTitle);
  const shareLink = encodeURIComponent(shareUrl);

  const socials = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${shareLink}`,
      className: "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm hover:shadow-md",
      Icon: MessageCircle,
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareText}`,
      className: "bg-black hover:bg-neutral-800 text-white shadow-sm hover:shadow-md",
      Icon: XIcon,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`,
      className: "bg-[#0A66C2] hover:bg-[#0855a1] text-white shadow-sm hover:shadow-md",
      Icon: LinkedinIcon,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
      className: "bg-[#1877F2] hover:bg-[#1464cc] text-white shadow-sm hover:shadow-md",
      Icon: FacebookIcon,
    },
    {
      name: "Email",
      href: `mailto:?subject=${shareText}&body=${shareLink}`,
      className: "bg-slate-700 hover:bg-slate-800 text-white shadow-sm hover:shadow-md",
      Icon: Mail,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const whatsappInquiryUrl = `https://wa.me/254728798589?text=${encodeURIComponent(
    `Hello Ubuntu Transport, I am reading "${post.title}" and would like to inquire about transport and safari services in Kenya.`
  )}`;

  return (
    <div className="min-h-screen bg-background relative selection:bg-secondary/20 selection:text-foreground">
      {/* ── Top Reading Progress Bar ─────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-primary via-secondary to-primary reading-progress-glow transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* ── Editorial Hero Header ───────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary/[0.07] via-secondary/[0.02] to-background pt-8 pb-12 sm:pb-16 border-b border-border/50">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 ">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link
                href="/"
                className="hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link
                href="/blogs"
                className="hover:text-primary transition-colors font-medium"
              >
                Blog
              </Link>
              {category && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="text-foreground font-semibold line-clamp-1 max-w-[200px]">
                    {category.name}
                  </span>
                </>
              )}
            </nav>

            <Link href="/blogs">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 border-border/80 bg-card/70 backdrop-blur-sm hover:border-primary hover:text-primary hover:bg-card shadow-xs transition-all group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to all articles
              </Button>
            </Link>
          </div>

      
          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-[1.14] font-heading max-w-5xl">
            {post.title}
          </h1>

          {/* Excerpt / Lead Deck */}
          {post.excerpt && (
            <p className="text-lg text-muted-foreground/90 font-normal leading-relaxed mt-5 max-w-4xl">
              {post.excerpt}
            </p>
          )}

          {/* Byline & Meta Bar */}
       {/* Byline & Meta Bar */}
<div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
  {/* Author info */}
  <div className="flex items-center gap-2">
    <div className="relative">
      {post.author.avatar ? (
        <Image
          src={post.author.avatar}
          alt={post.author.name}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      ) : (
        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
          {post.author.name.slice(0, 2).toUpperCase()}
        </div>
      )}

      <span
        className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border border-background"
        title="Verified Author"
      />
    </div>

    <div className="leading-tight">
      <p className="font-semibold text-foreground text-xs tracking-tight">
        {post.author.name}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">
        {post.author.role || "Kenya Safari & Logistics Expert"}
      </p>
    </div>
  </div>

  {/* Metadata */}
  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
    {post.publishedAt && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border/50">
        <Calendar className="size-3 text-primary" />
        <span>
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    )}

    {post.readTime && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border/50">
        <Clock className="size-3 text-secondary" />
        <span>{post.readTime}</span>
      </div>
    )}

    {post.videoUrl && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
        <Video className="size-3" />
        <span>Video</span>
      </div>
    )}

    {/* Share */}
    <button
      type="button"
      onClick={handleCopyLink}
      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/60 hover:border-primary hover:text-primary transition-colors text-[11px] font-medium cursor-pointer"
      title="Copy link to share"
    >
      {copied ? (
        <>
          <Check className="size-3 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400">
            Copied
          </span>
        </>
      ) : (
        <>
          <Share2 className="size-3" />
          <span>Share</span>
        </>
      )}
    </button>
  </div>
</div>
        </div>
      </header>

      {/* ── Cinematic Featured Media (Full Width Frame) ──────────── */}
      {(post.featuredImage || post.videoUrl) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-10 mb-10">
          <div className="relative group">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/25 via-secondary/20 to-primary/25 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity -z-10" />

            {/* Video or Image */}
            {post.videoUrl ? (
              <div className="aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/70 bg-black">
                {post.videoType === "youtube" && (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(post.videoUrl)}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
                {post.videoType === "vimeo" && (
                  <iframe
                    src={`https://player.vimeo.com/video/${extractVimeoId(post.videoUrl)}`}
                    title="Vimeo video"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
                {post.videoType === "custom" && (
                  <video controls className="w-full h-full object-cover">
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              post.featuredImage && (
                <div className="aspect-[16/9] md:aspect-[21/9] max-h-[560px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/70 bg-muted/30 relative">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    priority
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* ── Article Body & Sticky Sidebar Grid ───────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Main Column */}
          <article className="lg:col-span-8 space-y-4 min-w-0" ref={contentRef}>
            {/* Rich Text Main Content */}
            {post.content && (
              <div
                className="blog-article-prose rte-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Modular Content Blocks */}
            {post.contentBlocks && post.contentBlocks.length > 0 && (
              <div className="pt-6 border-t border-border/60">
                <BlogBlocksRenderer blocks={post.contentBlocks} />
              </div>
            )}

            {/* Tags Cloud */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-border/70">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Topics & Keywords
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-card border border-border/80 text-foreground hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all shadow-2xs"
                    >
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Author Spotlight Box ─────────────────────────────── */}
            <div className="pt-6 border-t border-border/70">
              <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {post.author.avatar ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-primary/20 shrink-0 shadow-md">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl ring-2 ring-primary/20 shrink-0">
                      {post.author.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Written by
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Ubuntu Team
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">{post.author.name}</h3>

                    {post.author.role && (
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {post.author.role}
                      </p>
                    )}

                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground/90 leading-relaxed mb-4">
                        {post.author.bio}
                      </p>
                    )}

                    {/* Author socials */}
                    <div className="flex flex-wrap items-center gap-2">
                      {post.author.email && (
                        <a
                          href={`mailto:${post.author.email}`}
                          className="p-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Email author"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {post.author.linkedin && (
                        <a
                          href={post.author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-[#0A66C2] transition-colors"
                          title="LinkedIn profile"
                        >
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                      )}
                      {post.author.twitter && (
                        <a
                          href={post.author.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Twitter / X profile"
                        >
                          <XIcon className="w-4 h-4" />
                        </a>
                      )}
                      {post.author.website && (
                        <a
                          href={post.author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="Author website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ── Sticky Sidebar Column ─────────────────────────────── */}
          <aside className="lg:col-span-4 min-w-0">
            <div className="sticky top-24 space-y-6">
              {/* Widget 1: Table of Contents (TOC) */}
              {toc.length > 0 ? (
                <div className="border border-border/80 rounded-3xl p-6 bg-card shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                      <List className="w-4 h-4 text-primary" /> Table of Contents
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {Math.round(readingProgress)}% read
                    </span>
                  </div>

                  <nav className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 text-sm scrollbar-thin">
                    {toc.map((item) => {
                      const isActive = activeHeadingId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToHeading(item.id)}
                          className={`w-full text-left py-1.5 px-3 rounded-lg text-xs leading-snug transition-all flex items-start gap-2 ${
                            item.level === 3 ? "pl-5" : ""
                          } ${
                            isActive
                              ? "bg-primary/10 text-primary font-bold border-l-2 border-secondary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            isActive ? "bg-secondary" : "bg-muted-foreground/40"
                          }`} />
                          <span className="line-clamp-2">{item.text}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ) : (
                /* Fallback Article Highlights widget */
                <div className="border border-border/80 rounded-3xl p-6 bg-card shadow-sm">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
                    <BookOpen className="w-4 h-4 text-primary" /> Guide Highlights
                  </h3>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span>Reading Time</span>
                      <span className="font-semibold text-foreground">{post.readTime || "5 min read"}</span>
                    </div>
                    {category && (
                      <div className="flex items-center justify-between py-1 border-b border-border/40">
                        <span>Category</span>
                        <span className="font-semibold text-foreground">{category.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span>Publisher</span>
                      <span className="font-semibold text-foreground">Ubuntu Logistics</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Coverage</span>
                      <span className="font-semibold text-foreground">Kenya & East Africa</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget 2: Ubuntu Safari & Transport Booking Card (CTA) */}
              <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/20 bg-gradient-to-br from-[#262559] via-[#1f1e49] to-[#121133] text-white shadow-xl group">
                {/* Decorative Brand Accent Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D72533]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#262559]/60 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D72533] text-white mb-4 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Trusted Travel Partner
                  </div>

                  <h3 className="text-xl font-extrabold text-white leading-snug mb-2 font-heading">
                    Explore Kenya with Ubuntu Transport
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mb-5">
                    Premium safari 4x4 Land Cruisers, VIP airport pickups, corporate van rentals & custom Kenya tour packages.
                  </p>

                  <div className="space-y-2.5">
                    {/* Direct WhatsApp Contact */}
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>

                    {/* Direct Call */}
                    <a
                      href="tel:+254728798589"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D72533]" />
                      Call +254 728 798589
                    </a>

                    {/* Instant Quote Link */}
                    <Link
                      href="/collections/services"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
                    >
                      <span>Request custom quotation</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Widget 3: Quick Share */}
              <div className="border border-border/80 rounded-3xl p-6 bg-card shadow-sm">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Share2 className="w-4 h-4 text-primary" /> Share Article
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Pass this insight along to your network
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {socials.map(({ name, href, className, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={`Share on ${name}`}
                      aria-label={`Share on ${name}`}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-transform hover:scale-110 ${className}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`w-full mt-3 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${
                    copied
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-muted/50 hover:bg-muted border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Link Copied!" : "Copy Article Link"}
                </button>
              </div>

              {/* Widget 4: Related Services */}
              {relatedServices.length > 0 && (
                <div className="border border-border/80 rounded-3xl p-6 bg-card shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary" /> Transport Solutions
                    </h3>
                    <Link
                      href="/services"
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {relatedServices.map((service) => (
                      <Link
                        key={service._id}
                        href="/services"
                        className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 border border-border/50 hover:border-primary/40 transition-all group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden relative">
                          {service.imageUrl ? (
                            <Image
                              src={service.imageUrl}
                              alt={service.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : service.icon ? (
                            <span className="text-xl">{service.icon}</span>
                          ) : (
                            <Car className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {service.name}
                          </p>
                          {service.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>

                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* ── Related Stories Section ──────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-border/70 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Continue Reading
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading mt-1">
                  Related Stories & Kenya Guides
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Hand-crafted travel advice, destination guides, and logistics expertise from Ubuntu Transport.
                </p>
              </div>

              <Link href="/blogs">
                <Button variant="outline" className="rounded-full gap-2 border-border/80 hover:border-primary hover:text-primary">
                  View all stories <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related._id}
                  href={`/blogs/${related.slug}`}
                  className="group rounded-3xl border border-border/80 overflow-hidden bg-card shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                    {related.featuredImage ? (
                      <Image
                        src={related.featuredImage}
                        alt={related.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-secondary/10">
                        <FileText className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {related.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-xs">
                        {related.category}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-foreground text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                          {related.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-5 mt-4 border-t border-border/50 text-xs text-muted-foreground">
                      {related.publishedAt ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(related.publishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      ) : (
                        <span />
                      )}

                      {related.readTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          {related.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Floating Scroll to Top Button ───────────────────────── */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-secondary hover:scale-110 transition-all flex items-center justify-center cursor-pointer animate-in fade-in zoom-in-75 duration-200"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ── Embed Helper Functions ─────────────────────────────────────
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}
