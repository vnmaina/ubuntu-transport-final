"use client";

import { Twitter, Github, Linkedin } from '@/components/ui/brand-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from "next/image";

const team = [
  {
    name: 'David Forren',
    role: 'Founder / CEO',
    bio: 'Building great products with an amazing team is what drives me every day.',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[400px]',
  },
  {
    name: 'Amil Evara',
    role: 'UI/UX Designer',
    bio: "Design is not just what it looks like, it's how it works.",
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[500px]',
  },
  {
    name: 'Ebele Egbuna',
    role: 'Support Consultant',
    bio: 'Helping customers succeed is my passion.',
    image:
      'https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[450px]',
  },
  {
    name: 'Maria Powers',
    role: 'Director of Sales',
    bio: 'Driving growth through meaningful relationships.',
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[350px]',
  },
  {
    name: 'Alex Chen',
    role: 'Lead Developer',
    bio: 'Turning coffee into code and ideas into reality.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[380px]',
  },
  {
    name: 'Sarah Miller',
    role: 'Product Manager',
    bio: 'Bridging the gap between user needs and technical solutions.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500&q=80',
    height: 'h-[420px]',
  },
];

export default function MasonryGrid() {
  return (
    <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      {/* Title */}
      <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <h2 className="text-3xl font-bold md:text-4xl md:leading-tight">
          Meet our team
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">
          The amazing people behind the scenes
        </p>
      </div>
      {/* End Title */}

      {/* Masonry Grid */}
      <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
        {team.map((member) => (
          <Card
            key={member.name}
            className="group relative break-inside-avoid overflow-hidden p-0 transition-shadow hover:shadow-lg"
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className={`relative ${member.height}`}>
                  <Image
                    className="object-cover"
                    src={member.image}
                    alt={member.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  
              fill
            />
                </div>
                <div className="from-background/90 to-background/0 absolute inset-0 bg-gradient-to-t opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-6 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-foreground text-lg font-medium">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm">{member.role}</p>
                  <p className="mt-4 text-sm">{member.bio}</p>
                  <div className="mt-6 flex gap-2">
                    <Button size="icon" variant="secondary">
                      <Twitter className="size-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Github className="size-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Linkedin className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* End Masonry Grid */}
    </div>
  );
}
