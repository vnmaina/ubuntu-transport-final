import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ItemView } from "./item-view";
import { JsonLd } from "@/components/JsonLd";
import {
  getSiteUrl,
  getCollectionUrl,
  stripHtml,
  absoluteUrl,
} from "@/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string; itemSlug: string }>;
}

async function loadData(slug: string, itemSlug: string) {
  const [collection, item] = await Promise.all([
    fetchQuery(api.collections.getCollectionBySlug, { slug }),
    fetchQuery(api.collections.getCollectionItemBySlug, { slug: itemSlug }),
  ]);
  return { collection, item };
}

function getItemUrl(collectionSlug: string, itemSlug: string, siteUrl: string, canonical?: string) {
  return canonical || `${siteUrl}/collections/${collectionSlug}/${itemSlug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const [{ collection, item }, organization] = await Promise.all([
    loadData(slug, itemSlug),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!collection || !item) return {};

  const siteUrl = getSiteUrl(organization);
  const pageUrl = getItemUrl(collection.slug, item.slug, siteUrl, item.canonicalUrl);
  const title = item.metaTitle || item.title;
  const description =
    item.metaDescription ||
    stripHtml(item.description).slice(0, 160) ||
    `Learn more about ${item.title} in our ${collection.name} collection.`;
  const keywords =
    item.tags && item.tags.length > 0
      ? item.tags
      : organization?.defaultKeywords;

  const ogImage =
    absoluteUrl(siteUrl, item.ogImage) ||
    absoluteUrl(siteUrl, item.imageUrl) ||
    absoluteUrl(siteUrl, collection.ogImage) ||
    absoluteUrl(siteUrl, organization?.defaultOgImage);
  const twitterImage = ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: organization?.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
    },
    twitter: {
      card: (item.twitterCard ||
        organization?.defaultTwitterCard ||
        "summary_large_image") as
        | "summary"
        | "summary_large_image"
        | "player"
        | "app",
      title,
      description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: item.robots || collection.robots || organization?.defaultRobots || "index, follow",
  };
}

export default async function CollectionItemPage({ params }: PageProps) {
  const { slug, itemSlug } = await params;

  const [{ collection, item }, organization] = await Promise.all([
    loadData(slug, itemSlug),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!collection || !item) notFound();
  if (!collection.published || !item.published) redirect("/collections");

  const siblingItems = await fetchQuery(api.collections.getPublishedItemsByCollection, {
    collectionId: collection._id,
  }).catch(() => []);

  const relatedItems = siblingItems
    .filter((sibling) => sibling._id !== item._id && sibling.slug)
    .slice(0, 6);

  const siteUrl = getSiteUrl(organization);
  const pageUrl = getItemUrl(collection.slug, item.slug, siteUrl, item.canonicalUrl);
  const title = item.metaTitle || item.title;
  const description =
    item.metaDescription ||
    stripHtml(item.description).slice(0, 160) ||
    `Learn more about ${item.title} in our ${collection.name} collection.`;
  const collectionUrl = getCollectionUrl(collection, siteUrl);

  const ogImageUrl =
    absoluteUrl(siteUrl, item.ogImage) ||
    absoluteUrl(siteUrl, item.imageUrl) ||
    absoluteUrl(siteUrl, collection.ogImage) ||
    absoluteUrl(siteUrl, organization?.defaultOgImage);
  const keywords =
    item.tags && item.tags.length > 0
      ? item.tags
      : organization?.defaultKeywords;

  const webPageLd: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description: description || undefined,
    keywords: keywords ? keywords.join(", ") : undefined,
    image: ogImageUrl ? [ogImageUrl] : undefined,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: organization?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
    inLanguage: "en",
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: organization?.name || "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${siteUrl}/collections` },
      { "@type": "ListItem", position: 3, name: collection.name, item: collectionUrl },
      { "@type": "ListItem", position: 4, name: item.title, item: pageUrl },
    ],
  };

  const jsonLdBlocks: Array<Record<string, unknown>> = [webPageLd, breadcrumbLd];

  // Typed entity schema based on collection type
  const serviceCollections = ["services", "fleet", "destinations"];
  if (collection.slug === "products") {
    jsonLdBlocks.push({
      "@type": "Product",
      "@id": `${pageUrl}#product`,
      name: item.title,
      description: description || undefined,
      image: ogImageUrl ? [ogImageUrl] : undefined,
      url: pageUrl,
      brand: organization?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
      ...(item.metadata?.sku ? { sku: item.metadata.sku } : {}),
    });
  } else if (serviceCollections.includes(collection.slug)) {
    jsonLdBlocks.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: item.title,
      description: description || undefined,
      image: ogImageUrl ? [ogImageUrl] : undefined,
      url: pageUrl,
      provider: organization?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
      areaServed:
        collection.areasServed && collection.areasServed.length > 0
          ? collection.areasServed.map((area: string) => ({ "@type": "Place", name: area }))
          : undefined,
    });
  }

  // FAQPage schema when the item has FAQs
  if (item.faq && item.faq.length > 0) {
    jsonLdBlocks.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: item.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: stripHtml(f.answer) },
      })),
    });
  }

  return (
    <>
      <ItemView
        collection={collection}
        item={item}
        relatedItems={relatedItems}
        organization={
          organization
            ? {
                name: organization.name,
                phone: organization.phone,
                whatsapp: organization.whatsapp,
                email: organization.email,
              }
            : undefined
        }
      />
      {jsonLdBlocks.map((data, index) => (
        <JsonLd key={`ld-${index}`} data={data} />
      ))}
    </>
  );
}
