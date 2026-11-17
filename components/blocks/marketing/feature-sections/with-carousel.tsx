import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Bot, Cloud, Code, Lock, Zap, Shield, Globe, Cpu } from 'lucide-react';
import Image from "next/image";

interface FeatureSectionWithCarouselProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
  }>;
}

const defaultFeatures = [
  {
    title: 'AI Integration',
    description: 'Powerful AI capabilities built right into your workflow',
    icon: Bot,
    image: 'https://placehold.co/800x600/jpeg',
    benefits: [
      'Smart Automation',
      'Predictive Analytics',
      'Natural Language Processing',
    ],
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Scale your application with cloud-native architecture',
    icon: Cloud,
    image: 'https://placehold.co/800x600/jpeg',
    benefits: ['Auto Scaling', 'Global CDN', 'High Availability'],
  },
  {
    title: 'Developer Experience',
    description: 'Built by developers, for developers',
    icon: Code,
    image: 'https://placehold.co/800x600/jpeg',
    benefits: ['Modern Stack', 'Great DX', 'Extensive Docs'],
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade security for your applications',
    icon: Lock,
    image: 'https://placehold.co/800x600/jpeg',
    benefits: ['End-to-end Encryption', 'Role-based Access', 'Audit Logs'],
  },
];

const iconMap: Record<string, any> = {
  Bot,
  Cloud,
  Code,
  Lock,
  Zap,
  Shield,
  Globe,
  Cpu,
};

export default function FeatureSectionWithCarousel({ title, subtitle, features }: FeatureSectionWithCarouselProps) {
  const displayFeatures = features && features.length > 0 
    ? features.map((feature, index) => ({
        title: feature.title,
        description: feature.description,
        icon: iconMap[feature.icon || 'Bot'] || Bot,
        image: feature.imageUrl || 'https://placehold.co/800x600/jpeg',
        benefits: ['Feature benefit 1', 'Feature benefit 2', 'Feature benefit 3'],
      }))
    : defaultFeatures;

  return (
    <section className="container mx-auto space-y-8 px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {title || "Powerful features for modern teams"}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          {subtitle || "Everything you need to build and scale your application"}
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="mx-auto w-[87%]"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {displayFeatures.map((feature, index) => (
            <CarouselItem
              key={index}
              className="flex flex-col pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
            >
              <Card className="relative flex flex-1 flex-col overflow-hidden p-0">
                <div className="relative aspect-video">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className="object-cover"
                  
              fill
              sizes="100vw"
            />
                  <div className="from-background/80 to-background/0 absolute inset-0 bg-gradient-to-t" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="gap-1">
                      <feature.icon className="size-3" />
                      {feature.title}
                    </Badge>
                  </div>
                </div>
                <CardContent className="flex-1 p-6 pt-0">
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="bg-primary size-1.5 rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
