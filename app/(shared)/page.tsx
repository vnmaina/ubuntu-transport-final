import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
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

export const dynamic = 'force-dynamic';

async function resolveHomePage() {
  const pages = await fetchQuery(api.pages.getPublishedPagesForNav);
  if (!pages || pages.length === 0) return null;
  return pages.find((p) => p.title.toLowerCase() === "home") || pages[0];
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, organization] = await Promise.all([
    resolveHomePage(),
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
  const twitterImage = absoluteUrl(siteUrl, page.twitterImage) || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: page.canonicalUrl || pageUrl },
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

export default async function Home() {
  const [pages, organization] = await Promise.all([
    fetchQuery(api.pages.getPublishedPagesForNav),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);

  if (!pages || pages.length === 0) {
    redirect("/admin/pages");
  }

  // Find the home page by title (case-insensitive)
  let page = pages.find((p) => p.title.toLowerCase() === "home");

  // If no "Home" page found, use the first published page
  if (!page) {
    page = pages[0];
  }

  const siteUrl = getSiteUrl(organization);
  const autoJsonLd = buildPageJsonLd(page, organization, siteUrl);
  const manualJsonLd = parseManualStructuredData(page.manualStructuredData);

  // Render the page directly at root "/" - navbar is handled by root layout
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
