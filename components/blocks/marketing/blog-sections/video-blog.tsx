"use client";

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarIcon,
  PlayCircleIcon,
  ClockIcon,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from "next/image";
import Link from "next/link";

interface VideoPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  featured?: boolean;
}

const videoPosts: VideoPost[] = [
  {
    id: 1,
    title: 'How We Increased Conversion Rates by 150% with A/B Testing',
    excerpt:
      'In this case study, we walk through the exact process we used to dramatically increase conversion rates through systematic A/B testing of landing pages.',
    category: 'Case Study',
    date: 'April 20, 2023',
    duration: '18:45',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    videoUrl: '#',
    views: 12480,
    featured: true,
  },
  {
    id: 2,
    title: 'Social Media Marketing Masterclass: Platform-Specific Strategies',
    excerpt:
      'Learn the unique strategies for each major social platform to maximize engagement and conversion.',
    category: 'Tutorial',
    date: 'April 15, 2023',
    duration: '24:12',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    videoUrl: '#',
    views: 8742,
  },
  {
    id: 3,
    title: 'Creating Video Content That Converts: Step-by-Step Guide',
    excerpt:
      'Follow our proven framework for producing video content that not only engages viewers but drives them to take action.',
    category: 'Guide',
    date: 'April 5, 2023',
    duration: '21:05',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    videoUrl: '#',
    views: 6981,
  },
  {
    id: 4,
    title: 'Email Automation Workflows That Drive Results',
    excerpt:
      'Discover how to set up sophisticated email automation sequences that nurture leads and boost sales.',
    category: 'Workshop',
    date: 'March 28, 2023',
    duration: '26:18',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    videoUrl: '#',
    views: 7340,
  },
];

const categories = [
  'All Videos',
  'Case Study',
  'Tutorial',
  'Analysis',
  'Guide',
  'Workshop',
];

interface VideoBlogProps {
  title?: string;
  subtitle?: string;
  posts?: VideoPost[];
}

export default function BlogSectionVideoBlog({ title, subtitle, posts }: VideoBlogProps) {
  const [activeTab, setActiveTab] = useState('popular');
  const [activeCategory, setActiveCategory] = useState('All Videos');

  // Find featured video
  const featuredVideo = videoPosts.find((post) => post.featured);

  // Filter videos based on category
  const filteredVideos = videoPosts.filter(
    (video) =>
      !video.featured &&
      (activeCategory === 'All Videos' || video.category === activeCategory)
  );

  // Format view count for display
  const formatViews = (views: number): string => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Video Insights</h2>
          <p className="text-muted-foreground mt-1">
            Learn marketing strategies through our video content
          </p>
        </div>
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-2">
                {activeCategory}<ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  className={activeCategory === category ? 'bg-accent' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="mb-6 md:hidden">
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="border-input bg-background ring-offset-background w-full rounded-md border px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {featuredVideo && (
        <div className="mb-12">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={featuredVideo.thumbnailUrl}
              alt={featuredVideo.title}
              className="object-cover"
            
              fill
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button  variant="outline" size="lg" className="rounded-full border-white bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 hover:text-white">
                <a href={featuredVideo.videoUrl}><PlayCircleIcon className="mr-2 h-6 w-6" />Play Video</a>
              </Button>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary hover:bg-primary/90">
                {featuredVideo.category}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold md:text-2xl">
              {featuredVideo.title}
            </h3>
            <p className="text-muted-foreground mt-2">
              {featuredVideo.excerpt}
            </p>
            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {featuredVideo.date}
              </span>
              <span className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                {featuredVideo.duration}
              </span>
              <span className="flex items-center">
                <PlayCircleIcon className="mr-1 h-4 w-4" />
                {formatViews(featuredVideo.views)} views
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation - Desktop */}
      <div className="mb-8 hidden md:block">
        <Tabs defaultValue="popular" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Navigation - Mobile */}
      <div className="mb-6 md:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="border-input bg-background ring-offset-background w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="popular">Popular</option>
          <option value="recent">Recent</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <Card
            key={video.id}
            className="flex h-full flex-col overflow-hidden pt-0"
          >
            <div className="relative aspect-video">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                className="object-cover"
              
              fill
              sizes="100vw"
            />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-colors hover:bg-black/30 hover:opacity-100">
                <Button  variant="outline" size="icon" className="rounded-full border-white bg-black/50 text-white hover:bg-black/70 hover:text-white">
                  <a href={video.videoUrl}><PlayCircleIcon className="h-10 w-10" /></a>
                </Button>
              </div>
              <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg">
                {video.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {video.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex items-center justify-between pt-0">
              <div className="text-muted-foreground text-sm">{video.date}</div>
              <div className="text-muted-foreground flex items-center text-sm">
                <PlayCircleIcon className="mr-1 h-3 w-3" />
                {formatViews(video.views)} views
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button  variant="outline" className="w-full max-w-sm">
          <Link href="#">Browse All Videos</Link>
        </Button>
      </div>
    </section>
  );
}
