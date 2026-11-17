import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Sparkles, Zap, ShieldCheck, Headphones } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface SplitContentHeroProps {
  title?: string;
  highlightedTitle?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  badge?: string;
  features?: string[];
}

export default function SplitContentHero({
  title = "Transform your workflow",
  highlightedTitle = "with our platform",
  subtitle = "Our all-in-one solution helps high-performing teams collaborate, manage projects, and ship exceptional results in half the time.",
  ctaText = "Start for free",
  ctaLink = "#",
  secondaryCtaText = "Book a demo",
  secondaryCtaLink = "#demo",
  imageUrl = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  badge = "New Release 2.0",
  features = [
    "No credit card required",
    "Free 14-day trial",
    "Cancel anytime",
    "24/7 priority support",
  ],
}: SplitContentHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* 1. Ambient Background Grid & Soft Radial Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:24px_24px] opacity-35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 -z-10 h-[550px] w-[550px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="via-border absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="container mx-auto px-6 py-20 md:px-8 lg:py-28 2xl:max-w-[1380px]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT COLUMN: Editorial Copy & Conversion Engine */}
          <div className="flex flex-col space-y-7 lg:col-span-7">
            {/* Refined Pill Badge */}
            {badge && (
              <div className="group inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm transition-colors hover:border-primary/40">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{badge}</span>
                <ArrowRight className="h-3 w-3 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            )}

            {/* High-Impact Split Headline */}
           
{/* Glassmorphism Heading */}
<h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl xl:text-6xl">
  {title}{" "}
  {highlightedTitle && (
    <span className="relative mt-2 inline-block overflow-hidden rounded-xl border border-primary/10 bg-white/40 px-3 py-1.5 shadow-lg shadow-primary/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:mt-0 sm:inline-block">
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <span className="relative bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {highlightedTitle}
      </span>
    </span>
  )}
</h1>

{/* Glassmorphism Subtitle */}
{subtitle && (
  <p className="mt-7 max-w-xl rounded-xl border border-border/50 bg-card/40 px-4 py-3 text-base leading-8 text-muted-foreground shadow-sm backdrop-blur-md sm:text-lg">
    {subtitle}
  </p>
)}


            {/* Action Buttons (Properly composed with asChild) */}
            <div className="flex flex-col gap-3.5 pt-1 sm:flex-row sm:items-center">
              <Button
                
                size="lg"
                className="group h-12 rounded-xl px-7 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <Link href={ctaLink}>
                  <span>{ctaText}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              {secondaryCtaText && (
                <Button
                  
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-border/80 bg-background/60 px-7 text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:bg-muted/60"
                >
                  <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                </Button>
              )}
            </div>

            {/* Feature Checklist */}
            {features.length > 0 && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 pt-2 sm:grid-cols-2 max-w-lg">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <span className="text-sm font-medium text-foreground/85">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Separated Social Proof Anchor */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-6">
              <div className="flex -space-x-2.5">
                {[
                  { initials: "JL", bg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" },
                  { initials: "SD", bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
                  { initials: "TK", bg: "bg-amber-500/15 text-amber-600 dark:text-amber-300" },
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-2 ring-background ${avatar.bg}`}
                  >
                    {avatar.initials}
                  </div>
                ))}
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-background">
                  +8k
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Trusted by <span className="font-semibold text-foreground">10,000+</span> teams worldwide
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Framed Visual Showcase */}
          <div className="relative lg:col-span-5">
            {/* Outer Glass Bezel Frame */}
            <div className="relative mx-auto max-w-[540px] rounded-2xl border border-border/70 bg-muted/30 p-2.5 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={imageUrl}
                  alt="Team collaborating on digital projects"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                
              fill
              sizes="100vw"
            />
                {/* Rich Vignette Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Floating Top-Right Live Metric Pill */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-background/85 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>+24% Velocity</span>
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                </div>

                {/* Bottom Glassmorphic HUD Metrics */}
                <div className="absolute inset-x-4 bottom-4">
                  <div className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-white/15 bg-background/90 p-3.5 shadow-xl backdrop-blur-md">
                    <div className="px-2 text-center sm:text-left">
                      <div className="text-[11px] font-medium text-muted-foreground">
                        Active Projects
                      </div>
                      <div className="mt-0.5 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                        86
                      </div>
                    </div>
                    <div className="px-3 text-center sm:text-left">
                      <div className="text-[11px] font-medium text-muted-foreground">
                        Team Members
                      </div>
                      <div className="mt-0.5 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                        32
                      </div>
                    </div>
                    <div className="px-3 text-center sm:text-left">
                      <div className="text-[11px] font-medium text-muted-foreground">
                        Completion
                      </div>
                      <div className="mt-0.5 text-lg font-extrabold tracking-tight text-primary sm:text-xl">
                        92%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient Glow Behind Card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -bottom-8 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}