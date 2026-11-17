"use client";

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  ChevronDown,
  Clock3Icon,
  SearchIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
}

const allPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Proven Strategies for Effective Content Marketing',
    excerpt:
      'Learn how to create content that resonates with your audience and drives engagement for your brand.',
    category: 'Content',
    date: 'April 5, 2023',
    readTime: '8 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Social Media Marketing in 2023',
    excerpt:
      'Stay ahead of the curve with these cutting-edge social media strategies to boost your online presence.',
    category: 'Social Media',
    date: 'April 2, 2023',
    readTime: '10 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 3,
    title: 'How to Measure ROI for Your Digital Marketing Campaigns',
    excerpt:
      'Track the success of your marketing efforts with these proven metrics and analytics strategies.',
    category: 'Analytics',
    date: 'March 28, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1590845947670-c009801ffa74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
  },
  {
    id: 4,
    title: 'Email Marketing Best Practices for Higher Conversion Rates',
    excerpt:
      'Optimize your email campaigns with these proven techniques to boost open rates and drive conversions.',
    category: 'Email',
    date: 'March 25, 2023',
    readTime: '6 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: 5,
    title: 'SEO Techniques That Actually Work in 2023',
    excerpt:
      "Boost your website's organic traffic with these effective SEO strategies for the current digital landscape.",
    category: 'SEO',
    date: 'March 20, 2023',
    readTime: '9 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 6,
    title: 'Building Effective B2B Marketing Strategies',
    excerpt:
      'Learn how to create impactful marketing campaigns specifically designed for business-to-business relationships.',
    category: 'B2B',
    date: 'March 18, 2023',
    readTime: '7 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
];

const categories = [
  'All',
  'Content',
  'Social Media',
  'Analytics',
  'Email',
  'SEO',
  'B2B',
];

interface CategoryFilterProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export default function BlogSectionCategoryFilter({ title, subtitle, posts }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on active category and search query
  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="container mx-auto space-y-8 px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Marketing Resources
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Explore our collection of marketing insights, guides, and best
          practices to help you grow your business.
        </p>
      </div>

      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Category filters using Dropdown for all screen sizes */}
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

        {/* Search box */}
        <div className="relative w-full sm:w-64">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="flex h-full flex-col gap-0 pt-0">
              <CardHeader className="overflow-hidden p-0">
                <div className="relative aspect-video">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  
              fill
              sizes="100vw"
            />
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-6 pb-0">
                <Badge variant="outline" className="mb-2">
                  {post.category}
                </Badge>
                <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-6">
                <div className="text-muted-foreground flex items-center text-sm">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{post.date}</span>
                  <Clock3Icon className="mr-1 ml-3 h-3 w-3" />
                  <span>{post.readTime}</span>
                </div>
                <Button  variant="ghost" size="sm">
                  <Link href="#">Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {activeCategory === 'All' && searchQuery === '' && (
        <div className="flex justify-center">
          <Button  variant="outline" className="w-full max-w-sm">
            <Link href="#">Load More Articles</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
