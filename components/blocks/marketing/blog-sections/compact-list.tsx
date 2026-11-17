"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  CalendarIcon,
  Clock3Icon,
  ChevronRightIcon,
  SearchIcon,
  BookmarkIcon,
  TrendingUpIcon,
  ArrowUpRightIcon,
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  trending?: boolean;
  popular?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Email Marketing Automation Workflows Every Business Needs',
    excerpt:
      'Implement these essential automation workflows to save time and boost your email marketing effectiveness.',
    category: 'Email',
    date: 'April 22, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    trending: true,
  },
  {
    id: 2,
    title: 'The Complete Guide to Content Distribution Strategies',
    excerpt:
      'Creating great content is only half the battle. Learn how to effectively distribute your content for maximum impact.',
    category: 'Content',
    date: 'April 20, 2023',
    readTime: '9 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    popular: true,
  },
  {
    id: 3,
    title: '5 Data-Driven Methods to Improve Your Conversion Rates',
    excerpt:
      'Use these proven analytical approaches to identify and fix conversion bottlenecks in your marketing funnel.',
    category: 'Analytics',
    date: 'April 18, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 4,
    title: 'Building a Customer Journey Map That Actually Drives Results',
    excerpt:
      'Learn how to create and utilize customer journey maps to enhance your marketing strategy and improve customer experience.',
    category: 'Strategy',
    date: 'April 15, 2023',
    readTime: '11 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    trending: true,
  },
  {
    id: 5,
    title: 'The Psychology of Pricing: Strategies for Marketers',
    excerpt:
      'Understand how psychology influences pricing decisions and learn tactics to optimize your pricing strategy.',
    category: 'Marketing',
    date: 'April 12, 2023',
    readTime: '6 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    popular: true,
  },
  {
    id: 6,
    title: 'How to Conduct Competitive Analysis for Social Media',
    excerpt:
      "A step-by-step guide to analyzing your competitors' social media strategies and leveraging those insights for your brand.",
    category: 'Social Media',
    date: 'April 10, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: 7,
    title: 'Creating an Effective Content Calendar: Templates and Tools',
    excerpt:
      'Streamline your content creation process with these practical templates, tools, and organizational tips.',
    category: 'Content',
    date: 'April 8, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
  },
  {
    id: 8,
    title: 'Mobile-First Marketing: Strategies for a Mobile-Dominated World',
    excerpt:
      'As mobile usage continues to grow, learn how to adapt your marketing approach to prioritize mobile experiences.',
    category: 'Mobile',
    date: 'April 5, 2023',
    readTime: '9 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    trending: true,
  },
  {
    id: 9,
    title: 'Essential Google Analytics 4 Reports for Marketers',
    excerpt:
      'Navigate the transition to GA4 with this guide to the most valuable reports for marketing professionals.',
    category: 'Analytics',
    date: 'April 2, 2023',
    readTime: '10 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    popular: true,
  },
];

interface CompactListProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export default function BlogSectionCompactList({ title, subtitle, posts }: CompactListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get trending and popular posts
  const trendingPosts = blogPosts.filter((post) => post.trending).slice(0, 3);
  const popularPosts = blogPosts.filter((post) => post.popular).slice(0, 3);

  return (
    <section className="container mx-auto px-4 py-20 md:px-6 2xl:max-w-[1400px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
            <div className="relative w-full max-w-xs">
              <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="divide-border space-y-0 divide-y">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col gap-4 py-5 sm:flex-row"
                >
                  <div className="flex-none sm:w-1/4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      
              fill
              sizes="100vw"
            />
                    </div>
                  </div>
                  <div className="flex flex-col sm:w-3/4">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.trending && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <TrendingUpIcon className="h-3 w-3" /> Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="group-hover:text-primary mb-1 text-lg font-semibold transition-colors">
                      <Link href="#">{post.title}</Link>
                    </h3>
                    <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="text-muted-foreground mt-auto flex items-center text-xs">
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Clock3Icon className="mr-1 h-3 w-3" />
                        {post.readTime}
                      </span>
                      <Button  variant="ghost" size="sm" className="ml-auto h-auto p-0 text-xs font-medium">
                        <Link href="#" className="flex items-center gap-1">Read Article <ArrowUpRightIcon className="h-3 w-3" /></Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border py-12 text-center">
              <h3 className="mb-2 text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Reset search
              </Button>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button  variant="outline" className="w-full max-w-xs">
                <Link href="#">Load More Articles{' '}<ChevronRightIcon className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Trending Posts */}
          <Card className="gap-0">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <TrendingUpIcon className="text-primary mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Trending Now</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="group">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground text-xl font-bold">
                      {index + 1}.
                    </div>
                    <div>
                      <h4 className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                        <Link href="#">{post.title}</Link>
                      </h4>
                      <div className="text-muted-foreground mt-1 flex items-center text-xs">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {post.category}
                        </Badge>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  {index < trendingPosts.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button  variant="ghost" size="sm" className="w-full">
                <Link href="#">See All Trending</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Popular Posts */}
          <Card className="gap-0">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <BookmarkIcon className="text-primary mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Most Popular</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {popularPosts.map((post, index) => (
                <div key={post.id} className="group">
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        className="object-cover"
                      
              fill
              sizes="100vw"
            />
                    </div>
                    <div>
                      <h4 className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                        <Link href="#">{post.title}</Link>
                      </h4>
                      <div className="text-muted-foreground mt-1 flex items-center text-xs">
                        <Clock3Icon className="mr-1 h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  {index < popularPosts.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button  variant="ghost" size="sm" className="w-full">
                <Link href="#">See All Popular</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Categories Card */}
          <Card className="gap-0">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Categories</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-0">
              {Array.from(new Set(blogPosts.map((post) => post.category))).map(
                (category) => (
                  <Button key={category}  variant="outline" size="sm" className="justify-start">
                    <Link href="#">{category}</Link>
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
