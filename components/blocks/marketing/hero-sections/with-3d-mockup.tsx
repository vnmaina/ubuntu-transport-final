import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import Link from "next/link";

interface HeroSectionWith3DMockupProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export default function HeroSectionWith3DMockup({ title, subtitle, ctaText, ctaLink, imageUrl }: HeroSectionWith3DMockupProps) {
  return (
    <>
      {/* Hero */}
      <div className="">
        <div className="relative">
          {/* Radial gradient background */}
          <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
            <div className="absolute top-0 left-1/2 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-20" />
            </div>
          </div>

          <div className="container mx-auto grid items-center gap-12 px-4 py-24 md:px-6 lg:grid-cols-2 lg:py-32 2xl:max-w-[1400px]">
            <div>
              <Badge variant="outline" className="mb-4">
                Next Generation UI
              </Badge>
              <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {title || "Transform your design workflow"}
              </h1>
              <p className="text-muted-foreground mb-8 text-xl">
                {subtitle || "Experience the future of UI development with our revolutionary design system. Build faster, smarter, and more efficiently."}
              </p>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" >
                  <Link href={ctaLink || "#"} className="flex items-center gap-2">
                    {ctaText || "Start Building"}
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
                      className="ml-2 h-4 w-4"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 border-y py-8">
                <div>
                  <p className="text-3xl font-bold">300+</p>
                  <p className="text-muted-foreground text-sm">Components</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">2M+</p>
                  <p className="text-muted-foreground text-sm">Developers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-muted-foreground text-sm">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* 3D Mockup */}
            <div className="relative">
              {/* Main Device */}
              <div className="perspective-1200 relative z-10 translate-z-8 rotate-x-[5deg] rotate-y-[-5deg] transform rounded-xl shadow-2xl">
                <div className="bg-card aspect-[1440/900] overflow-hidden rounded-xl border">
                  <Image
                    src={imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1440&auto=format&fit=crop"}
                    alt="Dashboard Preview"
                    width={1440}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Browser Chrome */}
                <div className="bg-muted/80 absolute top-0 right-0 left-0 flex h-8 items-center gap-2 rounded-t-xl px-4 backdrop-blur">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="perspective-1200 absolute top-1/4 -right-8 z-20 w-64 translate-z-32 rotate-x-[5deg] rotate-y-[-15deg] transform">
                <div className="bg-card rounded-lg border p-4 shadow-xl">
                  <div className="mb-3 flex items-center gap-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="bg-muted-foreground/20 h-2 w-3/4 rounded" />
                      <div className="bg-muted-foreground/20 mt-2 h-2 w-1/2 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted-foreground/20 h-2 rounded" />
                    <div className="bg-muted-foreground/20 h-2 rounded" />
                    <div className="bg-muted-foreground/20 h-2 w-2/3 rounded" />
                  </div>
                </div>
              </div>

              <div className="perspective-1200 absolute bottom-1/4 -left-8 z-20 w-48 translate-z-16 rotate-x-[-5deg] rotate-y-[15deg] transform">
                <div className="bg-card rounded-lg border p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="bg-primary/10 h-8 w-8 rounded-lg" />
                    <div className="bg-primary/10 h-8 w-8 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted-foreground/20 h-2 rounded" />
                    <div className="bg-muted-foreground/20 h-2 w-3/4 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
