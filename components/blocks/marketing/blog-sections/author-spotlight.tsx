"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon, Clock3Icon, ArrowRightIcon, GlobeIcon } from 'lucide-react';
import { TwitterIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import { Separator } from '@/components/ui/separator';
import Image from "next/image";
import Link from "next/link";

// Define types
interface Author {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  authorId: number;
}

// Author data
const authors: Author[] = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Chief Marketing Officer',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Emma is a marketing executive with over 15 years of experience in digital strategy, brand development, and content marketing. She specializes in helping companies leverage data to create customer-centric marketing approaches.',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#',
    },
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'SEO Specialist',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Michael is an SEO expert with a passion for helping businesses improve their online visibility. With a background in data analytics, he combines technical expertise with content strategy to drive organic growth.',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    role: 'Content Strategist',
    avatar:
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Sophia specializes in developing content strategies that align with business goals. Her expertise in storytelling and audience engagement helps brands create meaningful connections with their customers.',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#',
    },
  },
];

// Blog posts data
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title:
      'Building a Cohesive Brand Strategy in a Fragmented Digital Landscape',
    excerpt:
      'Explore strategies for maintaining brand consistency across multiple platforms while adapting to the unique requirements of each channel.',
    category: 'Branding',
    date: 'April 15, 2023',
    readTime: '10 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    authorId: 1,
  },
  {
    id: 2,
    title: 'The Future of First-Party Data in a Cookieless World',
    excerpt:
      'Learn how marketers can prepare for the phasing out of third-party cookies by building valuable first-party data strategies.',
    category: 'Data & Analytics',
    date: 'April 10, 2023',
    readTime: '12 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    authorId: 1,
  },
  {
    id: 3,
    title: 'Advanced SEO Techniques for E-Commerce Websites',
    excerpt:
      'Discover technical SEO strategies specifically designed to improve the visibility and performance of online stores.',
    category: 'SEO',
    date: 'April 12, 2023',
    readTime: '9 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    authorId: 2,
  },
  {
    id: 4,
    title: 'Maximizing ROI from Local Search Optimization',
    excerpt:
      'Learn practical strategies for small businesses to enhance their local search presence and drive qualified traffic to both digital and physical storefronts.',
    category: 'Local SEO',
    date: 'April 5, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    authorId: 2,
  },
  {
    id: 5,
    title: 'Storytelling in B2B Marketing: Breaking Through the Noise',
    excerpt:
      'Explore how narrative techniques can transform complex B2B messaging into compelling content that resonates with decision-makers.',
    category: 'Content Strategy',
    date: 'April 8, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    authorId: 3,
  },
  {
    id: 6,
    title: 'Creating Content Ecosystems That Drive the Entire Marketing Funnel',
    excerpt:
      'Learn how to develop interconnected content pieces that guide prospects from awareness to decision while providing value at each stage.',
    category: 'Content Marketing',
    date: 'April 3, 2023',
    readTime: '11 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    authorId: 3,
  },
];

interface AuthorSpotlightProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export default function BlogSectionAuthorSpotlight({ title, subtitle, posts }: AuthorSpotlightProps) {
  // Group posts by author
  const postsByAuthor = authors.map((author) => ({
    author,
    posts: blogPosts.filter((post) => post.authorId === author.id),
  }));

  return (
    <section className="container mx-auto space-y-16 px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Expert Insights</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Learn from our team of industry experts sharing their knowledge and
          experience.
        </p>
      </div>

      <Tabs defaultValue={authors[0]!.id.toString()} className="w-full">
        <div className="mb-8 flex justify-center overflow-x-auto">
          <TabsList className="grid h-fit w-full max-w-2xl justify-normal gap-2 md:grid-cols-3">
            {authors.map((author) => (
              <TabsTrigger
                key={author.id}
                value={author.id.toString()}
                className="flex items-center gap-2 px-4 py-3 whitespace-nowrap"
              >
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    className="object-cover"
                  
              fill
              sizes="100vw"
            />
                </div>
                <span className="truncate">{author.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {postsByAuthor.map(({ author, posts }) => (
          <TabsContent
            key={author.id}
            value={author.id.toString()}
            className="space-y-12"
          >
            {/* Author Bio */}
            <div className="bg-muted flex flex-col items-center gap-8 rounded-lg p-6 md:flex-row">
              <div className="border-background relative h-36 w-36 overflow-hidden rounded-full border-4">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  className="object-cover"
                
              fill
              sizes="100vw"
            />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold">{author.name}</h3>
                <p className="text-muted-foreground mb-3">{author.role}</p>
                <p className="mb-4">{author.bio}</p>

                <div className="flex justify-center gap-3 md:justify-start">
                  {author.socialLinks.twitter && (
                    <Button variant="outline" size="icon" >
                      <a href={author.socialLinks.twitter}><TwitterIcon className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {author.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" >
                      <a href={author.socialLinks.linkedin}><LinkedinIcon className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {author.socialLinks.website && (
                    <Button variant="outline" size="icon" >
                      <a href={author.socialLinks.website}><GlobeIcon className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Articles by this author */}
            <div>
              <div className="mb-6 flex items-center gap-4">
                <h3 className="text-xl font-semibold whitespace-nowrap">
                  Articles by {author.name}
                </h3>
                <Separator className="ml-2 flex-grow" />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <Card key={post.id} className="h-full overflow-hidden p-0">
                    <div className="grid h-full gap-6 sm:grid-cols-5">
                      <div className="relative aspect-square sm:col-span-2 sm:aspect-auto">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          className="object-cover"
                        
              fill
              sizes="100vw"
            />
                      </div>

                      <div className="flex flex-col p-4 sm:col-span-3 sm:p-6">
                        <div className="flex-grow space-y-2">
                          <Badge className="mb-2">{post.category}</Badge>
                          <h4 className="line-clamp-2 text-lg font-semibold">
                            {post.title}
                          </h4>
                          <p className="text-muted-foreground line-clamp-3 text-sm">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="text-muted-foreground mb-2 flex items-center text-sm">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <Clock3Icon className="mr-1 h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>

                          <Button  variant="link" className="px-0">
                            <Link href="#">Read Article{' '}<ArrowRightIcon className="ml-1 h-4 w-4" /></Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-center pt-8">
        <Button className="gap-2">
          <Link href="#">Meet Our Full Team</Link>
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
