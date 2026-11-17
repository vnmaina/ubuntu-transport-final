"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaYoutube, FaTiktok, FaDribbble, FaBehance, FaGlobe } from "react-icons/fa";
import { Mail, MapPin, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface TeamCardProps {
  item: {
    _id: Id<"collectionItems">;
    title: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    metadata?: {
      role?: string;
      email?: string;
      linkedin?: string;
      twitter?: string;
      github?: string;
      instagram?: string;
      facebook?: string;
      youtube?: string;
      tiktok?: string;
      dribbble?: string;
      behance?: string;
      website?: string;
      bio?: string;
      department?: string;
      location?: string;
      hireDate?: string;
      expertise?: string[];
    };
  };
  collectionSlug: string;
  variant?: "default" | "compact" | "large" | "masonry";
}

const socialIcons: Record<string, any> = {
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  dribbble: FaDribbble,
  behance: FaBehance,
  website: FaGlobe,
};

export function TeamCard({ item, collectionSlug, variant = "default" }: TeamCardProps) {
  const metadata = item.metadata || {};
  const socialLinks = [
    { key: "linkedin", url: metadata.linkedin },
    { key: "twitter", url: metadata.twitter },
    { key: "github", url: metadata.github },
    { key: "instagram", url: metadata.instagram },
    { key: "facebook", url: metadata.facebook },
    { key: "youtube", url: metadata.youtube },
    { key: "tiktok", url: metadata.tiktok },
    { key: "dribbble", url: metadata.dribbble },
    { key: "behance", url: metadata.behance },
    { key: "website", url: metadata.website },
  ].filter(link => link.url);

  if (variant === "compact") {
    return (
      <Link href={`/collections/${collectionSlug}/${item.slug}`}>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted mx-auto">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    👤
                  </div>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
            {metadata.role && (
              <p className="text-sm text-muted-foreground mt-1">{metadata.role}</p>
            )}
            {metadata.department && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {metadata.department}
              </Badge>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={`/collections/${collectionSlug}/${item.slug}`}>
        <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-6xl">
                👤
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex gap-2">
                {socialLinks.slice(0, 4).map((link) => {
                  const Icon = socialIcons[link.key];
                  return (
                    <Button
                      key={link.key}
                      size="icon"
                      variant="secondary"
                      className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
            {metadata.role && (
              <p className="text-muted-foreground mt-1">{metadata.role}</p>
            )}
            {metadata.bio && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{metadata.bio}</p>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "masonry") {
    return (
      <Link href={`/collections/${collectionSlug}/${item.slug}`}>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="relative overflow-hidden">
            <div className="relative aspect-[3/4]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-6xl">
                  👤
                </div>
              )}
            </div>
            <div className="from-background/90 to-background/0 absolute inset-0 bg-gradient-to-t opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-6 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="text-foreground text-lg font-medium">{item.title}</h3>
              {metadata.role && <p className="mt-1 text-sm">{metadata.role}</p>}
              {metadata.bio && <p className="mt-4 text-sm line-clamp-3">{metadata.bio}</p>}
              <div className="mt-6 flex gap-2">
                {socialLinks.slice(0, 3).map((link) => {
                  const Icon = socialIcons[link.key];
                  return (
                    <Button
                      key={link.key}
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/collections/${collectionSlug}/${item.slug}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted ring-4 ring-muted/20 group-hover:ring-primary/30 transition-all">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    👤
                  </div>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">{item.title}</h3>
            {metadata.role && (
              <p className="text-muted-foreground mt-1">{metadata.role}</p>
            )}
            {metadata.department && (
              <Badge variant="secondary" className="mt-2">
                {metadata.department}
              </Badge>
            )}
            {metadata.location && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {metadata.location}
              </div>
            )}
            {metadata.bio && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{metadata.bio}</p>
            )}
            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {socialLinks.slice(0, 4).map((link) => {
                const Icon = socialIcons[link.key];
                return (
                  <Button
                    key={link.key}
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
