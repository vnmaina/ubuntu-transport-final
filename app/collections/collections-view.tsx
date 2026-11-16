"use client";

import { Button } from "@/components/ui/button";
import { Home, FolderOpen, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { stripHtml } from "@/lib/seo";

const ICON_NAME_TO_EMOJI: Record<string, string> = {
  briefcase: "💼",
  folder: "📁",
  users: "👥",
  package: "📦",
  services: "💼",
  projects: "📁",
  team: "👥",
  products: "📦",
};

function getIconDisplay(icon?: string): string {
  if (!icon) return "📦";
  if (icon.length > 1 && !/^[a-zA-Z]+$/.test(icon)) return icon;
  return ICON_NAME_TO_EMOJI[icon] || "📦";
}

interface CollectionsViewProps {
  collections: Array<{
    _id: string;
    name: string;
    slug: string;
    description?: string;
    summary?: string;
    icon?: string;
  }>;
}

export function CollectionsView({ collections }: CollectionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stripHtml(collection.description).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/10 to-muted/20">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 hover:bg-primary/10">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                All Collections
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Browse through our curated collections of content, from services and projects to team members and products.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {collections.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center text-4xl mb-6 border border-primary/20">
                <FolderOpen className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No collections yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Check back later for new collections or contact us to get started.
              </p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No collections found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <Link key={collection._id} href={`/collections/${collection.slug}`}>
                    <div className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border border-border/80 hover:border-primary/50 rounded-2xl p-6 bg-card hover:bg-card/80">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-3xl border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                          {getIconDisplay(collection.icon)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {collection.name}
                          </h3>
                          {(collection.summary || collection.description) && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {collection.summary || stripHtml(collection.description)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
                        View Collection <FolderOpen className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
