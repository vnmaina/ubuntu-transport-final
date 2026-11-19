import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getSearchCorpus,
  resolveProgrammaticSearch,
  buildSearchMeta,
} from "@/lib/search";
import { SearchResults } from "@/components/search-results";
import { SearchBox } from "@/components/search-box";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/blocks/SectionHeader";

export const dynamic = "force-dynamic";

interface SearchSlugProps {
  params: Promise<{ slug: string[] }>;
}

async function resolve(params: SearchSlugProps["params"]) {
  const { slug } = await params;
  if (!slug?.length) return null;
  const corpus = await getSearchCorpus();
  const resolved = resolveProgrammaticSearch(corpus, slug);
  return { slug, resolved };
}

export async function generateMetadata({ params }: SearchSlugProps): Promise<Metadata> {
  const data = await resolve(params);
  if (!data) return { title: "Search" };

  const org = await fetchQuery(api.organization.getOrganization).catch(() => null);
  const orgName = org?.name || "Ubuntu Logistics";
  const orgKeywords: string[] = org?.defaultKeywords || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ubuntulogistics.co.ke";
  const meta = buildSearchMeta(data.resolved.results, data.resolved.query, orgName, orgKeywords);
  const canonical = `${siteUrl}/search/${data.slug.join("-")}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: data.slug,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
      ...(meta.image ? { images: [meta.image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      ...(meta.image ? { images: [meta.image] } : {}),
    },
    // Thin-content safeguard: only index programmatic pages with real results
    robots: data.resolved.isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function ProgrammaticSearchPage({ params }: SearchSlugProps) {
  const data = await resolve(params);
  if (!data) notFound();

  const { slug, resolved } = data;
  const slugPath = slug.join("-");
  const displayQuery = resolved.query
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const org = await fetchQuery(api.organization.getOrganization).catch(() => null);
  const orgName = org?.name || "Ubuntu Logistics";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ubuntulogistics.co.ke";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${displayQuery} — Search Results`,
      description: `${resolved.results.length} results for ${displayQuery} from ${orgName}.`,
      url: `${siteUrl}/search/${slugPath}`,
      isPartOf: { "@type": "WebSite", name: orgName, url: siteUrl },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: resolved.results.length,
        itemListElement: resolved.results.slice(0, 20).map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.title,
          url: `${siteUrl}${r.url}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Search", item: `${siteUrl}/search` },
        { "@type": "ListItem", position: 3, name: displayQuery, item: `${siteUrl}/search/${slugPath}` },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-16 md:px-8 lg:py-24">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Search"
          title={resolved.results.length ? `${displayQuery}` : `No results for "${displayQuery}"`}
          subtitle={
            resolved.results.length
              ? `${resolved.results.length} matching service${resolved.results.length === 1 ? "" : "s"}, fleet vehicle${resolved.results.length === 1 ? "" : "s"}, destination${resolved.results.length === 1 ? "" : "s"} and guide${resolved.results.length === 1 ? "" : "s"}.`
              : "Try a different keyword or browse our collections below."
          }
          className="mb-10"
        />

        <div className="mb-12">
          <SearchBox initialQuery={resolved.query} />
        </div>

        <SearchResults results={resolved.results} query={resolved.query} />
      </div>
    </main>
  );
}
