"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  CalendarIcon,
  Clock3Icon,
  ArrowRightIcon,
  BookmarkIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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

interface BlogSectionMagazineLayoutProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Complete Guide to Content Marketing in the Digital Era',
    excerpt:
      'Discover how to create a comprehensive content strategy that drives engagement, builds authority, and converts prospects into loyal customers.',
    category: 'Content Strategy',
    date: 'April 15, 2023',
    readTime: '15 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      name: 'Alexandra Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 2,
    title: 'How to Create a Winning Social Media Strategy for 2023',
    excerpt:
      'Learn the essential components of an effective social media plan that aligns with your business goals.',
    category: 'Social Media',
    date: 'April 10, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    author: {
      name: 'Marcus Johnson',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 3,
    title: 'Email Marketing Automation: Best Practices for 2023',
    excerpt:
      'Explore how to implement effective email automation that nurtures leads and drives conversions.',
    category: 'Email',
    date: 'April 5, 2023',
    readTime: '10 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    author: {
      name: 'Sophia Lee',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 4,
    title: "The Rise of Video Marketing: Why It's Essential for Your Business",
    excerpt:
      'Discover why video content has become a non-negotiable part of modern marketing strategies.',
    category: 'Video',
    date: 'April 2, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    author: {
      name: 'Daniel Rivera',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 5,
    title: 'Data-Driven Marketing: How to Use Analytics to Improve Campaigns',
    excerpt:
      'Learn how to leverage data to optimize your marketing efforts and improve ROI.',
    category: 'Analytics',
    date: 'March 28, 2023',
    readTime: '12 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      name: 'Olivia Taylor',
      avatar:
        'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
  {
    id: 6,
    title: 'The Complete Guide to SEO: Ranking Higher in 2023',
    excerpt:
      "Master the essential SEO techniques to improve your website's visibility and organic traffic.",
    category: 'SEO',
    date: 'March 22, 2023',
    readTime: '14 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    author: {
      name: 'James Wilson',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    },
  },
];

export default function BlogSectionMagazineLayout({
  title = "Digital Marketing Magazine",
  subtitle = "Cutting-edge insights, strategies, and trends to keep your marketing skills sharp.",
  posts = defaultPosts
}: BlogSectionMagazineLayoutProps) {
  const featuredPost = posts[0];
  const editorsPicks = posts.slice(1, 3);
  const trendingPosts = posts.slice(3);

  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="mb-16 space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="space-y-20">
        {/* Featured Article */}
        {featuredPost && (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="object-cover"
              
              fill
              sizes="100vw"
            />
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Featured
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  {featuredPost.category}
                </Badge>
                <h3 className="text-3xl font-bold tracking-tight">
                  {featuredPost.title}
                </h3>
              </div>

              <p className="text-muted-foreground text-lg">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4">
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
                  <div className="text-muted-foreground flex items-center text-sm">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>{featuredPost.date}</span>
                    <span className="mx-2">•</span>
                    <Clock3Icon className="mr-1 h-3 w-3" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>

              <Button size="lg" >
                <Link href="#">Read Full Article</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Editor's Picks Section */}
        {editorsPicks.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="text-2xl font-bold">Editor&apos;s Picks</h3>
              <Separator className="flex-grow" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {editorsPicks.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-none shadow-lg"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover"
                    
              fill
              sizes="100vw"
            />
                    <div className="absolute top-4 left-4">
                      <Badge>{post.category}</Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-4 pt-6">
                    <h4 className="line-clamp-2 text-xl font-bold">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between pt-0">
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
                    <Button variant="ghost" size="sm" className="gap-1" >
                      <Link href="#"><span>Read</span><ArrowRightIcon className="h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {trendingPosts.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="text-2xl font-bold">Trending Now</h3>
              <Separator className="flex-grow" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingPosts.map((post) => (
                <Card key={post.id} className="flex h-full flex-col">
                  <div className="relative aspect-video">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    
              fill
              sizes="100vw"
            />
                    <div className="from-background/80 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/50 hover:bg-background/70 absolute top-2 right-2"
                    >
                      <BookmarkIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardContent className="flex-grow py-4">
                    <Badge variant="outline" className="mb-2">
                      {post.category}
                    </Badge>
                    <h4 className="mb-2 line-clamp-2 font-semibold">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                      {post.excerpt}
                    </p>

                    <div className="text-muted-foreground mt-auto flex items-center text-sm">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <Clock3Icon className="mr-1 h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0" >
                      <Link href="#">Read Article <ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 flex justify-center">
        <Button variant="outline" size="lg" className="gap-2" >
          <Link href="#">View All Articles
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
