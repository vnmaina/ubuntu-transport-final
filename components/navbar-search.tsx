"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { toSlug } from "@/lib/search-utils";

export function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const slug = toSlug(q);
    const normalized = q.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
    // Keyword-style queries get a programmatic /search/slug URL;
    // arbitrary free text falls back to /search?q=
    router.push(slug && slug === normalized ? `/search/${slug}` : `/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        <Search className="size-5" />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="relative flex items-center">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Search…"
        aria-label="Search the website"
        className="h-9 w-44 rounded-full border border-border bg-background px-4 pr-16 text-sm outline-none transition-all placeholder:text-muted-foreground focus:w-56 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-8 flex size-6 items-center justify-center rounded-full text-primary hover:bg-primary/10"
      >
        <Search className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setQuery(""); }}
        aria-label="Close search"
        className="absolute right-1.5 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
      >
        <X className="size-4" />
      </button>
    </form>
  );
}
