// Shared SEO / structured-data helpers (JSON-LD).
// Safe to import from both server and client components — pure functions only.

export interface SeoOrganization {
  name?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  foundedYear?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultOgImage?: string;
  defaultTwitterCard?: string;
  defaultCanonicalUrl?: string;
  defaultRobots?: string;
  defaultKeywords?: string[];
  areasOfOperation?: string[];
  facebook?: string;
  facebookEnabled?: boolean;
  twitter?: string;
  twitterEnabled?: boolean;
  instagram?: string;
  instagramEnabled?: boolean;
  linkedin?: string;
  linkedinEnabled?: boolean;
  youtube?: string;
  youtubeEnabled?: boolean;
}

export interface SeoPage {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  keywords?: string[];
  manualStructuredData?: string;
}

const SOCIAL_FIELDS: Array<keyof SeoOrganization> = [
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
];

const SOCIAL_ENABLED_FIELDS: Record<string, keyof SeoOrganization> = {
  facebook: "facebookEnabled",
  twitter: "twitterEnabled",
  instagram: "instagramEnabled",
  linkedin: "linkedinEnabled",
  youtube: "youtubeEnabled",
};

export function getSiteUrl(org?: SeoOrganization | null): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    org?.website ||
    org?.defaultCanonicalUrl ||
    "";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(siteUrl: string, pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("/")) return `${siteUrl}${pathOrUrl}`;
  return `${siteUrl}/${pathOrUrl}`;
}

export function getPageUrl(page: Pick<SeoPage, "slug" | "canonicalUrl">, siteUrl: string): string {
  if (page.canonicalUrl) return page.canonicalUrl;
  return page.slug ? `${siteUrl}/${page.slug}` : siteUrl;
}

export function getPageTitle(page: SeoPage, org?: SeoOrganization | null): string {
  return page.metaTitle || page.title || org?.name || "";
}

export function getPageDescription(page: SeoPage, org?: SeoOrganization | null): string {
  return (
    page.metaDescription ||
    org?.defaultMetaDescription ||
    ""
  );
}

export function getPageKeywords(page: SeoPage, org?: SeoOrganization | null): string[] | undefined {
  if (page.keywords && page.keywords.length > 0) return page.keywords;
  if (org?.defaultKeywords && org.defaultKeywords.length > 0) return org.defaultKeywords;
  return undefined;
}

/** Organization JSON-LD (site-wide) */
export function buildOrganizationJsonLd(org: SeoOrganization | null | undefined, siteUrl: string) {
  if (!org?.name) return null;

  const sameAs = SOCIAL_FIELDS.map((field) => {
    const enabledKey = SOCIAL_ENABLED_FIELDS[field as string];
    const enabled = enabledKey ? org[enabledKey] : undefined;
    const url = org[field];
    return enabled && typeof url === "string" ? url : undefined;
  }).filter((u): u is string => Boolean(u));

  const jsonLd: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: org.name,
    url: siteUrl,
    description: org.description || org.defaultMetaDescription || undefined,
  };

  const logoUrl = absoluteUrl(siteUrl, org.logo || org.defaultOgImage);
  if (logoUrl) jsonLd.logo = logoUrl;
  if (org.email) jsonLd.email = org.email;
  if (org.phone) jsonLd.telephone = org.phone;
  if (org.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: org.address,
    };
  }
  if (org.industry) jsonLd.knowsAbout = org.industry;
  if (org.foundedYear) jsonLd.foundingDate = org.foundedYear;
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;
  if (org.areasOfOperation && org.areasOfOperation.length > 0) {
    jsonLd.areaServed = org.areasOfOperation.map((area) => ({
      "@type": "Place",
      name: area,
    }));
  }

  return jsonLd;
}

/** WebSite JSON-LD (site-wide) */
export function buildWebSiteJsonLd(org: SeoOrganization | null | undefined, siteUrl: string) {
  if (!org?.name) return null;
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: org.name,
    description: org.defaultMetaDescription || org.description || undefined,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

/** WebPage JSON-LD for a single page */
export function buildWebPageJsonLd(
  page: SeoPage,
  org: SeoOrganization | null | undefined,
  siteUrl: string
) {
  const pageUrl = getPageUrl(page, siteUrl);
  const title = getPageTitle(page, org);
  const description = getPageDescription(page, org);
  const keywords = getPageKeywords(page, org);

  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description: description || undefined,
    keywords: keywords ? keywords.join(", ") : undefined,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: org?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
    inLanguage: "en",
  };
}

/** BreadcrumbList JSON-LD for a page (skipped for the home page) */
export function buildBreadcrumbJsonLd(
  page: SeoPage,
  org: SeoOrganization | null | undefined,
  siteUrl: string
) {
  const pageUrl = getPageUrl(page, siteUrl);
  const homeName = org?.name || "Home";
  const pageName = getPageTitle(page, org);

  const items: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName,
      item: siteUrl,
    },
  ];

  if (page.slug) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: pageName,
      item: pageUrl,
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items,
  };
}

/** All auto-generated structured data for a page */
export function buildPageJsonLd(
  page: SeoPage,
  org: SeoOrganization | null | undefined,
  siteUrl: string
): Array<Record<string, unknown>> {
  const graph: Array<Record<string, unknown>> = [
    buildWebPageJsonLd(page, org, siteUrl),
  ];
  if (page.slug) {
    graph.push(buildBreadcrumbJsonLd(page, org, siteUrl));
  }
  return graph;
}

/** Parse a manually entered JSON-LD string. Accepts an object or array of objects. */
export function parseManualStructuredData(input?: string | null): Array<Record<string, unknown>> | null {
  if (!input || !input.trim()) return null;
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item === "object");
    }
    if (parsed && typeof parsed === "object") {
      return [parsed];
    }
    return null;
  } catch {
    return null;
  }
}

/** Serialize JSON-LD safely for embedding in a <script> tag */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export interface SeoCollection {
  name: string;
  slug: string;
  description?: string;
  summary?: string;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  areasServed?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  jsonLd?: string;
}

/** Strip HTML tags and decode basic entities to plain text. */
export function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function getCollectionUrl(collection: Pick<SeoCollection, "slug" | "canonicalUrl">, siteUrl: string): string {
  if (collection.canonicalUrl) return collection.canonicalUrl;
  return collection.slug ? `${siteUrl}/collections/${collection.slug}` : `${siteUrl}/collections`;
}

export function getCollectionTitle(collection: SeoCollection, org?: SeoOrganization | null): string {
  return collection.metaTitle || collection.name || org?.name || "";
}

export function getCollectionDescription(collection: SeoCollection, org?: SeoOrganization | null): string {
  const summary = (collection.summary || "").trim();
  const plain = stripHtml(collection.description);
  return (
    collection.metaDescription ||
    (summary.length > 0 ? summary.slice(0, 160) : "") ||
    (plain.length > 0 ? plain.slice(0, 160) : "") ||
    org?.defaultMetaDescription ||
    ""
  );
}

export function getCollectionKeywords(collection: SeoCollection, org?: SeoOrganization | null): string[] | undefined {
  if (collection.keywords && collection.keywords.length > 0) return collection.keywords;
  if (org?.defaultKeywords && org.defaultKeywords.length > 0) return org.defaultKeywords;
  return undefined;
}

/** Auto-generate SEO field suggestions from basic collection info.
 *  Title = name + primary keyword (+ org name when it fits).
 *  Description = summary → rich description → generated sentence.
 *  Keywords = user keywords first, then areas served + name. */
export function suggestCollectionSeo(input: {
  name: string;
  description?: string;
  summary?: string;
  keywords?: string[];
  areasServed?: string[];
  orgName?: string;
}): { metaTitle: string; metaDescription: string; keywords: string } {
  const name = input.name.trim();
  const orgName = input.orgName?.trim();

  // Keywords: user order preserved — first entry is the primary keyword
  const keywords = Array.from(
    new Set(
      [
        ...(input.keywords || []),
        ...(input.areasServed || []),
        name.toLowerCase(),
      ]
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean)
    )
  );
  const primaryKeyword = keywords[0] || "";

  // Meta title: "Name | Primary Keyword" (+ " | Org" when it fits in 60 chars)
  let metaTitle = name;
  if (primaryKeyword && !name.toLowerCase().includes(primaryKeyword)) {
    metaTitle = `${name} | ${primaryKeyword}`;
  }
  if (orgName && !metaTitle.toLowerCase().includes(orgName.toLowerCase())) {
    const withOrg = `${metaTitle} | ${orgName}`;
    if (withOrg.length <= 60) metaTitle = withOrg;
  }
  metaTitle = metaTitle.slice(0, 60);

  // Meta description: summary first, then plain description, then generated
  let metaDescription = (input.summary || "").trim() || stripHtml(input.description);
  if (metaDescription.length > 160) {
    metaDescription = `${metaDescription.slice(0, 157).trimEnd()}…`;
  }
  if (!metaDescription && name) {
    metaDescription = `Explore ${name}${input.areasServed?.length ? ` across ${input.areasServed.slice(0, 3).join(", ")}` : ""}.`;
  }

  return { metaTitle, metaDescription, keywords: keywords.join(", ") };
}

/** CollectionPage + BreadcrumbList (+ optional ItemList) JSON-LD for a collection. */
export function buildCollectionJsonLd(
  collection: SeoCollection,
  org: SeoOrganization | null | undefined,
  siteUrl: string,
  items?: Array<{ title: string; slug: string; description?: string; imageUrl?: string }>
): Array<Record<string, unknown>> {
  const pageUrl = getCollectionUrl(collection, siteUrl);
  const title = getCollectionTitle(collection, org);
  const description = getCollectionDescription(collection, org);
  const keywords = getCollectionKeywords(collection, org);

  const collectionLd: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collectionpage`,
    url: pageUrl,
    name: title,
    description: description || undefined,
    keywords: keywords ? keywords.join(", ") : undefined,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: org?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
    inLanguage: "en",
  };

  const imageUrl = absoluteUrl(siteUrl, collection.ogImage);
  if (imageUrl) collectionLd.primaryImageOfPage = { "@type": "ImageObject", url: imageUrl };
  if (collection.areasServed && collection.areasServed.length > 0) {
    collectionLd.areaServed = collection.areasServed.map((area) => ({
      "@type": "Place",
      name: area,
    }));
  }

  if (items && items.length > 0) {
    collectionLd.mainEntity = {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${pageUrl}/${item.slug}`,
        name: item.title,
      })),
    };
  }

  const graph: Array<Record<string, unknown>> = [collectionLd];

  // BreadcrumbList
  const homeName = org?.name || "Home";
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${siteUrl}/collections` },
      { "@type": "ListItem", position: 3, name: collection.name, item: pageUrl },
    ],
  });

  return graph;
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                           */
/* ------------------------------------------------------------------ */

export interface SeoBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
  author?: {
    name?: string;
    avatar?: string;
    bio?: string;
    role?: string;
  };
  videoUrl?: string;
  videoType?: "youtube" | "vimeo" | "custom";
  publishedAt?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  jsonLd?: string;
}

export function getBlogUrl(post: Pick<SeoBlogPost, "slug" | "canonicalUrl">, siteUrl: string): string {
  if (post.canonicalUrl) return post.canonicalUrl;
  return post.slug ? `${siteUrl}/blogs/${post.slug}` : `${siteUrl}/blogs`;
}

export function getBlogTitle(post: SeoBlogPost, org?: SeoOrganization | null): string {
  return post.metaTitle || post.title || org?.name || "";
}

export function getBlogDescription(post: SeoBlogPost, org?: SeoOrganization | null): string {
  const excerpt = (post.excerpt || "").trim();
  const contentText = stripHtml(post.content);
  return (
    post.metaDescription ||
    (excerpt.length > 0 ? excerpt.slice(0, 160) : "") ||
    (contentText.length > 0 ? contentText.slice(0, 160) : "") ||
    org?.defaultMetaDescription ||
    ""
  );
}

export function getBlogKeywords(post: SeoBlogPost, org?: SeoOrganization | null): string[] | undefined {
  if (post.keywords && post.keywords.length > 0) return post.keywords;
  if (post.tags && post.tags.length > 0) return post.tags;
  if (org?.defaultKeywords && org.defaultKeywords.length > 0) return org.defaultKeywords;
  return undefined;
}

/** Auto-generate SEO suggestions from basic post info.
 *  Title = post title + primary keyword (+ org name when it fits).
 *  Description = excerpt → content → generated sentence.
 *  Keywords = post keywords/tags first, then category + org name. */
export function suggestBlogSeo(input: {
  title: string;
  excerpt?: string;
  content?: string;
  keywords?: string[];
  tags?: string[];
  category?: string;
  orgName?: string;
}): { metaTitle: string; metaDescription: string; keywords: string } {
  const title = input.title.trim();
  const orgName = input.orgName?.trim();

  const keywords = Array.from(
    new Set(
      [
        ...(input.keywords || []),
        ...(input.tags || []),
        input.category || "",
        orgName ? orgName.toLowerCase() : "",
      ]
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean)
    )
  );
  const primaryKeyword = keywords[0] || "";

  let metaTitle = title;
  if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword)) {
    metaTitle = `${title} | ${primaryKeyword}`;
  }
  if (orgName && !metaTitle.toLowerCase().includes(orgName.toLowerCase())) {
    const withOrg = `${metaTitle} | ${orgName}`;
    if (withOrg.length <= 60) metaTitle = withOrg;
  }
  metaTitle = metaTitle.slice(0, 60);

  let metaDescription = (input.excerpt || "").trim() || stripHtml(input.content);
  if (metaDescription.length > 160) {
    metaDescription = `${metaDescription.slice(0, 157).trimEnd()}…`;
  }
  if (!metaDescription && title) {
    metaDescription = `${title}${input.category ? ` — ${input.category}` : ""}. Read the latest insights and updates.`;
  }

  return { metaTitle, metaDescription, keywords: keywords.join(", ") };
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getVideoEmbedUrl(post: SeoBlogPost): string | undefined {
  if (!post.videoUrl) return undefined;
  if (post.videoType === "youtube") {
    const id = extractYouTubeId(post.videoUrl);
    return id ? `https://www.youtube.com/embed/${id}` : undefined;
  }
  if (post.videoType === "vimeo") {
    const id = extractVimeoId(post.videoUrl);
    return id ? `https://player.vimeo.com/video/${id}` : undefined;
  }
  return post.videoUrl;
}

/** Article + WebPage + BreadcrumbList (+ VideoObject) JSON-LD for a blog post. */
export function buildBlogJsonLd(
  post: SeoBlogPost,
  org: SeoOrganization | null | undefined,
  siteUrl: string,
  categoryName?: string
): Array<Record<string, unknown>> {
  const pageUrl = getBlogUrl(post, siteUrl);
  const title = getBlogTitle(post, org);
  const description = getBlogDescription(post, org);
  const keywords = getBlogKeywords(post, org);
  const imageUrl = absoluteUrl(siteUrl, post.ogImage || post.featuredImage || org?.defaultOgImage);

  const authorName = post.author?.name || org?.name || "Author";
  const authorLd: Record<string, unknown> = {
    "@type": "Person",
    name: authorName,
  };
  const authorAvatar = absoluteUrl(siteUrl, post.author?.avatar);
  if (authorAvatar) authorLd.image = authorAvatar;
  if (post.author?.role) authorLd.jobTitle = post.author.role;

  const articleLd: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: title,
    description: description || undefined,
    keywords: keywords ? keywords.join(", ") : undefined,
    url: pageUrl,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    author: authorLd,
    publisher: org?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
    inLanguage: "en",
  };
  if (imageUrl) {
    articleLd.image = [imageUrl];
    articleLd.thumbnailUrl = imageUrl;
  }
  if (post.publishedAt) {
    articleLd.datePublished = new Date(post.publishedAt).toISOString();
    articleLd.dateModified = new Date(post.publishedAt).toISOString();
  }
  if (post.category || categoryName) {
    articleLd.articleSection = categoryName || post.category;
  }

  // VideoObject when the post has a video
  const videoUrl = post.videoUrl;
  if (videoUrl) {
    const embedUrl = getVideoEmbedUrl(post);
    const videoLd: Record<string, unknown> = {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: title,
      description: description || undefined,
      thumbnailUrl: imageUrl ? [imageUrl] : undefined,
      uploadDate: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      contentUrl: videoUrl,
    };
    if (embedUrl) videoLd.embedUrl = embedUrl;
    articleLd.video = videoLd;
  }

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description: description || undefined,
      keywords: keywords ? keywords.join(", ") : undefined,
      image: imageUrl ? [imageUrl] : undefined,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: org?.name ? { "@id": `${siteUrl}/#organization` } : undefined,
      inLanguage: "en",
      mainEntity: { "@id": `${pageUrl}#article` },
    },
    articleLd,
  ];

  // BreadcrumbList: Home > Blog > (Category) > Post
  const itemListElement: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: org?.name || "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blogs` },
  ];
  let position = 3;
  if (post.category) {
    itemListElement.push({
      "@type": "ListItem",
      position: position++,
      name: categoryName || post.category,
      item: `${siteUrl}/blogs`,
    });
  }
  itemListElement.push({
    "@type": "ListItem",
    position: position,
    name: post.title,
    item: pageUrl,
  });
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement,
  });

  return graph;
}
