import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { CollectionView } from "./collection-view";
import { JsonLd } from "@/components/JsonLd";
import {
  getSiteUrl,
  getCollectionUrl,
  getCollectionTitle,
  getCollectionDescription,
  getCollectionKeywords,
  buildCollectionJsonLd,
  parseManualStructuredData,
  absoluteUrl,
} from "@/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadCollection(slug: string) {
  return fetchQuery(api.collections.getCollectionBySlug, { slug });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [collection, organization] = await Promise.all([
    loadCollection(slug),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!collection) return {};

  const siteUrl = getSiteUrl(organization);
  const pageUrl = getCollectionUrl(collection, siteUrl);
  const title = getCollectionTitle(collection, organization);
  const description = getCollectionDescription(collection, organization);
  const keywords = getCollectionKeywords(collection, organization);

  const ogImage =
    absoluteUrl(siteUrl, collection.ogImage) ||
    absoluteUrl(siteUrl, organization?.defaultOgImage);
  const twitterImage = absoluteUrl(siteUrl, collection.twitterImage) || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: collection.canonicalUrl || pageUrl },
    openGraph: {
      title: collection.ogTitle || title,
      description: collection.ogDescription || description,
      url: pageUrl,
      siteName: organization?.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: (collection.twitterCard ||
        organization?.defaultTwitterCard ||
        "summary_large_image") as
        | "summary"
        | "summary_large_image"
        | "player"
        | "app",
      title: collection.twitterTitle || title,
      description: collection.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: collection.robots || organization?.defaultRobots || "index, follow",
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;

  const collection = await loadCollection(slug);
  if (!collection) notFound();
  if (!collection.published) redirect("/collections");

  const [organization, items] = await Promise.all([
    fetchQuery(api.organization.getOrganization).catch(() => null),
    fetchQuery(api.collections.getPublishedItemsByCollection, {
      collectionId: collection._id,
    }),
  ]);

  const siteUrl = getSiteUrl(organization);
  const autoJsonLd = buildCollectionJsonLd(
    collection,
    organization,
    siteUrl,
    items.map((item) => ({
      title: item.title,
      slug: item.slug,
      description: item.description,
      imageUrl: item.imageUrl,
    }))
  );
  const manualJsonLd = parseManualStructuredData(collection.jsonLd);

  return (
    <>
      <CollectionView collection={collection} items={items} />
      {autoJsonLd.map((data, index) => (
        <JsonLd key={`auto-${index}`} data={data} />
      ))}
      {manualJsonLd?.map((data, index) => (
        <JsonLd key={`manual-${index}`} data={data} />
      ))}
    </>
  );
}
