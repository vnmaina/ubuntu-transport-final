"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  PlayCircleIcon,
  RssIcon,
  MicIcon,
  ClockIcon,
  TagIcon,
  ListFilterIcon,
  HeadphonesIcon,
  DownloadIcon,
} from 'lucide-react';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

// Define types
interface PodcastEpisode {
  id: number;
  title: string;
  episodeNumber: number;
  description: string;
  guest?: string;
  date: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
  tags: string[];
  category: string;
}

const episodes: PodcastEpisode[] = [
  {
    id: 1,
    title: 'The Future of Content Marketing with AI',
    episodeNumber: 42,
    description:
      'Exploring how artificial intelligence is transforming content creation, personalization, and distribution strategies. Insights from industry leaders on leveraging AI tools responsibly.',
    guest: 'Dr. Evelyn Reed',
    date: 'April 25, 2023',
    duration: '48:15',
    audioUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    tags: ['AI', 'Content Marketing', 'Future Trends'],
    category: 'Strategy',
  },
  {
    id: 2,
    title: 'Building High-Converting Landing Pages',
    episodeNumber: 41,
    description:
      'A deep dive into the principles of effective landing page design, copywriting, and optimization techniques to maximize conversion rates for your campaigns.',
    date: 'April 18, 2023',
    duration: '35:50',
    audioUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    tags: ['Landing Pages', 'Conversion Optimization', 'Web Design'],
    category: 'Web & Conversion',
  },
  {
    id: 3,
    title: 'Mastering Social Media Advertising in 2023',
    episodeNumber: 40,
    description:
      'Strategies for creating effective ad campaigns across major social platforms like Facebook, Instagram, and LinkedIn. Budgeting, targeting, and creative best practices.',
    guest: 'Mark Evans',
    date: 'April 11, 2023',
    duration: '55:30',
    audioUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    tags: ['Social Media', 'Advertising', 'Paid Marketing'],
    category: 'Social Media',
  },
  {
    id: 4,
    title: 'SEO Trends: Voice Search, Core Web Vitals, and Beyond',
    episodeNumber: 39,
    description:
      "An overview of the latest SEO developments impacting search rankings, including the rise of voice search, Google's Core Web Vitals, and algorithm updates.",
    date: 'April 4, 2023',
    duration: '42:05',
    audioUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    tags: ['SEO', 'Search Engines', 'Technical SEO'],
    category: 'SEO',
  },
];

const allCategories = [
  'All Categories',
  ...Array.from(new Set(episodes.map((e) => e.category))),
];
const allTags = [
  'All Tags',
  ...Array.from(new Set(episodes.flatMap((e) => e.tags))),
];

interface PodcastListProps {
  title?: string;
  subtitle?: string;
  posts?: PodcastEpisode[];
}

export default function BlogSectionPodcastList({ title, subtitle, posts }: PodcastListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      episode.category === selectedCategory;
    const matchesTag =
      selectedTag === 'All Tags' || episode.tags.includes(selectedTag);
    return matchesCategory && matchesTag;
  });

  return (
    <section className="container mx-auto px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="space-y-16">
        {/* Header and Intro */}
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <MicIcon className="mr-2 h-4 w-4" />
            Marketing Mavericks Podcast
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">
            Tune In to Expert Insights
          </h2>
          <p className="text-muted-foreground text-lg">
            Listen to conversations with leading marketing professionals,
            discussing the latest trends, strategies, and success stories.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              <HeadphonesIcon className="mr-2 h-5 w-5" />
              Subscribe Now
            </Button>
            <Button  variant="outline" size="lg">
              <Link href="#"><RssIcon className="mr-2 h-5 w-5" />RSS Feed</Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-b py-4 sm:flex-row">
          <h3 className="text-lg font-semibold whitespace-nowrap">
            Browse Episodes ({filteredEpisodes.length})
          </h3>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value || 'All Categories')}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <ListFilterIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value || 'All Tags')}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <TagIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Episode List */}
        <div className="space-y-12">
          {filteredEpisodes.length > 0 ? (
            filteredEpisodes.map((episode, index) => (
              <div key={episode.id}>
                <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-4">
                  {/* Image & Play */}
                  <div className="group relative aspect-square overflow-hidden rounded-lg md:col-span-1">
                    <Image
                      src={episode.imageUrl}
                      alt={episode.title}
                      className="object-cover"
                    
              fill
              sizes="100vw"
            />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-16 w-16 text-white hover:bg-white/20"
                      >
                        <PlayCircleIcon className="h-12 w-12" />
                      </Button>
                    </div>
                  </div>

                  {/* Episode Details */}
                  <div className="space-y-4 md:col-span-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge>Episode {episode.episodeNumber}</Badge>
                        <span className="text-muted-foreground text-sm">
                          {episode.date}
                        </span>
                      </div>
                      <h3 className="hover:text-primary text-2xl font-semibold transition-colors">
                        <Link href="#">{episode.title}</Link>
                      </h3>
                      {episode.guest && (
                        <p className="text-muted-foreground mt-1">
                          With special guest: {episode.guest}
                        </p>
                      )}
                    </div>

                    <p className="text-muted-foreground line-clamp-3">
                      {episode.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-muted-foreground flex items-center">
                          <ClockIcon className="mr-1 h-4 w-4" />
                          <span>{episode.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {episode.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button  variant="outline" size="sm">
                          <a href={episode.audioUrl} download><DownloadIcon className="mr-1 h-4 w-4" />Download</a>
                        </Button>
                        <Button  size="sm">
                          <Link href="#"><PlayCircleIcon className="mr-1 h-4 w-4" />Play Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < filteredEpisodes.length - 1 && (
                  <Separator className="mt-12" />
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                No episodes found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Load More / Pagination Placeholder */}
        {filteredEpisodes.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline">Load More Episodes</Button>
          </div>
        )}
      </div>
    </section>
  );
}
