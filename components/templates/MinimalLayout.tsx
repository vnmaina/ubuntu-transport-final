"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlockRenderer } from "@/components/BlockRenderer";
import Link from "next/link";

export default function MinimalLayout() {
  // Try to get the published home page from the page builder
  const homePage = useQuery(api.pages.getPublishedBySlug, { slug: "" });
  const collections = useQuery(api.collections.listPublishedCollections);

  if (homePage) {
    return (
      <main className="w-full min-h-screen bg-white">
        <BlockRenderer blocks={homePage.blocks} />
      </main>
    );
  }

  // Fallback to minimal layout

  return (
    <div className="min-h-screen">
      {/* Minimal Hero */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-light mb-6 text-foreground">
            Simple. Clean. Effective.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-light">
            Explore our curated collections with a minimal aesthetic.
          </p>
        </div>
      </section>

      {/* Minimal Collections List */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {!collections || collections.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No collections available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map((collection) => (
                <Link 
                  key={collection._id} 
                  href={`/collections/${collection.slug}`}
                  className="block"
                >
                  <div className="border-b py-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-medium mb-1">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">{collection.description}</p>
                      </div>
                      <span className="text-2xl opacity-50">{collection.icon || "→"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
