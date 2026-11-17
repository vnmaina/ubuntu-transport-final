"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  Clock3Icon,
  ArrowRightIcon,
  ChevronDown,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

// Define types
interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface FeaturedPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: Author;
  imageUrl: string;
}

interface SidebarPostType {
  id: number;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

const featuredPost: FeaturedPost = {
  id: 1,
  title: '5 Marketing Automation Trends That Will Define the Industry',
  excerpt:
    'Discover how AI, personalization, and cross-channel integration are transforming marketing automation and what this means for your business strategy.',
  category: 'Automation',
  date: 'April 2, 2023',
  readTime: '12 min read',
  author: {
    name: 'Sophia Martinez',
    role: 'Marketing Director',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
  imageUrl:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
};

const popularPosts: SidebarPostType[] = [
  {
    id: 1,
    title: 'The Complete Guide to SEO in 2023',
    category: 'SEO',
    date: 'March 25, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: '10 B2B Marketing Strategies That Actually Work',
    category: 'B2B',
    date: 'March 20, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'How to Create a Content Calendar That Drives Results',
    category: 'Content',
    date: 'March 18, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
];

const recentPosts: SidebarPostType[] = [
  {
    id: 1,
    title: 'Marketing Attribution Models Explained',
    category: 'Analytics',
    date: 'April 1, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1599658880436-c61792e70672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Creating Viral Social Media Campaigns',
    category: 'Social Media',
    date: 'March 30, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'How to Optimize Your Landing Pages for Conversion',
    category: 'Conversion',
    date: 'March 27, 2023',
    imageUrl:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
  },
];

interface FeaturedWithSidebarProps {
  title?: string;
  subtitle?: string;
  posts?: FeaturedPost[];
}

export default function BlogSectionFeaturedWithSidebar({ title, subtitle, posts }: FeaturedWithSidebarProps) {
  const [tabValue, setTabValue] = useState('popular');

  // Get posts based on selected tab
  const currentPosts = tabValue === 'popular' ? popularPosts : recentPosts;

  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Marketing Blog</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Stay updated with the latest trends, strategies, and insights in the
          marketing world.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Featured Post - Takes up 2/3 of the space on desktop */}
        <div className="space-y-6 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              className="object-cover"
            
              fill
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 p-6 text-white">
              <Badge className="bg-primary hover:bg-primary/90 mb-3">
                {featuredPost.category}
              </Badge>
              <h3 className="mb-2 text-2xl font-bold md:text-3xl">
                {featuredPost.title}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-3 w-3" />
                <span>{featuredPost.date}</span>
                <Clock3Icon className="ml-3 h-3 w-3" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="object-cover"
                
              fill
              sizes="100vw"
            />
              </div>
              <div>
                <p className="font-medium">{featuredPost.author.name}</p>
                <p className="text-muted-foreground text-sm">
                  {featuredPost.author.role}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">{featuredPost.excerpt}</p>
            <Button >
              <Link href="#">Read Full Article</Link>
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Tabs for larger screens, dropdown for mobile */}
          <div className="hidden md:block">
            <Tabs defaultValue="popular" onValueChange={setTabValue}>
              <div className="mb-5 flex items-center justify-between border-b">
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:border-primary h-10 rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:border-primary h-10 rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                  >
                    Recent
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="popular" className="mt-0 flex flex-col gap-2">
                {popularPosts.map((post) => (
                  <SidebarPost key={post.id} post={post} />
                ))}
                <Button  variant="link" className="pl-0">
                  <Link href="#">See all popular posts{' '}<ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
                </Button>
              </TabsContent>

              <TabsContent value="recent" className="mt-0 flex flex-col gap-2">
                {recentPosts.map((post) => (
                  <SidebarPost key={post.id} post={post} />
                ))}
                <Button  variant="link" className="pl-0">
                  <Link href="#">See all recent posts{' '}<ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dropdown menu for small screens */}
          <div className="md:hidden">
            <div className="mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="inline-flex items-center justify-center w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer justify-between">
                    {tabValue === 'popular' ? 'Popular Posts' : 'Recent Posts'}<ChevronDown className="ml-2 h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setTabValue('popular')}>
                    Popular Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTabValue('recent')}>
                    Recent Posts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-2">
              {currentPosts.map((post) => (
                <SidebarPost key={post.id} post={post} />
              ))}
              <Button  variant="link" className="pl-0">
                <Link href="#">{tabValue === 'popular'
                                              ? 'See all popular posts'
                                              : 'See all recent posts'}{' '}<ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarPost({ post }: { post: SidebarPostType }) {
  return (
    <Link href="#" className="group">
      <Card className="overflow-hidden p-0">
        <CardContent className="flex p-0">
          <div className="relative aspect-[4/3] w-1/3">
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            
              fill
              sizes="100vw"
            />
          </div>
          <div className="w-2/3 p-4">
            <Badge variant="outline" className="mb-2 text-xs">
              {post.category}
            </Badge>
            <h4 className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
              {post.title}
            </h4>
            <div className="text-muted-foreground mt-2 flex items-center text-xs">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>{post.date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
