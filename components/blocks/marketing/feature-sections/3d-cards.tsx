
"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Accessibility,
  ArrowUpRight,
  Bus,
  CalendarCheck,
  Car,
  Globe,
  Plane,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Car,
    title: "4x4 Safari Land Cruisers",
    description:
      "Custom pop-up roofs and game-viewing decks for unforgettable Kenya safaris.",
  },
  {
    icon: Bus,
    title: "Corporate Staff Shuttles",
    description:
      "Punctual, comfortable employee transport for corporates and institutions across Nairobi.",
  },
  {
    icon: Plane,
    title: "24/7 Airport Transfers",
    description:
      "Round-the-clock JKIA and Wilson Airport pickups with flight tracking and meet-and-greet.",
  },
  {
    icon: ShieldCheck,
    title: "NTSA-Certified Safety",
    description:
      "Regular inspections, speed governors, and vetted professional drivers on every trip.",
  },
  {
    icon: Users,
    title: "Event & Conference Logistics",
    description:
      "Turnkey fleet coordination for conferences, retreats, and team-building excursions.",
  },
  {
    icon: CalendarCheck,
    title: "Long-Term Fleet Leasing",
    description:
      "Flexible vehicle leasing and fleet outsourcing that reduces your transport overheads.",
  },
  {
    icon: Accessibility,
    title: "Accessible Transport",
    description:
      "Wheelchair-friendly vans with hydraulic lifts for dignified, safe, and comfortable travel.",
  },
  {
    icon: Globe,
    title: "Cross-Border Tours",
    description:
      "Inter-county and cross-border group travel across Kenya and East Africa, door to door.",
  },
];

function Feature3DCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (
      !cardRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const Icon = feature.icon;

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
      className={cn(
        "group relative isolate h-full overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.06] p-0 text-primary-foreground shadow-lg shadow-black/5",
        "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out",
        "hover:border-secondary/50 hover:bg-primary-foreground/[0.10] hover:shadow-xl hover:shadow-black/10",
        "motion-reduce:transform-none motion-reduce:transition-none"
      )}
    >
      {/* Card decorative pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 -z-10 grid grid-cols-3 gap-2 opacity-[0.08] transition-opacity duration-300 group-hover:opacity-20"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="size-10 rounded-md border border-primary-foreground"
          />
        ))}
      </div>

      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 size-40 rounded-full bg-secondary/10 blur-3xl transition-colors duration-300 group-hover:bg-secondary/20"
      />

      <CardContent className="relative flex h-full flex-col p-6 lg:p-7">
        {/* Icon and number */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/10 text-secondary shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-secondary group-hover:text-secondary-foreground">
            <Icon className="size-7" strokeWidth={1.7} />
          </div>

          <span className="text-xs font-bold tabular-nums tracking-widest text-primary-foreground/30">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col space-y-3">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-primary-foreground transition-colors group-hover:text-secondary">
            {feature.title}
          </h3>

          <p className="text-sm leading-7 text-primary-foreground/65">
            {feature.description}
          </p>
        </div>

        {/* Bottom accent */}
        <div className="mt-7 flex items-center justify-between">
          <div className="h-1 w-10 rounded-full bg-secondary/70 transition-all duration-300 group-hover:w-16" />

          <ArrowUpRight className="size-4 text-primary-foreground/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeatureSection3D() {
  return (
    <section className="relative isolate overflow-hidden bg-primary px-4 py-16 text-primary-foreground md:px-8 lg:py-24">
      {/* Background box patterns */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Top-right pattern */}
        <div className="absolute -right-16 -top-16 grid grid-cols-6 gap-3 opacity-[0.10]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="size-12 rounded-md border border-primary-foreground/50"
            />
          ))}
        </div>

        {/* Bottom-left pattern */}
        <div className="absolute -bottom-20 -left-16 grid grid-cols-6 gap-3 opacity-[0.08]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="size-12 rounded-md border border-primary-foreground/50"
            />
          ))}
        </div>

        {/* Ambient accent glows */}
        <div className="absolute -right-40 top-1/3 size-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 size-80 rounded-full bg-secondary/[0.07] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-12 lg:space-y-14">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-1 w-8 rounded-full bg-secondary" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Why Choose Us
            </span>

            <span className="h-1 w-8 rounded-full bg-secondary" />
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Why Choose Ubuntu Logistics?
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-8 text-primary-foreground/70 sm:text-lg">
            From corporate staff shuttles to once-in-a-lifetime safaris,
            experience safe, reliable, and punctual transport across Kenya
            and East Africa.
          </p>

          <div className="mx-auto h-1 w-16 rounded-full bg-secondary" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => (
            <Feature3DCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
