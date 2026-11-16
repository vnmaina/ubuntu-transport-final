"use client";

import Image from "next/image";
import { User, Envelope, LinkedinLogo, TwitterLogo, Globe } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

interface BlogAuthorBlockProps {
  author: {
    name: string;
    avatar?: string;
    bio?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    role?: string;
  };
  variant?: "simple" | "detailed" | "card" | "spotlight";
}

export function BlogAuthorBlock({ author, variant = "detailed" }: BlogAuthorBlockProps) {
  if (variant === "simple") {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
        {author.avatar ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
            {author.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground">{author.name}</p>
          {author.role && <p className="text-sm text-muted-foreground">{author.role}</p>}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {author.avatar ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/20 shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mb-4 border-4 border-primary/20">
              {author.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <h3 className="text-xl font-bold text-foreground mb-1">{author.name}</h3>
          {author.role && (
            <Badge variant="secondary" className="mb-3">
              {author.role}
            </Badge>
          )}
          {author.bio && (
            <p className="text-muted-foreground text-sm mb-4">{author.bio}</p>
          )}
          <div className="flex gap-2">
            {author.email && (
              <a href={`mailto:${author.email}`} className="p-2 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                <Envelope className="w-4 h-4" />
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                <LinkedinLogo className="w-4 h-4" />
              </a>
            )}
            {author.twitter && (
              <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                <TwitterLogo className="w-4 h-4" />
              </a>
            )}
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "spotlight") {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
        <div className="flex gap-6">
          {author.avatar ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30 shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border-4 border-primary/30 shrink-0">
              {author.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">{author.name}</h3>
            </div>
            {author.role && (
              <Badge className="mb-3 bg-primary text-primary-foreground">
                {author.role}
              </Badge>
            )}
            {author.bio && (
              <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: detailed
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
      <div className="flex gap-4">
        {author.avatar ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-border shrink-0">
            {author.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{author.name}</h3>
          </div>
          {author.role && (
            <p className="text-sm text-muted-foreground mb-2">{author.role}</p>
          )}
          {author.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">{author.bio}</p>
          )}
          <div className="flex gap-2 mt-3">
            {author.email && (
              <a href={`mailto:${author.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Envelope className="w-3 h-3" /> Email
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                <LinkedinLogo className="w-3 h-3" /> LinkedIn
              </a>
            )}
            {author.twitter && (
              <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                <TwitterLogo className="w-3 h-3" /> Twitter
              </a>
            )}
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                <Globe className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
