import type { Metadata } from "next";
import { getSearchCorpus, searchEntries } from "@/lib/search";
import { SearchResults } from "@/components/search-results";
import { SearchBox } from "@/components/search-box";
import { SectionHeader } from "@/components/blocks/SectionHeader";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || "").trim();
  return {
    title: query ? `Search: ${query}` : "Search",
    // Arbitrary ?q= queries are always noindex — only curated /search/slug pages are indexable
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const corpus = await getSearchCorpus();
  const results = query ? searchEntries(corpus, query) : [];

  return (
    <main className="min-h-screen bg-background px-4 py-16 md:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Search"
          title={query ? `Results for "${query}"` : "Search Ubuntu Logistics"}
          subtitle="Find services, fleet vehicles, destinations, collection items and travel guides."
          className="mb-10"
        />

        <div className="mb-12">
          <SearchBox initialQuery={query} />
        </div>

        {query ? (
          <SearchResults results={results} query={query} />
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
            <p className="text-base text-muted-foreground">
              Enter a keyword above — try <span className="font-semibold text-primary">safari</span>,{" "}
              <span className="font-semibold text-primary">airport transfer</span>,{" "}
              <span className="font-semibold text-primary">maasai mara</span>, or{" "}
              <span className="font-semibold text-primary">corporate shuttle</span>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
