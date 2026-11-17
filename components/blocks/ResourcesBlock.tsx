import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export interface ResourceLink {
  title: string;
  url: string;
  description?: string;
  group?: string;
}

interface ResourcesBlockProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  variant?: "list" | "grid" | "columns";
  items?: (ResourceLink | string)[];
  columns?: string;
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function normalizeItems(items?: (ResourceLink | string)[]): ResourceLink[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") {
        const [title, ...rest] = item.split("|");
        return { title: title.trim(), url: (rest.join("|").trim() || title.trim()), description: undefined };
      }
      if (!item || typeof item.title !== "string" || typeof item.url !== "string") return null;
      return {
        title: item.title.trim(),
        url: item.url.trim(),
        description: item.description?.trim() || undefined,
        group: item.group?.trim() || undefined,
      };
    })
    .filter((item): item is ResourceLink => Boolean(item && item.title && item.url));
}

function ResourceAnchor({
  item,
  children,
  className = "",
}: {
  item: ResourceLink;
  children: React.ReactNode;
  className?: string;
}) {
  const external = isExternalUrl(item.url);
  const cls = `group block ${className}`;

  if (external) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.url} className={cls}>
      {children}
    </Link>
  );
}

function Arrow({ external }: { external: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  );
}

function ListVariant({ items }: { items: ResourceLink[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        {items.map((item, i) => {
          const external = isExternalUrl(item.url);
          return (
            <ResourceAnchor key={`${item.url}-${i}`} item={item} className="relative">
              <div className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-muted/40 sm:gap-6 sm:px-7 sm:py-5">
                <span className="w-8 shrink-0 text-sm font-bold tabular-nums text-primary/60 sm:w-10 sm:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {item.title}
                    </h3>
                    {external && (
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="External link" />
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <Arrow external={external} />
              </div>
            </ResourceAnchor>
          );
        })}
      </div>
    </div>
  );
}

function GridVariant({ items, columns }: { items: ResourceLink[]; columns: number }) {
  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`mx-auto grid max-w-6xl grid-cols-1 gap-4 ${colClass}`}>
      {items.map((item, i) => {
        const external = isExternalUrl(item.url);
        return (
          <ResourceAnchor key={`${item.url}-${i}`} item={item}>
            <div className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold tabular-nums text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                {item.group && (
                  <span className="mt-2 inline-block rounded-full bg-secondary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {item.group}
                  </span>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  {external ? "Visit resource" : "Read more"}
                </span>
                <Arrow external={external} />
              </div>
            </div>
          </ResourceAnchor>
        );
      })}
    </div>
  );
}

function ColumnsVariant({ items }: { items: ResourceLink[] }) {
  const groups = new Map<string, ResourceLink[]>();
  items.forEach((item) => {
    const key = item.group || "Resources";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  });

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[...groups.entries()].map(([group, groupItems]) => (
        <div key={group} className="space-y-1">
          <div className="mb-4 flex items-center gap-2 border-b border-border/70 pb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-primary">{group}</h3>
          </div>
          <ul className="space-y-1">
            {groupItems.map((item, i) => {
              return (
                <li key={`${item.url}-${i}`}>
                  <ResourceAnchor item={item}>
                    <div className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </ResourceAnchor>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ResourcesBlock({
  eyebrow,
  title,
  subtitle,
  variant = "list",
  items,
  columns = "3",
}: ResourcesBlockProps) {
  const links = normalizeItems(items);
  if (links.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background py-16 sm:py-20 lg:py-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

        {variant === "grid" ? (
          <GridVariant items={links} columns={Number(columns) || 3} />
        ) : variant === "columns" ? (
          <ColumnsVariant items={links} />
        ) : (
          <ListVariant items={links} />
        )}
      </div>
    </section>
  );
}
