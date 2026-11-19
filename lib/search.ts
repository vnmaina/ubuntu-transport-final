import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { toSlug, tokenize } from "@/lib/search-utils";

export { toSlug, tokenize };

export type SearchResultType = "service" | "fleet" | "destination" | "blog" | "page" | "other";

export interface SearchEntry {
  type: SearchResultType;
  collectionName?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  url: string;
  image?: string;
  keywords: string[];
  haystack: string;
}

export interface SearchResult extends SearchEntry {
  score: number;
  matchedTerms: string[];
}

function slugToTerms(slug: string): string[] {
  return tokenize(slug.replace(/-/g, " "));
}

const COLLECTION_TYPES: Record<string, SearchResultType> = {
  services: "service",
  fleet: "fleet",
  destinations: "destination",
};

function stripHtml(html?: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Build the full searchable corpus from Convex (server-side only). */
export async function getSearchCorpus(): Promise<SearchEntry[]> {
  const [collections, blogPosts, services, pages] = await Promise.all([
    fetchQuery(api.collections.listPublishedCollections).catch(() => []),
    fetchQuery(api.blog.listPublishedBlogPosts).catch(() => []),
    fetchQuery(api.services.listServices).catch(() => []),
    fetchQuery(api.pages.listAllPages).catch(() => []),
  ]);

  const entries: SearchEntry[] = [];

  // Collection items (services, fleet, destinations, + any other collections)
  for (const collection of collections) {
    const items = await fetchQuery(api.collections.getPublishedItemsByCollection, {
      collectionId: collection._id,
    }).catch(() => []);

    const collectionKeywords = [
      ...(collection.keywords || []),
      ...(collection.areasServed || []),
    ];
    const type = COLLECTION_TYPES[collection.slug] || "other";

    for (const item of items) {
      const text = [
        item.title,
        item.slug,
        item.description || "",
        stripHtml(item.content || ""),
        ...(item.tags || []),
        ...(item.metadata?.features || []),
      ].join(" ");

      entries.push({
        type,
        collectionName: collection.name,
        title: item.title,
        subtitle: truncate(stripHtml(item.description || "") || item.title, 120),
        summary: truncate(stripHtml(item.description || stripHtml(item.content || "")), 160),
        url: `/collections/${collection.slug}/${item.slug}`,
        image: item.imageUrl,
        keywords: [
          ...tokenize(item.title),
          ...(item.tags || []),
          ...collectionKeywords,
        ].map((k) => k.toLowerCase()),
        haystack: `${text} ${collectionKeywords.join(" ")}`.toLowerCase(),
      });
    }
  }

  // Blog posts
  for (const post of blogPosts) {
    const excerpt = stripHtml(post.excerpt || "");
    entries.push({
      type: "blog",
      collectionName: "Blog",
      title: post.title,
      subtitle: truncate(excerpt || post.title, 120),
      summary: truncate(excerpt || stripHtml(post.content || ""), 160),
      url: `/blogs/${post.slug}`,
      image: post.featuredImage,
      keywords: [
        ...tokenize(post.title),
        ...(post.keywords || []),
        ...(post.tags || []),
        post.category || "",
      ].map((k) => k.toLowerCase()).filter(Boolean),
      haystack: `${post.title} ${post.slug} ${excerpt} ${stripHtml(post.content || "")} ${(post.keywords || []).join(" ")} ${(post.tags || []).join(" ")} ${post.category || ""}`.toLowerCase(),
    });
  }

  // Services table
  for (const service of services) {
    if (service.active === false) continue;
    const text = [service.name, service.description || "", service.category || "", ...(service.features || [])].join(" ");
    entries.push({
      type: "service",
      collectionName: "Services",
      title: service.name,
      subtitle: truncate(stripHtml(service.description || "") || service.name, 120),
      summary: truncate(stripHtml(service.description || ""), 160),
      url: "/services",
      image: service.imageUrl,
      keywords: [...tokenize(service.name), service.category || "", ...(service.features || [])].map((k) => k.toLowerCase()).filter(Boolean),
      haystack: text.toLowerCase(),
    });
  }

  // CMS pages (published only)
  for (const page of pages) {
    if (page.published !== true) continue;
    entries.push({
      type: "page",
      collectionName: "Pages",
      title: page.title,
      subtitle: truncate(page.metaDescription || page.title, 120),
      summary: truncate(page.metaDescription || "", 160),
      url: page.slug === "home" || page.slug === "/" ? "/" : `/${page.slug}`,
      image: page.ogImage,
      keywords: [...tokenize(page.title), ...(page.keywords || [])].map((k) => k.toLowerCase()).filter(Boolean),
      haystack: `${page.title} ${page.slug} ${page.metaDescription || ""} ${(page.keywords || []).join(" ")}`.toLowerCase(),
    });
  }

  return entries;
}

/** Score entries against a free-text query or slug terms. */
export function searchEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const entry of entries) {
    let score = 0;
    const matched = new Set<string>();

    for (const term of terms) {
      let termScore = 0;
      if (entry.keywords.some((k) => k === term || k.includes(term))) termScore += 4;
      if (entry.title.toLowerCase().includes(term)) termScore += 3;
      if ((entry.subtitle || "").toLowerCase().includes(term)) termScore += 1.5;
      if ((entry.summary || "").toLowerCase().includes(term)) termScore += 1;
      if (entry.haystack.includes(term)) termScore += 0.5;

      if (termScore > 0) {
        score += termScore;
        matched.add(term);
      }
    }

    // Multi-term queries: require at least half the terms to match to stay relevant
    if (matched.size === 0) continue;
    if (terms.length > 1 && matched.size < Math.ceil(terms.length / 2)) continue;

    results.push({ ...entry, score, matchedTerms: [...matched] });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 60);
}

/** Resolve a programmatic slug like "safari-4x4-maasai-mara" into results. */
export function resolveProgrammaticSearch(
  entries: SearchEntry[],
  slugSegments: string[]
): { results: SearchResult[]; isIndexable: boolean; query: string } {
  const terms = slugSegments.flatMap(slugToTerms).filter(Boolean);
  const query = terms.join(" ");
  const results = terms.length ? searchEntries(entries, query) : [];
  return {
    results,
    // Only index programmatic pages that actually return results
    isIndexable: slugSegments.length > 0 && results.length > 0,
    query,
  };
}

export interface SearchPageMeta {
  title: string;
  description: string;
  image?: string;
}

/** Build meta title/description/image for a result set. */
export function buildSearchMeta(
  results: SearchResult[],
  query: string,
  orgName = "Ubuntu Logistics",
  orgKeywords: string[] = []
): SearchPageMeta {
  const top = results[0];
  const cleanQuery = query
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (!results.length) {
    return {
      title: `${cleanQuery} | ${orgName}`.slice(0, 60),
      description: `Explore ${cleanQuery.toLowerCase()} with ${orgName}. Browse our services, fleet, destinations and travel guides.`,
      image: undefined,
    };
  }

  // Pick a contextual org keyword that isn't already in the query (adds topical depth)
  const queryLower = query.toLowerCase();
  const contextKw = orgKeywords.find(
    (k) => k.length > 3 && !queryLower.includes(k.toLowerCase())
  ) || "";

  // Title: keyword-first, no counts
  const titleSuffix = contextKw
    ? `${cleanQuery} & ${contextKw.charAt(0).toUpperCase() + contextKw.slice(1)} | ${orgName}`
    : `${cleanQuery} | ${orgName}`;
  const title = titleSuffix.slice(0, 60);

  // Description: natural sentence from top real result titles, no "X results" or generic "Home"
  const realTitles = results
    .slice(0, 5)
    .map((r) => r.title)
    .filter((t) => t.toLowerCase() !== "home");

  const topSummary = top?.summary ? ` ${top.summary}` : "";

  const description = truncate(
    `${cleanQuery} options from ${orgName}: ${realTitles.slice(0, 3).join(", ")}.${topSummary}`,
    160
  );

  return {
    title,
    description,
    image: top?.image,
  };
}

/** Generate candidate programmatic slugs for the sitemap. */
export function getProgrammaticSearchSlugs(entries: SearchEntry[]): string[] {
  const termCount = new Map<string, number>();
  const slugs = new Set<string>();

  const addTerm = (raw: string) => {
    for (const term of tokenize(raw)) {
      if (term.length < 3) continue;
      const slug = toSlug(term);
      if (!slug) continue;
      termCount.set(slug, (termCount.get(slug) || 0) + 1);
      slugs.add(slug);
    }
  };

  for (const entry of entries) {
    for (const kw of entry.keywords) addTerm(kw);
    // Item-title phrases give useful 2-3 word pages
    const titleTerms = tokenize(entry.title).slice(0, 3);
    if (titleTerms.length >= 2) slugs.add(toSlug(titleTerms.join("-")));
  }

  // Pair combos across entity types: top terms from services × destinations/areas
  const groupTerms = (types: SearchResultType[]) => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      if (!types.includes(e.type)) continue;
      for (const kw of e.keywords) {
        const slug = toSlug(kw);
        if (slug.length >= 3) counts.set(slug, (counts.get(slug) || 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([s]) => s);
  };

  const serviceTerms = groupTerms(["service"]);
  const fleetTerms = groupTerms(["fleet"]);
  const destTerms = groupTerms(["destination"]);
  const areaTerms = groupTerms(["service", "destination", "fleet"]);

  const pair = (a: string, b: string) => {
    if (a === b) return;
    const slug = `${a}-${b}`.slice(0, 120);
    if (slug.length >= 6) slugs.add(slug);
  };

  for (const s of serviceTerms) {
    for (const d of destTerms.slice(0, 15)) pair(s, d);
    for (const f of fleetTerms.slice(0, 10)) pair(s, f);
    for (const a of areaTerms.slice(0, 10)) pair(s, a);
  }
  for (const f of fleetTerms.slice(0, 15)) {
    for (const d of destTerms.slice(0, 10)) pair(f, d);
  }

  return [...slugs].filter((s) => s.length >= 3).slice(0, 800);
}
