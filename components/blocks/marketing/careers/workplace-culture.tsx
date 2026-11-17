"use client";

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Compass,
  Heart,
  Lightbulb,
  Medal,
  PartyPopper,
  Users,
} from 'lucide-react';
import Image from "next/image";

interface CultureValue {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

interface CultureActivity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function WorkplaceCulture() {
  const values: CultureValue[] = [
    {
      id: 'innovation',
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation',
      description:
        "We embrace creative thinking and encourage experimentation. We're not afraid to try new approaches and learn from our failures.",
    },
    {
      id: 'teamwork',
      icon: <Users className="h-8 w-8" />,
      title: 'Teamwork',
      description:
        'We believe in the power of collaboration and diverse perspectives. Our best work happens when we combine our unique strengths.',
    },
    {
      id: 'excellence',
      icon: <Medal className="h-8 w-8" />,
      title: 'Excellence',
      description:
        "We hold ourselves to high standards and take pride in our work. We're committed to delivering quality in everything we do.",
    },
    {
      id: 'passion',
      icon: <Heart className="h-8 w-8" />,
      title: 'Passion',
      description:
        "We're driven by a genuine enthusiasm for our work and its impact. We bring energy and dedication to each challenge.",
    },
    {
      id: 'integrity',
      icon: <Compass className="h-8 w-8" />,
      title: 'Integrity',
      description:
        'We build trust through honest communication and ethical decision-making. We do the right thing, even when it&apos;s difficult.',
    },
    {
      id: 'growth',
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Growth',
      description:
        "We're committed to continuous learning and development. We help each other expand our skills and reach our potential.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      quote:
        "The culture here is unlike any place I've worked before. There's a perfect balance of autonomy and support, and I feel like my ideas are truly valued.",
      name: 'Elena Martinez',
      role: 'Product Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      quote:
        "What I appreciate most is how everyone is genuinely invested in each other's success. We celebrate wins together and support each other through challenges.",
      name: 'Marcus Chen',
      role: 'Senior Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      quote:
        "The emphasis on work-life balance here isn't just talk — it's built into how we work. I've never felt more productive while also having time for my personal life.",
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  const activities: CultureActivity[] = [
    {
      id: '1',
      title: 'Team Retreats',
      description:
        'Twice a year, we gather for company-wide retreats where we reflect on our progress, plan for the future, and strengthen our connections through fun activities.',
      imageUrl:
        'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      title: 'Hackathons',
      description:
        'Our quarterly hackathons give everyone the chance to work on passion projects, explore new technologies, and collaborate across teams.',
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      title: 'Lunch & Learn',
      description:
        'Weekly Lunch & Learn sessions provide a casual environment to share knowledge, present ideas, and discuss industry trends while enjoying a meal together.',
      imageUrl:
        'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '4',
      title: 'Volunteer Days',
      description:
        'We dedicate time for community service, allowing teams to volunteer with organizations that align with our values and make a positive impact.',
      imageUrl:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '5',
      title: 'Celebrations',
      description:
        'From birthdays to work anniversaries and major milestones, we take time to celebrate our people and accomplishments.',
      imageUrl:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '6',
      title: 'Wellness Programs',
      description:
        'Regular wellness activities including yoga sessions, fitness challenges, and mental health workshops help our team stay balanced and healthy.',
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-block rounded-full p-2">
          <PartyPopper className="h-6 w-6" />
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight">
          Our Culture & Values
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          More than just a workplace, we&apos;re building a community where
          talented people collaborate, grow, and create amazing things together.
        </p>
      </div>

      {/* Values Grid */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <Card
            key={value.id}
            className="flex flex-col items-center px-6 text-center"
          >
            <div className="bg-primary/10 text-primary rounded-full p-3">
              {value.icon}
            </div>
            <h3 className="text-xl font-semibold">{value.title}</h3>
            <p className="text-muted-foreground">{value.description}</p>
          </Card>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="bg-primary/5 relative mb-16 overflow-hidden rounded-xl p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-20">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.8 43.6C19.6 43.6 0 60.4 0 87.6C0 114.8 19.6 128.8 38.8 128.8C73.6 128.8 54.4 180.4 31.6 180.4C54.4 212.4 116.8 174 116.8 119.6C116.8 72.8 70.4 43.6 38.8 43.6ZM152 43.6C132.8 43.6 113.2 60.4 113.2 87.6C113.2 114.8 132.8 128.8 152 128.8C186.8 128.8 167.6 180.4 144.8 180.4C167.6 212.4 230 174 230 119.6C230 72.8 183.6 43.6 152 43.6Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <h3 className="mb-8 text-center text-2xl font-semibold">
          Hear From Our Team
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col">
              <div className="mb-4 flex-1">
                <p className="italic">&quot;{testimonial.quote}&quot;</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div>
        <h3 className="mb-8 text-center text-2xl font-semibold">
          Life at Our Company
        </h3>

        <Tabs defaultValue="gallery" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList>
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gallery" className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group relative aspect-video overflow-hidden rounded-md"
                >
                  <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  
              fill
              sizes="100vw"
            />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 p-4">
                      <h4 className="text-lg font-medium text-white">
                        {activity.title}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="pt-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="rounded-t-xl object-cover"
                    
              fill
              sizes="100vw"
            />
                  </div>
                  <CardContent className="">
                    <h4 className="mb-2 text-lg font-medium">
                      {activity.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {activity.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
