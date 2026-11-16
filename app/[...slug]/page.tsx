import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getSiteUrl,
  getPageUrl,
  getPageTitle,
  getPageDescription,
  getPageKeywords,
  buildPageJsonLd,
  parseManualStructuredData,
  absoluteUrl,
} from "@/lib/seo";

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const [page, organization] = await Promise.all([
    fetchQuery(api.pages.getBySlug, { slug: slugPath }),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!page) return {};

  const siteUrl = getSiteUrl(organization);
  const pageUrl = getPageUrl(page, siteUrl);
  const title = getPageTitle(page, organization);
  const description = getPageDescription(page, organization);
  const keywords = getPageKeywords(page, organization);

  const ogImage =
    absoluteUrl(siteUrl, page.ogImage) ||
    absoluteUrl(siteUrl, organization?.defaultOgImage);
  const twitterImage =
    absoluteUrl(siteUrl, page.twitterImage) || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: page.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: pageUrl,
      siteName: organization?.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: (page.twitterCard ||
        organization?.defaultTwitterCard ||
        "summary_large_image") as
        | "summary"
        | "summary_large_image"
        | "player"
        | "app",
      title: page.twitterTitle || title,
      description: page.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: page.robots || organization?.defaultRobots || "index, follow",
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  // Resolve matching schema node object from Convex database context directly during SSR lifecycle
  const [page, organization] = await Promise.all([
    fetchQuery(api.pages.getBySlug, { slug: slugPath }),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!page) notFound();

  const siteUrl = getSiteUrl(organization);
  const autoJsonLd = buildPageJsonLd(page, organization, siteUrl);
  const manualJsonLd = parseManualStructuredData(page.manualStructuredData);

  return (
    <>
      <BlockRenderer blocks={page.blocks} />
      {autoJsonLd.map((data, index) => (
        <JsonLd key={`auto-${index}`} data={data} />
      ))}
      {manualJsonLd?.map((data, index) => (
        <JsonLd key={`manual-${index}`} data={data} />
      ))}
    </>
  );
}
