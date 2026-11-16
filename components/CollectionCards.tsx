
"use client";

import { CardBlock, type CardBlockProps } from "@/components/blocks/CardBlock";

export interface CollectionCardsProps
  extends Omit<CardBlockProps, "cards" | "collectionSlug"> {
  collection: "services" | "fleet" | "destinations" | (string & {});
}

/**
 * Reusable collection cards component.
 *
 * Examples:
 * <CollectionCards collection="services" variant="image-cards" limit={6} />
 * <CollectionCards collection="fleet" variant="grid" columns={3} />
 * <CollectionCards collection="destinations" variant="image-cards" />
 */
export function CollectionCards({
  collection,
  variant = "image-cards",
  columns = 3,
  limit,
  title,
  subtitle,
  badge,
  tagFilter,
  showViewAll = true,
  viewAllText,
}: CollectionCardsProps) {
  return (
    <CardBlock
      collectionSlug={collection}
      variant={variant}
      columns={columns}
      limit={limit}
      title={title}
      subtitle={subtitle}
      badge={badge}
      tagFilter={tagFilter}
      showViewAll={showViewAll}
      viewAllText={viewAllText}
    />
  );
}

export default CollectionCards;
