// Component Form Registry
// Maps component paths to their specific form components
// This allows for component-specific editing based on the selected variant

import { ImageCarouselHeroForm } from './ImageCarouselHeroForm';
import { CardBlockForm } from './CardBlockForm';
import { GalleryBlockForm } from './GalleryBlockForm';

export interface ComponentFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block props are dynamic per block type
  props: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block props are dynamic per block type
  onChange: (key: string, value: any) => void;
  mode?: 'form' | 'edit' | 'media' | 'block-editor';
}

export interface ComponentFormRegistration {
  componentPath: string;
  formComponent: React.ComponentType<ComponentFormProps> | null;
  // Component-specific tabs configuration
  tabs?: {
    form?: boolean;
    edit?: boolean;
    media?: boolean;
    blockEditor?: boolean;
  };
}

// Registry of component forms
const COMPONENT_FORM_REGISTRY: Record<string, ComponentFormRegistration> = {
  // Hero Components
  './marketing/hero-sections/image-carousel-hero': {
    componentPath: './marketing/hero-sections/image-carousel-hero',
    formComponent: ImageCarouselHeroForm,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/hero-sections/split-content-hero': {
    componentPath: './marketing/hero-sections/split-content-hero',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/hero-sections/animated-gradient': {
    componentPath: './marketing/hero-sections/animated-gradient',
    formComponent: null,
    tabs: { form: true, edit: true, media: false, blockEditor: true }
  },
  './marketing/hero-sections/gradient-mesh-hero': {
    componentPath: './marketing/hero-sections/gradient-mesh-hero',
    formComponent: null,
    tabs: { form: true, edit: true, media: false, blockEditor: true }
  },
  './marketing/hero-sections/video-background-hero': {
    componentPath: './marketing/hero-sections/video-background-hero',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/hero-sections/countdown-hero': {
    componentPath: './marketing/hero-sections/countdown-hero',
    formComponent: null,
    tabs: { form: true, edit: true, media: false, blockEditor: true }
  },
  './marketing/hero-sections/split-with-video': {
    componentPath: './marketing/hero-sections/split-with-video',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/hero-sections/with-3d-mockup': {
    componentPath: './marketing/hero-sections/with-3d-mockup',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './Hero': {
    componentPath: './Hero',
    formComponent: null,
    tabs: { form: true, edit: true, media: false, blockEditor: true }
  },

  // Feature Components
  './marketing/feature-sections/3d-cards': {
    componentPath: './marketing/feature-sections/3d-cards',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/feature-sections/with-carousel': {
    componentPath: './marketing/feature-sections/with-carousel',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './Features': {
    componentPath: './Features',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },

  // Blog Components
  './marketing/blog-sections/magazine-layout': {
    componentPath: './marketing/blog-sections/magazine-layout',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/carousel': {
    componentPath: './marketing/blog-sections/carousel',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/hero-focus': {
    componentPath: './marketing/blog-sections/hero-focus',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/category-filter': {
    componentPath: './marketing/blog-sections/category-filter',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/compact-list': {
    componentPath: './marketing/blog-sections/compact-list',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/featured-with-sidebar': {
    componentPath: './marketing/blog-sections/featured-with-sidebar',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/author-spotlight': {
    componentPath: './marketing/blog-sections/author-spotlight',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/podcast-list': {
    componentPath: './marketing/blog-sections/podcast-list',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/blog-sections/video-blog': {
    componentPath: './marketing/blog-sections/video-blog',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },

  // Gallery Components
  './marketing/gallery/carousel-gallery': {
    componentPath: './marketing/gallery/carousel-gallery',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/gallery/grid-gallery': {
    componentPath: './marketing/gallery/grid-gallery',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/gallery/immersive-gallery': {
    componentPath: './marketing/gallery/immersive-gallery',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './marketing/gallery/portfolio-gallery': {
    componentPath: './marketing/gallery/portfolio-gallery',
    formComponent: null,
    tabs: { form: true, edit: true, media: true, blockEditor: true }
  },
  './CardBlock': {
    componentPath: './CardBlock',
    formComponent: CardBlockForm,
    tabs: { form: false, edit: true, media: false, blockEditor: true }
  },
  './GalleryBlock': {
    componentPath: './GalleryBlock',
    formComponent: GalleryBlockForm,
    tabs: { form: true, edit: true, media: false, blockEditor: true }
  },
};

// Get form registration for a component path
export function getComponentFormRegistration(componentPath: string): ComponentFormRegistration | undefined {
  return COMPONENT_FORM_REGISTRY[componentPath];
}

// Get available tabs for a component
export function getComponentTabs(componentPath: string): ComponentFormRegistration['tabs'] {
  const registration = getComponentFormRegistration(componentPath);
  return registration?.tabs || { form: true, edit: true, media: true, blockEditor: true };
}

// Check if a component has a custom form
export function hasCustomForm(componentPath: string): boolean {
  const registration = getComponentFormRegistration(componentPath);
  return registration?.formComponent !== null;
}

// Register a custom form for a component
export function registerComponentForm(
  componentPath: string,
  formComponent: React.ComponentType<ComponentFormProps>,
  tabs?: ComponentFormRegistration['tabs']
) {
  if (COMPONENT_FORM_REGISTRY[componentPath]) {
    COMPONENT_FORM_REGISTRY[componentPath].formComponent = formComponent;
    if (tabs) {
      COMPONENT_FORM_REGISTRY[componentPath].tabs = tabs;
    }
  } else {
    COMPONENT_FORM_REGISTRY[componentPath] = {
      componentPath,
      formComponent,
      tabs: tabs || { form: true, edit: true, media: true, blockEditor: true }
    };
  }
}