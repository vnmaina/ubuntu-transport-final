import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getSiteUrl } from "@/lib/seo";
import {
  getSearchCorpus,
  getProgrammaticSearchSlugs,
  resolveProgrammaticSearch,
} from "@/lib/search";

export const dynamic = "force-dynamic";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/collections", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.9, changeFrequency: "daily" },
  { path: "/search", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [org, corpus] = await Promise.all([
    fetchQuery(api.organization.getOrganization).catch(() => null),
    getSearchCorpus().catch(() => []),
  ]);
  const siteUrl = getSiteUrl(org) || "https://ubuntulogistics.co.ke";

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteUrl}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // CMS pages (published)
  const pages = await fetchQuery(api.pages.listAllPages).catch(() => []);
  for (const page of pages) {
    if (page.published !== true) continue;
    const path = page.slug === "home" || page.slug === "/" ? "/" : `/${page.slug}`;
    if (path === "/") continue; // already in static routes
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: page.publishedAt ? new Date(page.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
      ...(page.ogImage ? { images: [page.ogImage] } : {}),
    });
  }

  // Collections + items
  const collections = await fetchQuery(api.collections.listPublishedCollections).catch(() => []);
  for (const collection of collections) {
    entries.push({
      url: `${siteUrl}/collections/${collection.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const items = await fetchQuery(api.collections.getPublishedItemsByCollection, {
      collectionId: collection._id,
    }).catch(() => []);
    for (const item of items) {
      entries.push({
        url: `${siteUrl}/collections/${collection.slug}/${item.slug}`,
        lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
        changeFrequency: "monthly",
        priority: 0.7,
        ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
      });
    }
  }

  // Blog posts
  const posts = await fetchQuery(api.blog.listPublishedBlogPosts).catch(() => []);
  for (const post of posts) {
    entries.push({
      url: `${siteUrl}/blogs/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    });
  }

  // Published form landing pages
  const forms = await fetchQuery(api.forms.listPublishedFormDefinitions).catch(() => []);
  for (const form of forms) {
    entries.push({
      url: `${siteUrl}/forms/${form.slug}`,
      lastModified: form.publishedAt ? new Date(form.publishedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Programmatic search pages — only include slugs that actually return results
  if (corpus.length > 0) {
    const candidateSlugs = getProgrammaticSearchSlugs(corpus);
    for (const slug of candidateSlugs) {
      const { results, isIndexable } = resolveProgrammaticSearch(corpus, [slug]);
      if (!isIndexable || results.length === 0) continue;
      entries.push({
        url: `${siteUrl}/search/${slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
