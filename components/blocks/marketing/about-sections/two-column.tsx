import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { CheckCircle2 } from 'lucide-react';
import Link from "next/link";

const competencies = [
  'User-centered design approach',
  'Agile development methodology',
  'Full-stack engineering expertise',
  'End-to-end product strategy',
  'Enterprise-grade security',
  '24/7 customer support',
];

export default function AboutSectionTwoColumn() {
  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000"
            alt="Team collaborating in modern office"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-primary mb-2 font-semibold">Who We Are</h4>
            <h2 className="text-3xl font-bold tracking-tight">
              Building digital products that make a difference
            </h2>
          </div>

          <p className="text-muted-foreground">
            We are a team of passionate designers, developers, and strategists
            who believe in creating thoughtful digital experiences that solve
            real problems. Our approach combines deep technical expertise with a
            human-centered design philosophy.
          </p>

          <div className="pt-2">
            <h3 className="mb-3 text-lg font-bold">Our Core Competencies</h3>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {competencies.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button >
              <Link href="#">Learn our approach</Link>
            </Button>
            <Button variant="outline" >
              <Link href="#">View case studies</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
