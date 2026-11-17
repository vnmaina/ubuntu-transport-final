"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SaaSLayout() {
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

  // Fallback to default SaaS layout

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our services, projects, team, and products. Everything you need in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/collections" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2">
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Collections</h2>
          
          {!collections || collections.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No collections available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <Link key={collection._id} href={`/collections/${collection.slug}`} className="block">
                  <div className="h-full hover:shadow-lg transition-shadow cursor-pointer group border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <span className="text-2xl">{collection.icon || "📦"}</span>
                      </div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{collection.description}</p>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                        View Collection <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
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
