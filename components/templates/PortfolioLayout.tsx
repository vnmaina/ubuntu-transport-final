"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlockRenderer } from "@/components/BlockRenderer";
import Link from "next/link";

export default function PortfolioLayout() {
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

  // Fallback to portfolio layout

  return (
    <div className="min-h-screen">
      {/* Portfolio Hero */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl font-bold mb-4 text-foreground">
            Our Work
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Showcasing our best projects, services, and creative work.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {!collections || collections.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No collections available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link 
                  key={collection._id} 
                  href={`/collections/${collection.slug}`}
                  className="block group"
                >
                  <div className="h-full bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-6xl">{collection.icon || "🎨"}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get in touch with us to discuss your next big idea.
          </p>
          <Link 
            href="/collections" 
            className="inline-block bg-primary-foreground text-primary px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            View All Work
          </Link>
        </div>
      </section>
    </div>
  );
}
