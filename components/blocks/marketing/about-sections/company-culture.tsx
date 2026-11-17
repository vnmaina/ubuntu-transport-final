import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuoteIcon } from 'lucide-react';
import Link from "next/link";

// Define types for culture aspects
type CultureAspect = {
  id: string;
  title: string;
  description: string;
  images: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
};

// Company culture data
const cultureAspects: CultureAspect[] = [
  {
    id: 'innovation',
    title: 'Innovation First',
    description:
      'We believe in challenging the status quo and constantly pushing boundaries to create new solutions. Our innovation-driven approach encourages experimentation, learning from failures, and celebrating breakthrough successes.',
    images: [
      'https://images.unsplash.com/photo-1536148935331-408321065b18?q=80&w=800',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
    ],
    testimonial: {
      quote:
        'I&apos;ve never worked anywhere that so actively encourages creative thinking. We&apos;re given the time and resources to explore new ideas, even if they might not work out. That freedom to innovate without fear has led to our most successful products.',
      author: 'Sarah Chen',
      role: 'Product Designer',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop&crop=faces',
    },
  },
  {
    id: 'collaboration',
    title: 'Collaborative Spirit',
    description:
      'Our collaborative culture fosters open communication and cross-functional teamwork. We believe that diverse perspectives drive better outcomes, and we create intentional spaces for sharing ideas and working together across departments.',
    images: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800',
      'https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800',
    ],
    testimonial: {
      quote:
        "The walls between teams simply don't exist here. Developers, designers, marketers—we all work together with mutual respect. I've seen ideas transform when people from different backgrounds contribute their unique perspectives.",
      author: 'Marcus Johnson',
      role: 'Engineering Lead',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop&crop=faces',
    },
  },
  {
    id: 'wellbeing',
    title: 'Wellbeing & Balance',
    description:
      'We prioritize the holistic wellbeing of our team, recognizing that the best work happens when people feel supported in all aspects of their lives. Our flexible policies and wellness initiatives reflect our commitment to sustainable work practices.',
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800',
      'https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?q=80&w=800',
      'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800',
    ],
    testimonial: {
      quote:
        "I joined from a company where burnout was considered a badge of honor. Here, I'm encouraged to take time off, pursue hobbies, and bring my whole self to work. The result? I'm happier, healthier, and doing the best work of my career.",
      author: 'Elena Rodriguez',
      role: 'Customer Success Manager',
      avatar:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&h=150&fit=crop&crop=faces',
    },
  },
  {
    id: 'growth',
    title: 'Continuous Growth',
    description:
      "Learning is embedded in our culture. We invest in our team's professional development through mentorship programs, learning budgets, and career pathing that nurtures both technical expertise and leadership skills.",
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
    ],
    testimonial: {
      quote:
        "In three years, I've grown from a junior role to leading a team, supported every step of the way with training, challenges that stretched my abilities, and leaders who saw potential in me before I saw it in myself.",
      author: 'James Wilson',
      role: 'Marketing Director',
      avatar:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&h=150&fit=crop&crop=faces',
    },
  },
];

export default function AboutSectionCompanyCulture() {
  const [activeTab, setActiveTab] = useState('innovation');

  return (
    <section className="bg-muted/25 py-24">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
            Our Culture
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            What Makes Us Different
          </h2>
          <p className="text-muted-foreground">
            Our culture defines how we work together and the values that guide
            our decisions. It&apos;s what makes our company a special place to
            work and grow.
          </p>
        </div>

        <Tabs
          defaultValue="innovation"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          {/* Tabs navigation */}
          <div className="flex justify-center">
            <TabsList className="grid h-auto grid-cols-2 p-1 md:grid-cols-4">
              {cultureAspects.map((aspect) => (
                <TabsTrigger
                  key={aspect.id}
                  value={aspect.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2.5"
                >
                  {aspect.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab content */}
          {cultureAspects.map((aspect) => (
            <TabsContent
              key={aspect.id}
              value={aspect.id}
              className="space-y-8"
            >
              {/* Description */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {aspect.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {aspect.description}
                  </p>
                </div>

                {/* Testimonial */}
                <Card className="from-primary/5 to-primary/10 border-0 bg-gradient-to-br p-0">
                  <CardContent className="space-y-4 p-6 pt-6">
                    <QuoteIcon className="text-primary/40 h-8 w-8" />
                    <p className="text-muted-foreground italic">
                      &quot;{aspect.testimonial.quote}&quot;
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={aspect.testimonial.avatar}
                          alt={aspect.testimonial.author}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {aspect.testimonial.author}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {aspect.testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {aspect.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image}
                      alt={`${aspect.title} culture`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="bg-background relative mt-16 rounded-xl border p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">Join Our Team</h3>
              <p className="text-muted-foreground mb-6">
                We&apos;re always looking for talented individuals who share our
                values and want to be part of building something meaningful.
                Explore our open positions and find where you might fit in.
              </p>
              <div className="flex gap-4">
                <Button >
                  <Link href="#">View Open Positions</Link>
                </Button>
                <Button variant="outline" >
                  <Link href="#">Our Values</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=300',
                'https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=300',
                'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=300',
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <Image src={src} alt="Team culture" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="bg-primary/10 absolute -top-5 -left-5 h-10 w-10 rounded-full" />
          <div className="bg-primary/10 absolute -right-5 -bottom-5 h-10 w-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}
