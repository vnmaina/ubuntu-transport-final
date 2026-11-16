"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  ExternalLink,
  Clock,
  Users,
  Mail,
  Tag,
  Link as LinkIcon,
  Share2,
  Phone,
  FileText,
  Send,
  Copy,
  Check,
  MessageCircle,
  CalendarDays,
  LayoutGrid,
  Star,
  HelpCircle,
  Layers,
  Images,
  MessageSquareQuote,
} from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GalleryRenderer } from "@/components/gallery-renderer";
import { ContentBlocksRenderer } from "@/components/content-blocks-renderer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { stripHtml } from "@/lib/seo";
import {
  FacebookIcon,
  XIcon,
  LinkedinIcon,
} from "@/components/ui/brand-icons";

const ICON_NAME_TO_EMOJI: Record<string, string> = {
  briefcase: "💼",
  folder: "📁",
  users: "👥",
  package: "📦",
  services: "💼",
  projects: "📁",
  team: "👥",
  products: "📦",
};

function getIconDisplay(icon?: string): string {
  if (!icon) return "📦";
  if (icon.length > 1 && !/^[a-zA-Z]+$/.test(icon)) return icon;
  return ICON_NAME_TO_EMOJI[icon] || "📦";
}

interface ItemMetadata {
  duration?: string;
  features?: string[];
  client?: string;
  projectDate?: string;
  technologies?: string[];
  projectUrl?: string;
  role?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  sku?: string;
  stock?: number;
}

interface CollectionItemData {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  icon?: string;
  tags?: string[];
  gallery?: string[];
  galleryType?: "grid" | "carousel" | "masonry" | "slider";
  contentBlocks?: Array<{
    id: string;
    type: "hero" | "timeline" | "specifications" | "testimonials" | "cta" | "image" | "text" | "divider";
    title?: string;
    content?: string;
    data?: Record<string, unknown>;
    order: number;
  }>;
  metadata?: ItemMetadata;
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ author: string; rating: number; comment: string; date: string }>;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

interface RelatedItemData {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  tags?: string[];
}

interface ItemViewProps {
  collection: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  };
  item: CollectionItemData;
  relatedItems?: RelatedItemData[];
  organization?: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
}

function SectionHeading({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export function ItemView({ collection, item, relatedItems = [], organization }: ItemViewProps) {
  const { title, description, content, imageUrl, icon, tags, metadata, gallery, galleryType, faq, reviews, contentBlocks } = item;

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  // ── Booking / enquiry form ──────────────────────────────────
  const submitEnquiry = useMutation(api.forms.submitForm);
  const [enquiry, setEnquiry] = useState({ name: "", phone: "", email: "", date: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orgName = organization?.name || "Ubuntu Logistics and Transport";
  const orgPhone = organization?.phone || "+254728798589";
  const orgWhatsapp = (organization?.whatsapp || organization?.phone || "+254728798589").replace(/[^\d]/g, "");
  const orgEmail = organization?.email || "ben@ubuntulogistics.co.ke";

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry.name.trim() || !enquiry.message.trim()) {
      toast.error("Please fill in your name and message");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        formId: `item-enquiry-${collection.slug}-${item.slug}`,
        formData: {
          name: enquiry.name.trim(),
          phone: enquiry.phone.trim(),
          email: enquiry.email.trim(),
          preferredDate: enquiry.date,
          message: enquiry.message.trim(),
          itemTitle: item.title,
          collectionName: collection.name,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        },
      });
      toast.success("Enquiry sent! We'll get back to you shortly.");
      setEnquiry({ name: "", phone: "", email: "", date: "", message: "" });
    } catch {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Share helpers ───────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`${item.title} — ${collection.name}`);
  const shareLink = encodeURIComponent(shareUrl);

  const socials = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
      className: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
      Icon: FacebookIcon,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareText}`,
      className: "bg-black hover:bg-neutral-800 text-white",
      Icon: XIcon,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`,
      className: "bg-[#0A66C2] hover:bg-[#0958a8] text-white",
      Icon: LinkedinIcon,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${shareLink}`,
      className: "bg-[#25D366] hover:bg-[#1fb857] text-white",
      Icon: MessageCircle,
    },
    {
      name: "Email",
      href: `mailto:?subject=${shareText}&body=${shareLink}`,
      className: "bg-slate-600 hover:bg-slate-700 text-white",
      Icon: Mail,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[#1a1560]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #D72533 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3d3a8c 0%, transparent 50%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/60 flex-wrap mb-8">
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <Link href={`/collections/${collection.slug}`} className="hover:text-white transition-colors">{collection.name}</Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px] md:max-w-xs">{title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            {/* Icon / thumb */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl md:text-6xl shadow-2xl shrink-0">
              {icon ? getIconDisplay(icon) : <Layers className="w-10 h-10 text-white/80" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">{collection.name}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">{title}</h1>
              {description && (
                <div
                  className="text-white/75 text-base md:text-lg max-w-3xl leading-relaxed prose prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Hero actions */}
            <div className="flex flex-col gap-3 shrink-0">
              {reviews && reviews.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-white text-sm font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-white/60 text-xs">({reviews.length})</span>
                </div>
              )}
              <div className="flex gap-2">
                <Link href={`/collections/${collection.slug}`}>
                  <Button size="sm" className="rounded-xl gap-2 bg-white text-primary hover:bg-white/90 font-semibold">
                    <ArrowLeft className="w-4 h-4" /> All {collection.name}
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main column — everything in one flow */}
          <div className="lg:col-span-2 space-y-14">

            {/* Featured image */}
            {imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/80 shadow-sm">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article content */}
            {content && (
              <section>
                <SectionHeading icon={FileText} title="Overview" subtitle="Detailed information and specifications" />
                <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">
                  <MarkdownRenderer content={content} />
                </div>
              </section>
            )}

            {/* Details / metadata */}
            {metadata && (
              <section>
                <SectionHeading icon={Layers} title="Details" />
                <div className="space-y-6">
                  {(collection.slug === 'services' || collection.slug === 'products' || collection.slug === 'fleet' || collection.slug === 'destinations') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {metadata.duration && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-semibold text-foreground">{metadata.duration}</p>
                          </div>
                        </div>
                      )}
                      {metadata.client && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Ideal For</p>
                            <p className="font-semibold text-foreground">{metadata.client}</p>
                          </div>
                        </div>
                      )}
                      {metadata.features && metadata.features.length > 0 && (
                        <div className="sm:col-span-2 p-6 bg-muted/50 rounded-xl border border-border/50">
                          <p className="text-sm text-muted-foreground mb-4 font-medium">Key Features</p>
                          <ul className="space-y-3">
                            {metadata.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-sm">✓</span>
                                </div>
                                <span className="text-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {collection.slug === 'projects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {metadata.client && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Client</p>
                            <p className="font-semibold text-foreground">{metadata.client}</p>
                          </div>
                        </div>
                      )}
                      {metadata.projectDate && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Project Date</p>
                            <p className="font-semibold text-foreground">{new Date(metadata.projectDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      {metadata.projectUrl && (
                        <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Project URL</p>
                            <a href={metadata.projectUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline block truncate">
                              {metadata.projectUrl}
                            </a>
                          </div>
                        </div>
                      )}
                      {metadata.technologies && metadata.technologies.length > 0 && (
                        <div className="sm:col-span-2 p-6 bg-muted/50 rounded-xl border border-border/50">
                          <p className="text-sm text-muted-foreground mb-4 font-medium">Technologies</p>
                          <div className="flex flex-wrap gap-2">
                            {metadata.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/20 transition-colors">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {collection.slug === 'team' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {metadata.role && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-semibold text-foreground">{metadata.role}</p>
                          </div>
                        </div>
                      )}
                      {metadata.email && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a href={`mailto:${metadata.email}`} className="font-semibold text-primary hover:underline block truncate">
                              {metadata.email}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="sm:col-span-2 flex gap-4">
                        {metadata.linkedin && (
                          <a href={metadata.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/80 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <LinkIcon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">LinkedIn</span>
                          </a>
                        )}
                        {metadata.twitter && (
                          <a href={metadata.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/80 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <LinkIcon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">Twitter</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {collection.slug === 'products' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {metadata.sku && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Tag className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">SKU</p>
                            <p className="font-semibold text-foreground">{metadata.sku}</p>
                          </div>
                        </div>
                      )}
                      {metadata.stock !== undefined && (
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metadata.stock > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                            <div className={`w-5 h-5 rounded-full ${metadata.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Stock Status</p>
                            <p className={`font-semibold ${metadata.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metadata.stock > 0 ? `${metadata.stock} available` : 'Out of stock'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Gallery */}
            {gallery && gallery.length > 0 && (
              <section>
                <SectionHeading icon={Images} title="Gallery" subtitle={`${gallery.length} image${gallery.length !== 1 ? 's' : ''}`} />
                <GalleryRenderer images={gallery} type={galleryType || "grid"} />
              </section>
            )}

            {/* Content blocks */}
            {contentBlocks && contentBlocks.length > 0 && (
              <section>
                <SectionHeading icon={Layers} title="Highlights" subtitle="Additional sections and details" />
                <ContentBlocksRenderer blocks={contentBlocks} />
              </section>
            )}

            {/* FAQ */}
            {faq && faq.length > 0 && (
              <section>
                <SectionHeading icon={HelpCircle} title="Frequently Asked Questions" subtitle={`${faq.length} question${faq.length !== 1 ? 's' : ''}`} />
                <Accordion className="w-full">
                  {faq.map((faqItem, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-border/80 rounded-xl mb-3 bg-card px-5">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium">{faqItem.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pl-7 pb-2">{faqItem.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <section>
                <SectionHeading
                  icon={MessageSquareQuote}
                  title="Reviews & Testimonials"
                  subtitle={`${reviews.length} review${reviews.length !== 1 ? 's' : ''} · ${avgRating.toFixed(1)} average rating`}
                />
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="border border-border/80 rounded-2xl p-6 bg-card shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related items */}
            {relatedItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <SectionHeading icon={LayoutGrid} title="You may also like" subtitle={`More from ${collection.name}`} />
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0"
                  >
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedItems.map((related) => (
                    <Link
                      key={related._id}
                      href={`/collections/${collection.slug}/${related.slug}`}
                      className="group border border-border/80 rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                    >
                      <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                        {related.imageUrl ? (
                          <img
                            src={related.imageUrl}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-5xl">{getIconDisplay(related.icon)}</span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {related.title}
                        </h3>
                        {related.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {stripHtml(related.description)}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3 group-hover:gap-2 transition-all">
                          View details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Book / Enquire form */}
              <div className="border border-border/80 rounded-2xl p-6 bg-card shadow-sm">
                <h3 className="font-semibold text-lg">Book / Enquire Now</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-5">
                  Interested in {item.title}? Send us your details and we&apos;ll get back to you.
                </p>
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-name" className="text-xs">Full Name *</Label>
                    <Input
                      id="enq-name"
                      value={enquiry.name}
                      onChange={(e) => setEnquiry((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="enq-phone" className="text-xs">Phone</Label>
                      <Input
                        id="enq-phone"
                        type="tel"
                        value={enquiry.phone}
                        onChange={(e) => setEnquiry((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+254 ..."
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enq-email" className="text-xs">Email</Label>
                      <Input
                        id="enq-email"
                        type="email"
                        value={enquiry.email}
                        onChange={(e) => setEnquiry((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@email.com"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-date" className="text-xs flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" /> Preferred Date
                    </Label>
                    <Input
                      id="enq-date"
                      type="date"
                      value={enquiry.date}
                      onChange={(e) => setEnquiry((p) => ({ ...p, date: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-message" className="text-xs">Message *</Label>
                    <Textarea
                      id="enq-message"
                      value={enquiry.message}
                      onChange={(e) => setEnquiry((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your requirements..."
                      rows={3}
                      required
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl gap-2 font-semibold">
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </Button>
                </form>

                {/* Direct contact */}
                <div className="mt-5 pt-5 border-t border-border/60 space-y-2.5">
                  <a
                    href={`tel:${orgPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Call us</p>
                      <p className="text-sm font-semibold truncate">{orgPhone}</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${orgWhatsapp}?text=${encodeURIComponent(`Hi ${orgName}, I'm interested in ${item.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="text-sm font-semibold truncate">Chat with us</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${orgEmail}?subject=${encodeURIComponent(`Enquiry: ${item.title}`)}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold truncate">{orgEmail}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Share */}
              <div className="border border-border/80 rounded-2xl p-6 bg-card shadow-sm">
                <h3 className="font-semibold mb-1">Share this</h3>
                <p className="text-sm text-muted-foreground mb-4">Spread the word about {item.title}</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {socials.map(({ name, href, className, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={`Share on ${name}`}
                      aria-label={`Share on ${name}`}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-transform hover:scale-110 hover:shadow-md ${className}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy link"
                    aria-label="Copy link"
                    className={`aspect-square rounded-xl flex items-center justify-center transition-transform hover:scale-110 hover:shadow-md ${
                      copied ? "bg-emerald-500 text-white" : "bg-slate-600 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collection card */}
              <div className="border border-border/80 rounded-2xl p-6 bg-card shadow-sm">
                <h3 className="font-semibold mb-4">Part of {collection.name}</h3>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl border border-primary/20">
                    {getIconDisplay(collection.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{collection.name}</p>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {stripHtml(collection.description)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
