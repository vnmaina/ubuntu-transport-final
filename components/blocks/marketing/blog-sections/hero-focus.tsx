"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  CalendarIcon,
  Clock3Icon,
  ShareIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

// Define blog post types
interface Author {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: Author;
}

const featuredPost: BlogPost = {
  id: 1,
  title:
    'The Evolution of Digital Marketing: From SEO to AI-Powered Strategies',
  excerpt:
    "Explore the journey of digital marketing from basic SEO tactics to today's sophisticated AI-driven approach that's revolutionizing how brands connect with audiences.",
  category: 'Digital Strategy',
  date: 'April 18, 2023',
  readTime: '12 min read',
  imageUrl:
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  author: {
    name: 'Daniel Morgan',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
};

const trendingPosts: BlogPost[] = [
  {
    id: 2,
    title:
      'Influencer Marketing: Building Authentic Partnerships That Drive Results',
    excerpt:
      'Learn how to identify, approach, and collaborate with influencers who align with your brand values and can effectively reach your target audience.',
    category: 'Influencer Marketing',
    date: 'April 15, 2023',
    readTime: '9 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      name: 'Rebecca Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 3,
    title:
      'Mastering Marketing Analytics: From Data Collection to Actionable Insights',
    excerpt:
      'Discover how to implement a robust analytics framework that transforms raw data into strategic decisions that drive business growth.',
    category: 'Analytics',
    date: 'April 12, 2023',
    readTime: '11 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    author: {
      name: 'Michael Wilson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 4,
    title:
      'Content Marketing Automation: Scaling Your Strategy Without Sacrificing Quality',
    excerpt:
      'Explore tools and techniques that enable marketing teams to automate content production and distribution while maintaining high standards of quality.',
    category: 'Content Strategy',
    date: 'April 8, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      name: 'Sophia Lee',
      avatar:
        'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
];

interface HeroFocusProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export default function BlogSectionHeroFocus({ title, subtitle, posts }: HeroFocusProps) {
  return (
    <section className="relative">
      {/* Hero Post */}
      <div className="relative h-[600px] w-full md:h-[700px] lg:h-[800px]">
        <Image
          src={featuredPost.imageUrl}
          alt={featuredPost.title}
          className="object-cover brightness-[0.7]"
        
              fill
              sizes="100vw"
            />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 container mx-auto flex flex-col justify-end px-4 pb-12 md:px-6 md:pb-16 lg:pb-24 2xl:max-w-[1400px]">
          <div className="max-w-4xl space-y-6">
            <Badge className="text-sm">{featuredPost.category}</Badge>

            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {featuredPost.title}
            </h1>

            <p className="max-w-2xl text-lg text-gray-200">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="object-cover"
                  
              fill
              sizes="100vw"
            />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {featuredPost.author.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-300">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>{featuredPost.date}</span>
                    <span className="mx-2">•</span>
                    <Clock3Icon className="mr-1 h-3 w-3" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="sm" className="gap-2">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button variant="secondary" size="sm" className="gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button  size="lg">
                <Link href="#">Read Full Article</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Articles */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
          <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight">
                Trending Articles
              </h2>
              <p className="text-muted-foreground">
                Our most popular content that&apos;s making waves right now
              </p>
            </div>
            <Button  variant="outline" className="mt-4 md:mt-0">
              <Link href="#">View All</Link>
            </Button>
          </div>

          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent>
              {trendingPosts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full overflow-hidden p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      
              fill
              sizes="100vw"
            />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>

                    <CardContent className="space-y-3 p-4">
                      <h3 className="line-clamp-2 text-lg font-semibold">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="object-cover"
                          
              fill
              sizes="100vw"
            />
                        </div>
                        <span className="text-sm font-medium">
                          {post.author.name}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <div className="text-muted-foreground flex items-center text-sm">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>{post.date}</span>
                      </div>

                      <Button  variant="link" className="h-auto p-0">
                        <Link href="#">Read <ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
