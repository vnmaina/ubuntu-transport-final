import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function AboutSectionWithImage() {
  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Founded in 2010, our company began with a simple idea: to create
              technology that truly serves people. What started as a small team
              of three passionate developers has grown into a global
              organization with offices in 12 countries.
            </p>
            <p className="text-muted-foreground">
              Over the years, we&apos;ve helped thousands of businesses
              transform their digital presence and streamline their operations.
              Our approach combines technical expertise with deep industry
              knowledge.
            </p>
            <p className="text-muted-foreground">
              Today, we continue to innovate and push boundaries, always with
              our original mission at heart: putting people first in everything
              we build.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button >
              <Link href="#">Learn our history</Link>
            </Button>
            <Button variant="outline" >
              <Link href="#">Meet our team</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg lg:aspect-square">
          <Image
            src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2000"
            alt="Our team collaboration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
