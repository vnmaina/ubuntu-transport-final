import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip"
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { NavbarWrapper, FooterWrapper } from "@/components/navbar-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidgetWrapper } from "@/components/ChatWidgetWrapper";
import { ThemeColorsProvider } from "@/components/theme-colors-provider";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getSiteUrl,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const organization = await fetchQuery(api.organization.getOrganization);

    if (organization) {
      return {
        title: organization.defaultMetaTitle || organization.name || "My Company",
        description: organization.defaultMetaDescription || "Professional services and solutions for your business needs.",
        openGraph: {
          title: organization.defaultMetaTitle || organization.name || "My Company",
          description: organization.defaultMetaDescription || "Professional services and solutions for your business needs.",
          images: organization.defaultOgImage ? [{ url: organization.defaultOgImage }] : [],
          type: "website",
        },
        twitter: {
          card: (organization.defaultTwitterCard as "summary" | "summary_large_image" | "player" | "app") || "summary_large_image",
          title: organization.defaultMetaTitle || organization.name || "My Company",
          description: organization.defaultMetaDescription || "Professional services and solutions for your business needs.",
          images: organization.defaultOgImage ? [organization.defaultOgImage] : [],
        },
        robots: organization.defaultRobots || "index, follow",
        keywords: organization.defaultKeywords,
      };
    }
  } catch (error) {
    console.error("Failed to fetch organization metadata:", error);
  }

  return {
    title: "My Company",
    description: "Professional services and solutions for your business needs.",
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = await fetchQuery(api.organization.getOrganization).catch(() => null);
  const siteUrl = getSiteUrl(organization);

  const siteGraph = [
    buildOrganizationJsonLd(organization, siteUrl),
    buildWebSiteJsonLd(organization, siteUrl),
  ].filter(Boolean);

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, jetbrainsMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {siteGraph.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd({
                "@context": "https://schema.org",
                "@graph": siteGraph,
              }),
            }}
          />
        )}
        <Suspense fallback={null}>
          <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>
              <ThemeProvider defaultTheme="light" storageKey="nextjs-convex-auth-theme">
                <ThemeColorsProvider />
                <Toaster closeButton />
                <TooltipProvider>
                  <NavbarWrapper />
                  <main className="flex-1">
                    {children}
                  </main>
                  <FooterWrapper />
                  <ChatWidgetWrapper />
                </TooltipProvider>

              </ThemeProvider>
            </ConvexClientProvider>
          </ConvexAuthNextjsServerProvider>
        </Suspense>
      </body>
    </html>
  );
}
