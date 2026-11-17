import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Briefcase, Compass, Layers, MapPin, SearchX } from "lucide-react";
import type { SearchResult, SearchResultType } from "@/lib/search";

const TYPE_META: Record<SearchResultType, { label: string; icon: typeof Compass; href?: string }> = {
  service: { label: "Service", icon: Briefcase },
  fleet: { label: "Fleet", icon: Layers },
  destination: { label: "Destination", icon: MapPin },
  blog: { label: "Travel Guide", icon: BookOpen },
  page: { label: "Page", icon: Compass },
  other: { label: "Result", icon: Compass },
};

export function SearchResults({
  results,
  query,
}: {
  results: SearchResult[];
  query: string;
}) {
  if (results.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
          <SearchX className="size-8" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-primary">No results for &ldquo;{query}&rdquo;</h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
          Try a different keyword, or browse our services, fleet, destinations and travel guides.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/collections/services" className="text-sm font-semibold text-primary hover:underline">
            Services →
          </Link>
          <Link href="/collections/fleet" className="text-sm font-semibold text-primary hover:underline">
            Fleet →
          </Link>
          <Link href="/collections/destinations" className="text-sm font-semibold text-primary hover:underline">
            Destinations →
          </Link>
          <Link href="/blogs" className="text-sm font-semibold text-primary hover:underline">
            Travel Guides →
          </Link>
        </div>
      </div>
    );
  }

  // Group results by type for scannability
  const groups = new Map<SearchResultType, SearchResult[]>();
  for (const r of results) {
    const list = groups.get(r.type) || [];
    list.push(r);
    groups.set(r.type, list);
  }

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"} for{" "}
        <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
      </p>

      {[...groups.entries()].map(([type, items]) => {
        const meta = TYPE_META[type];
        const Icon = meta.icon;
        return (
          <section key={type}>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                {meta.label}s
              </h2>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={`${item.type}-${item.url}-${item.title}`}
                  href={item.url}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  {item.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <Icon className="size-8 text-primary/30" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    {item.collectionName && (
                      <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.collectionName}
                      </span>
                    )}
                    <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {item.subtitle}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-primary">
                      View details
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
