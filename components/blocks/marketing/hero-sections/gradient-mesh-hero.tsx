import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from "next/link";

interface GradientMeshHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  features?: string[];
}

export default function GradientMeshHero({
  title = "Transform your digital experience",
  subtitle = "Discover our powerful platform with cutting-edge features designed to elevate your workflow and boost productivity.",
  ctaText = "Get Started",
  ctaLink = "#",
  badge = "Introducing Our Latest Innovation",
  features = ["Free 14-day trial", "No credit card required", "Cancel anytime"]
}: GradientMeshHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background with mesh */}
      <div className="from-primary/20 via-background to-background absolute inset-0 z-0 bg-gradient-to-br">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:px-6 md:py-36 2xl:max-w-[1400px]">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-10 text-center">
          <div className="space-y-6">
            <div className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
              {badge}
            </div>
            <h1 className="from-primary to-primary/50 dark:from-primary dark:to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl lg:text-2xl">
              {subtitle}
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <Button size="lg" className="w-full" >
              <Link href={ctaLink}>{ctaText}
                <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="dark:text-foreground dark:hover:text-primary w-full" >
              <Link href="#">Watch Demo</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
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
                  className="text-primary h-6 w-6"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="dark:text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Abstract shapes */}
      <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl"></div>
      <div className="bg-primary/10 absolute -right-20 bottom-1/4 h-64 w-64 rounded-full blur-3xl"></div>
    </div>
  );
}
