import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostView } from "./blog-post-view";
import { JsonLd } from "@/components/JsonLd";
import {
  getSiteUrl,
  getBlogUrl,
  getBlogKeywords,
  buildBlogJsonLd,
  absoluteUrl,
  stripHtml,
  parseManualStructuredData,
} from "@/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadData(slug: string) {
  const [post, organization] = await Promise.all([
    fetchQuery(api.blog.getBlogPostBySlug, { slug }),
    fetchQuery(api.organization.getOrganization).catch(() => null),
  ]);
  return { post, organization };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post, organization } = await loadData(slug);
  if (!post || post.status !== "published") return {};

  const siteUrl = getSiteUrl(organization);
  const pageUrl = getBlogUrl(post, siteUrl);
  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    (post.excerpt || "").trim() ||
    stripHtml(post.content).slice(0, 160) ||
    `Read ${post.title} on the ${organization?.name || "blog"}.`;
  const keywords = getBlogKeywords(post, organization);

  const ogImage =
    absoluteUrl(siteUrl, post.ogImage) ||
    absoluteUrl(siteUrl, post.featuredImage) ||
    absoluteUrl(siteUrl, organization?.defaultOgImage);
  const twitterImage = absoluteUrl(siteUrl, post.twitterImage) || ogImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      url: pageUrl,
      siteName: organization?.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: (post.twitterCard ||
        organization?.defaultTwitterCard ||
        "summary_large_image") as
        | "summary"
        | "summary_large_image"
        | "player"
        | "app",
      title: post.twitterTitle || title,
      description: post.twitterDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: post.robots || organization?.defaultRobots || "index, follow",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, organization } = await loadData(slug);

  if (!post || post.status !== "published") notFound();

  const siteUrl = getSiteUrl(organization);

  const [category, allPosts, allServices] = await Promise.all([
    post.category
      ? fetchQuery(api.blog.getBlogCategoryBySlug, { slug: post.category }).catch(() => null)
      : Promise.resolve(null),
    fetchQuery(api.blog.listPublishedBlogPosts).catch(() => []),
    fetchQuery(api.services.listServices).catch(() => []),
  ]);

  // Related posts: same category first, then latest — exclude current
  const relatedPosts = allPosts
    .filter((p) => p._id !== post._id)
    .sort((a, b) => {
      const aSame = a.category === post.category ? 0 : 1;
      const bSame = b.category === post.category ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return (b.publishedAt ?? 0) - (a.publishedAt ?? 0);
    })
    .slice(0, 3);

  // Related services: active, ordered
  const relatedServices = allServices
    .filter((s) => s.active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4);

  // Chronological navigation: next and previous articles
  const chronological = [...allPosts]
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  const currentIdx = chronological.findIndex((p) => p._id === post._id);
  const prevPost = currentIdx > 0 ? chronological[currentIdx - 1] : null;
  const nextPost =
    currentIdx >= 0 && currentIdx < chronological.length - 1
      ? chronological[currentIdx + 1]
      : null;

  const jsonLdBlocks = buildBlogJsonLd(post, organization, siteUrl, category?.name);

  return (
    <>
      <BlogPostView
        post={post}
        category={category}
        relatedPosts={relatedPosts}
        relatedServices={relatedServices}
        prevPost={prevPost}
        nextPost={nextPost}
      />
      {jsonLdBlocks.map((data, index) => (
        <JsonLd key={`ld-${index}`} data={data} />
      ))}
      {parseManualStructuredData(post.jsonLd)?.map((data, index) => (
        <JsonLd key={`manual-ld-${index}`} data={data} />
      ))}
    </>
  );
}
