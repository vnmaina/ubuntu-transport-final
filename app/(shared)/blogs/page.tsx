import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { JsonLd } from "@/components/JsonLd";
import { BlogIndexView } from "./blog-index-view";
import type { Metadata } from "next";
import {
  getSiteUrl,
  getPageUrl,
  getPageTitle,
  getPageDescription,
  getPageKeywords,
  absoluteUrl,
  parseManualStructuredData,
} from "@/lib/seo";

export const revalidate = 3600; // Revalidate every hour

async function loadBlogData() {
  const [page, organization, posts, categories] = await Promise.all([
    fetchQuery(api.pages.getPublishedBySlug, { slug: "blog" }).catch(() => null),
    fetchQuery(api.organization.getOrganization).catch(() => null),
    fetchQuery(api.blog.listPublishedBlogPosts).catch(() => []),
    fetchQuery(api.blog.listBlogCategories).catch(() => []),
  ]);
  return { page, organization, posts, categories };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page, organization } = await loadBlogData();
  const siteUrl = getSiteUrl(organization);

  const defaultTitle = `Kenya Safari & Travel Blog | ${organization?.name || "Ubuntu Transport & Logistics"}`;
  const defaultDesc =
    "Expert Kenya safari guides, travel tips, airport transfer insights, and destination spotlights from Ubuntu Transport specialists.";
  const defaultKeywords = [
    "Kenya safari blog",
    "Nairobi airport transfers",
    "Masai Mara travel guide",
    "4x4 safari cruiser hire",
    "Kenya transport logistics",
    "Ubuntu Transport Kenya",
  ];

  const seoPage = page
    ? {
        title: page.title || "Blog",
        slug: page.slug || "blogs",
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        ogImage: page.ogImage,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        twitterCard: page.twitterCard,
        twitterTitle: page.twitterTitle,
        twitterDescription: page.twitterDescription,
        twitterImage: page.twitterImage,
        canonicalUrl: page.canonicalUrl,
        robots: page.robots,
        keywords: page.keywords,
      }
    : {
        title: defaultTitle,
        slug: "blogs",
        metaTitle: defaultTitle,
        metaDescription: defaultDesc,
        keywords: defaultKeywords,
      };

  const pageUrl = getPageUrl({ slug: "blogs", canonicalUrl: seoPage.canonicalUrl }, siteUrl);
  const title = getPageTitle(seoPage, organization) || defaultTitle;
  const description = getPageDescription(seoPage, organization) || defaultDesc;
  const keywords = getPageKeywords(seoPage, organization) || defaultKeywords;

  const ogImage =
    absoluteUrl(siteUrl, seoPage.ogImage) || absoluteUrl(siteUrl, organization?.defaultOgImage);
  const twitterImage = absoluteUrl(siteUrl, seoPage.twitterImage) || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: seoPage.ogTitle || title,
      description: seoPage.ogDescription || description,
      url: pageUrl,
      siteName: organization?.name || "Ubuntu Transport & Logistics",
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: (seoPage.twitterCard ||
        organization?.defaultTwitterCard ||
        "summary_large_image") as
        | "summary"
        | "summary_large_image"
        | "player"
        | "app",
      title: seoPage.twitterTitle || title,
      description: seoPage.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: seoPage.robots || organization?.defaultRobots || "index, follow",
  };
}

export default async function BlogPage() {
  const { page, organization, posts, categories } = await loadBlogData();
  const siteUrl = getSiteUrl(organization);
  const blogUrl = `${siteUrl}/blogs`;

  // Structured Data for Blog Collection & Breadcrumbs
  const blogLd: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${blogUrl}#blog`,
      url: blogUrl,
      name: "Blog — Ubuntu Transport & Safaris",
      description:
        organization?.defaultMetaDescription ||
        "Safari guides, Kenya transport tips and destination spotlights.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: organization?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
      inLanguage: "en",
      mainEntity: posts.length
        ? {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.slice(0, 20).map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${blogUrl}/${post.slug}`,
              name: post.title,
            })),
          }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${blogUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: organization?.name || "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: blogUrl,
        },
      ],
    },
  ];

  return (
    <main className="w-full min-h-screen bg-background">
      {blogLd.map((data, index) => (
        <JsonLd key={`blog-ld-${index}`} data={data} />
      ))}
      {page &&
        parseManualStructuredData(page.manualStructuredData)?.map((data, index) => (
          <JsonLd key={`manual-ld-${index}`} data={data} />
        ))}

     
      {/* Modern Editorial Blog Index View */}
      <BlogIndexView posts={posts} categories={categories} />
    </main>
  );
}
