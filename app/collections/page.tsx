import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Metadata } from "next";
import { CollectionsView } from "./collections-view";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const organization = await fetchQuery(api.organization.getOrganization).catch(() => null);
  const siteUrl = getSiteUrl(organization);

  return {
    title: organization?.defaultMetaTitle || "Collections",
    description:
      organization?.defaultMetaDescription ||
      "Browse our collections of services, projects, team, and products.",
    keywords: organization?.defaultKeywords,
    alternates: { canonical: `${siteUrl}/collections` },
    openGraph: {
      title: "Collections",
      description:
        organization?.defaultMetaDescription ||
        "Browse our collections of services, projects, team, and products.",
      url: `${siteUrl}/collections`,
      siteName: organization?.name,
      images: organization?.defaultOgImage
        ? [{ url: organization.defaultOgImage }]
        : undefined,
      type: "website",
    },
    robots: organization?.defaultRobots || "index, follow",
  };
}

export default async function CollectionsPage() {
  const [collections, organization] = await Promise.all([
    fetchQuery(api.collections.listPublishedCollections),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  const siteUrl = getSiteUrl(organization);

  const collectionPageLd = {
    "@type": "CollectionPage",
    "@id": `${siteUrl}/collections#collectionpage`,
    url: `${siteUrl}/collections`,
    name: "Collections",
    description: organization?.defaultMetaDescription || undefined,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: organization?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collections.length,
      itemListElement: collections.map((c, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/collections/${c.slug}`,
        name: c.name,
      })),
    },
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/collections#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: organization?.name || "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${siteUrl}/collections` },
    ],
  };

  return (
    <>
      <CollectionsView collections={collections} />
      <JsonLd data={collectionPageLd} />
      <JsonLd data={breadcrumbLd} />
    </>
  );
}
