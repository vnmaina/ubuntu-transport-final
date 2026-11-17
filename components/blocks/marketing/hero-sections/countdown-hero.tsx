"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from "next/image";

interface CountdownHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function CountdownHero({ title, subtitle, ctaText = "Notify Me", ctaLink = "#" }: CountdownHeroProps) {
  const [targetDate] = useState(() => Date.now() + 30 * 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate - Date.now();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-background relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1920&h=1080&fit=crop&crop=center"
        alt="Rocket launch"
        className="absolute inset-0 h-full w-full object-cover opacity-10"
      
              fill
              sizes="100vw"
            />
      <div className="relative z-10 container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary mb-6"
          >
            Launching Soon
          </Badge>
          <h1 className="text-primary mb-6 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
            {title || "Prepare for the Future of Innovation"}
          </h1>
          <p className="text-foreground mb-8 max-w-4xl text-base text-balance sm:text-lg">
            {subtitle || "Join us as we countdown to the launch of our revolutionary product that will change the way you work."}
          </p>
          <div className="mb-12 flex justify-center">
            <div className="grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
              {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                <Card key={unit} className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-primary text-5xl font-bold">
                      {timeLeft[unit as keyof typeof timeLeft]}
                    </div>
                    <div className="text-muted-foreground text-sm capitalize">
                      {unit}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <form className="mx-auto flex max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button type="submit">Notify Me</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
