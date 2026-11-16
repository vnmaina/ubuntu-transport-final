
"use client";

import BlogSectionMagazineLayout from "./marketing/blog-sections/magazine-layout";
import HeroFocus from "./marketing/blog-sections/hero-focus";
import Carousel from "./marketing/blog-sections/carousel";
import CategoryFilter from "./marketing/blog-sections/category-filter";
import CompactList from "./marketing/blog-sections/compact-list";
import FeaturedWithSidebar from "./marketing/blog-sections/featured-with-sidebar";
import AuthorSpotlight from "./marketing/blog-sections/author-spotlight";
import PodcastList from "./marketing/blog-sections/podcast-list";
import VideoBlog from "./marketing/blog-sections/video-blog";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface BlogBlockProps {
  variant?:
    | "magazine"
    | "hero-focus"
    | "carousel"
    | "category-filter"
    | "compact-list"
    | "featured-sidebar"
    | "author-spotlight"
    | "podcast"
    | "video";
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Complete Guide to Content Marketing in the Digital Era",
    excerpt:
      "Discover how to create a comprehensive content strategy that drives engagement, builds authority, and converts prospects into loyal customers.",
    category: "Content Strategy",
    date: "April 15, 2023",
    readTime: "15 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1170&q=80",
    author: {
      name: "Alexandra Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: 2,
    title: "How to Create a Winning Social Media Strategy",
    excerpt:
      "Learn the essential components of an effective social media plan that aligns with your business goals.",
    category: "Social Media",
    date: "April 10, 2023",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1074&q=80",
    author: {
      name: "Marcus Johnson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: 3,
    title: "Email Marketing Automation: Best Practices",
    excerpt:
      "Explore how to implement effective email automation that nurtures leads and drives conversions.",
    category: "Email Marketing",
    date: "April 5, 2023",
    readTime: "10 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1074&q=80",
    author: {
      name: "Sophia Lee",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: 4,
    title: "The Rise of Video Marketing and Why It Matters",
    excerpt:
      "Discover why video content has become an essential part of modern marketing strategies.",
    category: "Video Marketing",
    date: "April 2, 2023",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1170&q=80",
    author: {
      name: "Daniel Rivera",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: 5,
    title: "Data-Driven Marketing: Improving Campaign Performance",
    excerpt:
      "Learn how to leverage analytics and actionable insights to optimize your marketing efforts.",
    category: "Analytics",
    date: "March 28, 2023",
    readTime: "12 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1170&q=80",
    author: {
      name: "Olivia Taylor",
      avatar:
        "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: 6,
    title: "The Complete Guide to SEO: Improving Search Visibility",
    excerpt:
      "Master essential SEO techniques to improve your website's visibility and organic traffic.",
    category: "SEO",
    date: "March 22, 2023",
    readTime: "14 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1170&q=80",
    author: {
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  },
];

export function BlogBlock({
  variant = "magazine",
  title = "Latest Articles",
  subtitle = "Stay updated with our latest insights, ideas, and news.",
  posts,
}: BlogBlockProps) {
  const postsData = posts ?? defaultPosts;

  const sharedProps = {
    title,
    subtitle,
  };

  switch (variant) {
    case "hero-focus":
      return <HeroFocus {...sharedProps} />;

    case "carousel":
      return (
        <Carousel
          {...sharedProps}
          posts={postsData}
        />
      );

    case "category-filter":
      return <CategoryFilter {...sharedProps} />;

    case "compact-list":
      return <CompactList {...sharedProps} />;

    case "featured-sidebar":
      return <FeaturedWithSidebar {...sharedProps} />;

    case "author-spotlight":
      return <AuthorSpotlight {...sharedProps} />;

    case "podcast":
      return <PodcastList {...sharedProps} />;

    case "video":
      return <VideoBlog {...sharedProps} />;

    case "magazine":
    default:
      return (
        <BlogSectionMagazineLayout
          {...sharedProps}
          posts={postsData}
        />
      );
  }
}
