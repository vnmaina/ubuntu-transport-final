"use client";

import { HeroBlock } from "./blocks/HeroBlock";
import { FeaturesBlock } from "./blocks/FeaturesBlock";
import { BlogBlock } from "./blocks/BlogBlock";
import { BlogCardsBlock } from "./blocks/BlogCardsBlock";
import { CareerBlock } from "./blocks/CareerBlock";
import { CardBlock } from "./blocks/CardBlock";
import { CollectionCardsBlockWrapper } from "./blocks/CollectionCardsBlockWrapper";
import { ServicesBlock } from "./blocks/ServicesBlock";
import { ProjectsBlock } from "./blocks/ProjectsBlock";
import { TeamBlock } from "./blocks/TeamBlock";
import { ProductsBlock } from "./blocks/ProductsBlock";
import { FleetBlock } from "./blocks/FleetBlock";
import { DestinationsBlock } from "./blocks/DestinationsBlock";
import { FormBlock } from "./blocks/FormBlock";
import { ContactBlock } from "./blocks/ContactBlock";
import { BookingBlock } from "./blocks/BookingBlock";
import { SubscribeBlock } from "./blocks/SubscribeBlock";
import { FeedbackBlock } from "./blocks/FeedbackBlock";
import { TextBlock } from "./blocks/TextBlock";
import { ImageText } from "./blocks/ImageText";
import { Pricing } from "./blocks/Pricing";
import { Testimonials } from "./blocks/Testimonials";
import { GalleryBlock } from "./blocks/GalleryBlock";
import { ResourcesBlock } from "./blocks/ResourcesBlock";

// Dynamic block component mapping based on block-config
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- block props are dynamic per block type
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HeroBlock,
  FeaturesBlock,
  BlogBlock,
  BlogCardsBlock,
  CareerBlock,
  CardBlock,
  CollectionCardsBlock: CollectionCardsBlockWrapper,
  ServicesBlock,
  ProjectsBlock,
  TeamBlock,
  ProductsBlock,
  FleetBlock,
  DestinationsBlock,
  FormBlock,
  ContactBlock,
  BookingBlock,
  SubscribeBlock,
  FeedbackBlock,
  TextBlock,
  ImageText,
  Pricing,
  Testimonials,
  GalleryBlock,
  ResourcesBlock,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- block props are dynamic per block type
export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 m-4 rounded">
        No sections added yet. Build layouts inside the admin manager workspace.
      </div>
    );
  }

  return (
    <>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }
        return <Component key={block.id} {...block.props} />;
      })}
    </>
  );
}
