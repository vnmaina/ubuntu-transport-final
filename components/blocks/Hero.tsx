import React from 'react';

export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badgeText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function Hero({
  title = "Welcome to Our Platform",
  subtitle = "Discover amazing features and services built to scale your workflow effortlessly.",
  ctaText = "Get Started",
  ctaLink = "#",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "#features",
  badgeText = "New: Version 2.0 is live",
  backgroundColor = "from-slate-950 via-slate-900 to-indigo-950",
  textColor = "text-white",
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${backgroundColor} ${textColor} py-28 sm:py-36 px-6 isolate`}
    >
      {/* 1. Ambient Background Glow & Grid Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow Pill Badge */}
        {badgeText && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Headline with Optical Tightening & Subtle Gradient */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-b from-white via-white to-slate-300 bg-clip-text text-transparent pb-2">
          {title}
        </h1>

        {/* Subtitle with Controlled Line Length (Measure) */}
        {subtitle && (
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-slate-300/90 font-normal">
            {subtitle}
          </p>
        )}

        {/* Action Group (Primary + Secondary CTA) */}
        {(ctaText || secondaryCtaText) && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaText && (
              <a
                href={ctaLink}
                className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-indigo-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all duration-200"
              >
                <span>{ctaText}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}

            {secondaryCtaText && (
              <a
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 transition-all duration-200"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}