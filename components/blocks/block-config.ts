// Block Configuration System
// This file serves as the single source of truth for all block types and their variants
// All blocks support multiple variants that users can select from in the admin interface

export interface BlockVariant {
  id: string;
  name: string;
  description: string;
  component: string; // Import path for the component
  props?: string[]; // Optional: specific properties this variant uses
}

export interface BlockType {
  id: string;
  name: string;
  category: string;
  description: string;
  variants: BlockVariant[];
  defaultVariant: string;
  props: {
    [key: string]: {
      type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'image' | 'video' | 'array';
      label: string;
      placeholder?: string;
      options?: string[];
      required?: boolean;
    };
  };
}

export const BLOCK_CONFIG: BlockType[] = [
  {
    id: 'HeroBlock',
    name: 'Hero Section',
    category: 'Hero Sections',
    description: 'Eye-catching hero sections with multiple layout options',
    defaultVariant: 'split-content',
    variants: [
      {
        id: 'split-content',
        name: 'Split Content',
        description: 'Text on left, image on right with badge and features',
        component: './marketing/hero-sections/split-content-hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink', 'imageUrl', 'badge', 'features']
      },
      {
        id: 'animated-gradient',
        name: 'Animated Gradient',
        description: 'Dynamic gradient background with animated elements',
        component: './marketing/hero-sections/animated-gradient',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink']
      },
      {
        id: 'gradient-mesh',
        name: 'Gradient Mesh',
        description: 'Modern gradient mesh with floating elements',
        component: './marketing/hero-sections/gradient-mesh-hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink']
      },
      {
        id: 'video-background',
        name: 'Video Background',
        description: 'Full-screen video background with overlay text',
        component: './marketing/hero-sections/video-background-hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink', 'videoUrl']
      },
      {
        id: 'image-carousel',
        name: 'Image Carousel',
        description: 'Hero with rotating image carousel',
        component: './marketing/hero-sections/image-carousel-hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink', 'imageUrl', 'imageUrls']
      },
      {
        id: 'countdown',
        name: 'Countdown Hero',
        description: 'Hero with countdown timer for launches/events',
        component: './marketing/hero-sections/countdown-hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink']
      },
      {
        id: 'split-video',
        name: 'Split with Video',
        description: 'Split layout with video on one side',
        component: './marketing/hero-sections/split-with-video',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink', 'videoUrl']
      },
      {
        id: '3d-mockup',
        name: '3D Mockup',
        description: 'Hero with 3D product mockup display',
        component: './marketing/hero-sections/with-3d-mockup',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink', 'imageUrl']
      },
      {
        id: 'simple',
        name: 'Simple Hero',
        description: 'Clean, minimal hero section',
        component: './Hero',
        props: ['title', 'subtitle', 'ctaText', 'ctaLink']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['split-content', 'animated-gradient', 'gradient-mesh', 'video-background', 'image-carousel', 'countdown', 'split-video', '3d-mockup', 'simple']
      },
      title: {
        type: 'text',
        label: 'Title',
        required: true,
        placeholder: 'Transform Your Digital Experience'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        required: true,
        placeholder: 'Discover our powerful platform with cutting-edge features...'
      },
      ctaText: {
        type: 'text',
        label: 'CTA Button Text',
        placeholder: 'Get Started'
      },
      ctaLink: {
        type: 'text',
        label: 'CTA Link',
        placeholder: '#'
      },
      imageUrl: {
        type: 'text',
        label: 'Image URL',
        placeholder: 'https://images.unsplash.com/...'
      },
      imageUrls: {
        type: 'array',
        label: 'Image URLs (for Carousel)',
        placeholder: 'Enter image URLs (one per line) - https://images.unsplash.com/...'
      },
      videoUrl: {
        type: 'text',
        label: 'Video URL',
        placeholder: 'https://youtube.com/...'
      },
      badge: {
        type: 'text',
        label: 'Badge Text',
        placeholder: 'New Release'
      },
      features: {
        type: 'array',
        label: 'Feature List',
        placeholder: 'Enter features (one per line)'
      },
      tags: {
        type: 'array',
        label: 'Tags',
        placeholder: 'Enter tags (one per line)'
      }
    }
  },
  {
    id: 'FeaturesBlock',
    name: 'Features Section',
    category: 'Content Sections',
    description: 'Showcase your product features with various layouts',
    defaultVariant: '3d-cards',
    variants: [
      {
        id: '3d-cards',
        name: '3D Cards',
        description: 'Interactive 3D card layout with hover effects',
        component: './marketing/feature-sections/3d-cards',
        props: ['title', 'subtitle', 'features']
      },
      {
        id: 'carousel',
        name: 'Carousel',
        description: 'Horizontal scrolling feature carousel',
        component: './marketing/feature-sections/with-carousel',
        props: ['title', 'subtitle', 'features']
      },
      {
        id: 'simple-grid',
        name: 'Simple Grid',
        description: 'Clean grid layout with icons',
        component: './Features',
        props: ['title', 'subtitle', 'features']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['3d-cards', 'carousel', 'simple-grid']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        required: true,
        placeholder: 'Our Core Features'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Everything you need to scale your product efficiently.'
      },
      features: {
        type: 'array',
        label: 'Features',
        placeholder: 'Enter features (title, description, icon)'
      }
    }
  },
  {
    id: 'BlogBlock',
    name: 'Blog Section',
    category: 'Blog & Career',
    description: 'Display blog posts with various layout options',
    defaultVariant: 'magazine',
    variants: [
      {
        id: 'magazine',
        name: 'Magazine Layout',
        description: 'Editorial magazine-style blog grid',
        component: './marketing/blog-sections/magazine-layout',
        props: ['title', 'subtitle']
      },
      {
        id: 'hero-focus',
        name: 'Hero Focus',
        description: 'Featured post with smaller grid below',
        component: './marketing/blog-sections/hero-focus',
        props: ['title', 'subtitle']
      },
      {
        id: 'carousel',
        name: 'Carousel',
        description: 'Horizontal scrolling blog carousel',
        component: './marketing/blog-sections/carousel',
        props: ['title', 'subtitle']
      },
      {
        id: 'category-filter',
        name: 'Category Filter',
        description: 'Blog grid with category filtering',
        component: './marketing/blog-sections/category-filter',
        props: ['title', 'subtitle']
      },
      {
        id: 'compact-list',
        name: 'Compact List',
        description: 'Minimal list-style blog layout',
        component: './marketing/blog-sections/compact-list',
        props: ['title', 'subtitle']
      },
      {
        id: 'featured-sidebar',
        name: 'Featured with Sidebar',
        description: 'Featured post with sidebar layout',
        component: './marketing/blog-sections/featured-with-sidebar',
        props: ['title', 'subtitle']
      },
      {
        id: 'author-spotlight',
        name: 'Author Spotlight',
        description: 'Focus on author profiles and posts',
        component: './marketing/blog-sections/author-spotlight',
        props: ['title', 'subtitle']
      },
      {
        id: 'podcast',
        name: 'Podcast List',
        description: 'Audio/podcast episode layout',
        component: './marketing/blog-sections/podcast-list',
        props: ['title', 'subtitle']
      },
      {
        id: 'video',
        name: 'Video Blog',
        description: 'Video-focused blog layout',
        component: './marketing/blog-sections/video-blog',
        props: ['title', 'subtitle']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['magazine', 'hero-focus', 'carousel', 'category-filter', 'compact-list', 'featured-sidebar', 'author-spotlight', 'podcast', 'video']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        required: true,
        placeholder: 'Latest Articles'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Stay updated with our latest insights and news'
      },
      posts: {
        type: 'array',
        label: 'Blog Posts',
        placeholder: 'Enter blog post data (title, excerpt, category, date, imageUrl, author)'
      }
    }
  },
  {
    id: 'BlogCardsBlock',
    name: 'Blog Cards',
    category: 'Blog & Career',
    description: 'Display real published blog posts from your CMS as cards',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Responsive grid of blog post cards',
        component: './BlogCardsBlock',
        props: ['title', 'subtitle', 'categorySlug', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of blog post cards',
        component: './BlogCardsBlock',
        props: ['title', 'subtitle', 'categorySlug', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of blog posts',
        component: './BlogCardsBlock',
        props: ['title', 'subtitle', 'categorySlug', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Latest Articles'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Stay updated with our latest insights and news'
      },
      categorySlug: {
        type: 'text',
        label: 'Category Slug (optional)',
        placeholder: 'e.g., safari-guides — leave empty for all'
      },
      limit: {
        type: 'number',
        label: 'Posts to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., safari'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View all articles'
      }
    }
  },
  {
    id: 'GalleryBlock',
    name: 'Gallery',
    category: 'Content Sections',
    description: 'Image & video gallery with grid or carousel layouts and full media metadata',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid',
        description: 'Responsive grid of images and videos',
        component: './GalleryBlock',
        props: ['title', 'subtitle', 'text', 'images']
      },
      {
        id: 'carousel',
        name: 'Carousel',
        description: 'Swipeable carousel of images and videos',
        component: './GalleryBlock',
        props: ['title', 'subtitle', 'text', 'images']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Layout',
        required: true,
        options: ['grid', 'carousel']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Fleet & Destinations'
      },
      subtitle: {
        type: 'text',
        label: 'Subtitle',
        placeholder: 'Kenya & beyond'
      },
      text: {
        type: 'textarea',
        label: 'Description',
        placeholder: 'A short description shown under the heading...'
      },
      images: {
        type: 'array',
        label: 'Media Items',
        placeholder: 'Add images and videos with titles, alt text, credits and links'
      }
    }
  },
  {
    id: 'CareerBlock',
    name: 'Career Section',
    category: 'Blog & Career',
    description: 'Display job openings and company information',
    defaultVariant: 'job-listings',
    variants: [
      {
        id: 'job-listings',
        name: 'Job Listings',
        description: 'Grid of available job positions',
        component: './marketing/careers/job-listings',
        props: ['title', 'subtitle']
      },
      {
        id: 'featured-slider',
        name: 'Featured Job Slider',
        description: 'Carousel of featured positions',
        component: './marketing/careers/featured-job-slider',
        props: ['title', 'subtitle']
      },
      {
        id: 'benefits',
        name: 'Company Benefits',
        description: 'Showcase company perks and benefits',
        component: './marketing/careers/company-benefits',
        props: ['title', 'subtitle']
      },
      {
        id: 'culture',
        name: 'Workplace Culture',
        description: 'Highlight company culture and values',
        component: './marketing/careers/workplace-culture',
        props: ['title', 'subtitle']
      },
      {
        id: 'job-details',
        name: 'Job Details',
        description: 'Detailed single job posting view',
        component: './marketing/careers/job-details',
        props: ['title', 'subtitle']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['job-listings', 'featured-slider', 'benefits', 'culture', 'job-details']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        required: true,
        placeholder: 'Join Our Team'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Build your career with a company that values innovation and growth'
      }
    }
  },
  {
    id: 'CardBlock',
    name: 'Cards & Grid',
    category: 'Content Sections',
    description: 'Flexible card layouts for various content types',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of cards',
        component: './CardBlock',
        props: ['title', 'cards']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid',
        component: './CardBlock',
        props: ['title', 'cards']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal card list',
        component: './CardBlock',
        props: ['title', 'cards']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'masonry', 'list']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Services'
      },
      cards: {
        type: 'array',
        label: 'Cards',
        placeholder: 'Enter card data'
      }
    }
  },
  {
    id: 'CollectionCardsBlock',
    name: 'Collection Cards',
    category: 'Content Sections',
    description: 'Display items from your collections (services, projects, team, etc.)',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of collection items',
        component: './CollectionCardsBlockWrapper',
        props: ['title', 'collectionSlug', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of collection items',
        component: './CollectionCardsBlockWrapper',
        props: ['title', 'collectionSlug', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of collection items',
        component: './CollectionCardsBlockWrapper',
        props: ['title', 'collectionSlug', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Services'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Browse our offerings...'
      },
      collectionSlug: {
        type: 'select',
        label: 'Collection',
        required: true,
        options: ['services', 'projects', 'team', 'products', 'fleet', 'destinations']
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Services'
      }
    }
  },
  {
    id: 'ServicesBlock',
    name: 'Services',
    category: 'Collections',
    description: 'Display your services collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of services',
        component: './ServicesBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of services',
        component: './ServicesBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of services',
        component: './ServicesBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Services'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Browse our service offerings...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Services'
      }
    }
  },
  {
    id: 'ProjectsBlock',
    name: 'Projects',
    category: 'Collections',
    description: 'Display your projects collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of projects',
        component: './ProjectsBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of projects',
        component: './ProjectsBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of projects',
        component: './ProjectsBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Projects'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Browse our project portfolio...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Projects'
      }
    }
  },
  {
    id: 'TeamBlock',
    name: 'Team',
    category: 'Collections',
    description: 'Display your team collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of team members',
        component: './TeamBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of team members',
        component: './TeamBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of team members',
        component: './TeamBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Team'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Meet our talented team...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Team'
      }
    }
  },
  {
    id: 'ProductsBlock',
    name: 'Products',
    category: 'Collections',
    description: 'Display your products collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of products',
        component: './ProductsBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of products',
        component: './ProductsBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of products',
        component: './ProductsBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Products'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Browse our product catalog...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Products'
      }
    }
  },
  {
    id: 'FleetBlock',
    name: 'Fleet',
    category: 'Collections',
    description: 'Display your fleet collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of fleet items',
        component: './FleetBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of fleet items',
        component: './FleetBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of fleet items',
        component: './FleetBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Fleet'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Browse our fleet...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Fleet'
      }
    }
  },
  {
    id: 'DestinationsBlock',
    name: 'Destinations',
    category: 'Collections',
    description: 'Display your destinations collection',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Standard responsive grid of destinations',
        component: './DestinationsBlock',
        props: ['title', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'List Layout',
        description: 'Horizontal list of destinations',
        component: './DestinationsBlock',
        props: ['title', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Layout',
        description: 'Pinterest-style masonry grid of destinations',
        component: './DestinationsBlock',
        props: ['title', 'limit', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid', 'list', 'masonry']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Our Destinations'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Explore our destinations...'
      },
      limit: {
        type: 'number',
        label: 'Items to Display',
        placeholder: '6'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      },
      tagFilter: {
        type: 'text',
        label: 'Tag Filter (optional)',
        placeholder: 'e.g., featured'
      },
      showViewAll: {
        type: 'boolean',
        label: 'Show View All Button'
      },
      viewAllText: {
        type: 'text',
        label: 'View All Button Text',
        placeholder: 'View All Destinations'
      }
    }
  },
  {
    id: 'Pricing',
    name: 'Pricing Section',
    category: 'Content Sections',
    description: 'Display pricing plans and packages',
    defaultVariant: 'cards',
    variants: [
      {
        id: 'cards',
        name: 'Pricing Cards',
        description: 'Standard pricing card layout',
        component: './Pricing',
        props: ['title', 'plans']
      },
      {
        id: 'stacked',
        name: 'Stacked Layout',
        description: 'Vertical stacked pricing layout',
        component: './marketing/pricing-sections/stacked',
        props: ['title', 'plans']
      },
      {
        id: 'custom-builder',
        name: 'Custom Builder',
        description: 'Interactive pricing calculator',
        component: './marketing/pricing-sections/custom-builder',
        props: ['title', 'plans']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['cards', 'stacked', 'custom-builder']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Pricing Plans'
      },
      plans: {
        type: 'array',
        label: 'Plans',
        placeholder: 'Enter pricing plans'
      }
    }
  },
  {
    id: 'Testimonials',
    name: 'Testimonials',
    category: 'Content Sections',
    description: 'Customer reviews and testimonials',
    defaultVariant: 'grid',
    variants: [
      {
        id: 'grid',
        name: 'Grid Layout',
        description: 'Grid of testimonial cards',
        component: './Testimonials',
        props: ['title', 'testimonials']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['grid']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'What Our Customers Say'
      },
      testimonials: {
        type: 'array',
        label: 'Testimonials',
        placeholder: 'Enter testimonials (name, role, content)'
      }
    }
  },
  {
    id: 'FormBlock',
    name: 'Universal Form',
    category: 'Form & Lead Capture',
    description: 'Versatile form block for various purposes',
    defaultVariant: 'contact',
    variants: [
      {
        id: 'contact',
        name: 'Contact Form',
        description: 'Standard contact form layout',
        component: './FormBlock',
        props: ['title', 'layout']
      },
      {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'Email subscription form',
        component: './FormBlock',
        props: ['title', 'layout']
      },
      {
        id: 'feedback',
        name: 'Feedback Form',
        description: 'Customer feedback collection',
        component: './FormBlock',
        props: ['title', 'layout']
      },
      {
        id: 'survey',
        name: 'Survey Form',
        description: 'Survey and questionnaire',
        component: './FormBlock',
        props: ['title', 'layout']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Form Type',
        required: true,
        options: ['contact', 'newsletter', 'feedback', 'survey']
      },
      title: {
        type: 'text',
        label: 'Form Title',
        placeholder: 'Get in Touch'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        options: ['split', 'centered', 'card']
      }
    }
  },
  {
    id: 'ContactBlock',
    name: 'Contact Section',
    category: 'Form & Lead Capture',
    description: 'Contact information and form combination',
    defaultVariant: 'split',
    variants: [
      {
        id: 'split',
        name: 'Split Layout',
        description: 'Contact info on left, form on right',
        component: './ContactBlock',
        props: ['title']
      },
      {
        id: 'with-map',
        name: 'With Map',
        description: 'Contact section with embedded map',
        component: './marketing/contact-sections/with-map',
        props: ['title']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['split', 'with-map']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: "Let's Start a Conversation"
      }
    }
  },
  {
    id: 'BookingBlock',
    name: 'Booking Form',
    category: 'Form & Lead Capture',
    description: 'Appointment and booking scheduling',
    defaultVariant: 'split',
    variants: [
      {
        id: 'split',
        name: 'Split Layout',
        description: 'Booking form with service selection',
        component: './BookingBlock',
        props: ['title']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['split']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Schedule an Appointment'
      }
    }
  },
  {
    id: 'SubscribeBlock',
    name: 'Newsletter Subscribe',
    category: 'Form & Lead Capture',
    description: 'Email subscription and newsletter signup',
    defaultVariant: 'banner',
    variants: [
      {
        id: 'banner',
        name: 'Banner Style',
        description: 'Full-width subscription banner',
        component: './SubscribeBlock',
        props: ['title']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['banner']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Stay Ahead with Our Weekly Digest'
      }
    }
  },
  {
    id: 'FeedbackBlock',
    name: 'Feedback Form',
    category: 'Form & Lead Capture',
    description: 'Customer feedback and rating collection',
    defaultVariant: 'card',
    variants: [
      {
        id: 'card',
        name: 'Card Layout',
        description: 'Feedback form in card container',
        component: './FeedbackBlock',
        props: ['title']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['card']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Tell Us What You Think'
      }
    }
  },
  {
    id: 'TextBlock',
    name: 'Text Block',
    category: 'Basic Blocks',
    description: 'Simple text content block',
    defaultVariant: 'default',
    variants: [
      {
        id: 'default',
        name: 'Default',
        description: 'Standard text block',
        component: './TextBlock',
        props: ['content', 'alignment']
      }
    ],
    props: {
      content: {
        type: 'textarea',
        label: 'Content',
        required: true,
        placeholder: 'Your text content goes here...'
      },
      alignment: {
        type: 'select',
        label: 'Alignment',
        options: ['left', 'center', 'right']
      }
    }
  },
  {
    id: 'ImageText',
    name: 'Image + Text',
    category: 'Basic Blocks',
    description: 'Image and text combination block',
    defaultVariant: 'left',
    variants: [
      {
        id: 'left',
        name: 'Image Left',
        description: 'Image on left, text on right',
        component: './ImageText',
        props: ['title', 'subtitle', 'content', 'imageUrl', 'badge', 'highlights', 'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink', 'statValue', 'statLabel']
      },
      {
        id: 'right',
        name: 'Image Right',
        description: 'Text on left, image on right',
        component: './ImageText',
        props: ['title', 'subtitle', 'content', 'imageUrl', 'badge', 'highlights', 'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink', 'statValue', 'statLabel']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Variant',
        required: true,
        options: ['left', 'right']
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Section Title'
      },
      content: {
        type: 'textarea',
        label: 'Content',
        placeholder: 'Your content description goes here...'
      },
      imageUrl: {
        type: 'image',
        label: 'Image URL',
        placeholder: 'https://images.unsplash.com/...'
      },
      badge: {
        type: 'text',
        label: 'Floating Badge',
        placeholder: 'e.g. 24/7 Airport Transfers'
      },
      subtitle: {
        type: 'text',
        label: 'Eyebrow Label',
        placeholder: 'e.g. Safari & Tour Transport'
      },
      ctaText: {
        type: 'text',
        label: 'Primary Button Text',
        placeholder: 'Book Your Safari'
      },
      ctaLink: {
        type: 'text',
        label: 'Primary Button Link',
        placeholder: '/collections/services'
      },
      secondaryCtaText: {
        type: 'text',
        label: 'Secondary Button Text',
        placeholder: 'Explore Destinations'
      },
      secondaryCtaLink: {
        type: 'text',
        label: 'Secondary Button Link',
        placeholder: '/collections/destinations'
      },
      highlights: {
        type: 'array',
        label: 'Highlights (one per line)',
        placeholder: 'e.g. Pop-up safari roofs, Professional driver-guides'
      },
      statValue: {
        type: 'text',
        label: 'Stat Value',
        placeholder: 'e.g. 50+'
      },
      statLabel: {
        type: 'text',
        label: 'Stat Label',
        placeholder: 'e.g. Destinations Covered'
      }
    }
  },
  {
    id: 'CardBlock',
    name: 'Collection Cards & Highlights',
    category: 'Content Sections',
    description: 'Display cards for specific collections (Services, Fleet, Destinations) or custom features on any route',
    defaultVariant: 'image-cards',
    variants: [
      {
        id: 'image-cards',
        name: 'Image Cards (Collections & Services)',
        description: 'Vibrant photo cards with price badge, description, and link to collection item',
        component: './CardBlock',
        props: ['title', 'subtitle', 'badge', 'collectionSlug', 'limit', 'columns']
      },
      {
        id: 'grid',
        name: 'Grid Cards',
        description: 'Clean icon or feature grid cards',
        component: './CardBlock',
        props: ['title', 'subtitle', 'badge', 'collectionSlug', 'limit', 'columns']
      },
      {
        id: 'list',
        name: 'Horizontal List Cards',
        description: 'Wide horizontal cards with photo on left and details on right',
        component: './CardBlock',
        props: ['title', 'subtitle', 'badge', 'collectionSlug', 'limit']
      },
      {
        id: 'masonry',
        name: 'Masonry Cards',
        description: 'Dynamic height masonry card column layout',
        component: './CardBlock',
        props: ['title', 'subtitle', 'badge', 'collectionSlug', 'limit']
      },
      {
        id: 'stats',
        name: 'Stats Cards',
        description: 'Numerical metric counter and stat cards',
        component: './CardBlock',
        props: ['title', 'subtitle', 'badge', 'columns']
      }
    ],
    props: {
      variant: {
        type: 'select',
        label: 'Card Layout Variant',
        required: true,
        options: ['image-cards', 'grid', 'list', 'masonry', 'stats']
      },
      collectionSlug: {
        type: 'select',
        label: 'Source Collection',
        options: ['services', 'fleet', 'destinations', 'none'],
        placeholder: 'Select a collection (services, fleet, destinations, or none)'
      },
      title: {
        type: 'text',
        label: 'Section Title',
        placeholder: 'Featured Services & Offerings'
      },
      subtitle: {
        type: 'textarea',
        label: 'Subtitle',
        placeholder: 'Discover our premium transport, tour packages, and corporate solutions.'
      },
      badge: {
        type: 'text',
        label: 'Badge Text',
        placeholder: 'Our Offerings'
      },
      limit: {
        type: 'number',
        label: 'Max Items to Show',
        placeholder: '3'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: ['2', '3', '4']
      }
    }
  }
];

// Helper functions
export function getBlockConfig(blockId: string): BlockType | undefined {
  return BLOCK_CONFIG.find(block => block.id === blockId);
}

export function getBlockVariants(blockId: string): BlockVariant[] {
  const config = getBlockConfig(blockId);
  return config?.variants || [];
}

export function getDefaultProps(blockId: string): Record<string, unknown> {
  const config = getBlockConfig(blockId);
  if (!config) return {};

  const defaultProps: Record<string, unknown> = {
    variant: config.defaultVariant
  };

  // Set default values for required props
  Object.entries(config.props).forEach(([key, propConfig]) => {
    if (propConfig.required && !defaultProps[key]) {
      defaultProps[key] = propConfig.placeholder || '';
    }
  });

  // Add specific defaults for array types
  if (blockId === 'Testimonials') {
    defaultProps.testimonials = [
      { name: "John Doe", role: "CEO", content: "This product is amazing!" },
      { name: "Jane Smith", role: "CTO", content: "Changed our workflow completely." },
      { name: "Bob Johnson", role: "Developer", content: "Best investment we made." },
    ];
  }

  if (blockId === 'Pricing') {
    defaultProps.plans = [
      {
        name: "Basic",
        price: "$9",
        description: "Perfect for individuals",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        ctaText: "Get Started",
      },
      {
        name: "Pro",
        price: "$29",
        description: "Best for small teams",
        features: ["All Basic features", "Feature 4", "Feature 5"],
        ctaText: "Get Started",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "$99",
        description: "For large organizations",
        features: ["All Pro features", "Feature 6", "Feature 7"],
        ctaText: "Contact Sales",
      },
    ];
  }

  if (blockId === 'Features') {
    defaultProps.features = [
      { title: "Feature 1", description: "Description for feature 1", icon: "🚀" },
      { title: "Feature 2", description: "Description for feature 2", icon: "⚡" },
      { title: "Feature 3", description: "Description for feature 3", icon: "🎯" },
    ];
  }

  if (blockId === 'BlogBlock') {
    defaultProps.posts = [
      {
        id: 1,
        title: 'The Complete Guide to Content Marketing in the Digital Era',
        excerpt: 'Discover how to create a comprehensive content strategy that drives engagement, builds authority, and converts prospects into loyal customers.',
        category: 'Content Strategy',
        date: 'April 15, 2023',
        readTime: '15 min read',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        author: {
          name: 'Alexandra Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        },
      },
      {
        id: 2,
        title: 'How to Create a Winning Social Media Strategy for 2023',
        excerpt: 'Learn the essential components of an effective social media plan that aligns with your business goals.',
        category: 'Social Media',
        date: 'April 10, 2023',
        readTime: '8 min read',
        imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        author: {
          name: 'Marcus Johnson',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        },
      },
      {
        id: 3,
        title: 'Email Marketing Automation: Best Practices for 2023',
        excerpt: 'Explore how to implement effective email automation that nurtures leads and drives conversions.',
        category: 'Email',
        date: 'April 5, 2023',
        readTime: '10 min read',
        imageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        author: {
          name: 'Sophia Lee',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
        },
      },
    ];
  }

  if (blockId === 'HeroBlock') {
    defaultProps.imageUrls = [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    ];
  }

  if (blockId === 'CardBlock') {
    defaultProps.variant = 'image-cards';
    defaultProps.collectionSlug = 'services';
    defaultProps.title = 'Featured Services';
    defaultProps.subtitle = 'Reliable corporate shuttles, wildlife safari circuits, and VIP transfers.';
    defaultProps.badge = 'Services';
    defaultProps.columns = 3;
    defaultProps.limit = 6;
    defaultProps.showViewAll = true;
  }

  return defaultProps;
}

export function getBlockCategories(): string[] {
  return Array.from(new Set(BLOCK_CONFIG.map(block => block.category)));
}

export function getBlocksByCategory(category: string): BlockType[] {
  return BLOCK_CONFIG.filter(block => block.category === category);
}