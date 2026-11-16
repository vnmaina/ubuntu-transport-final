import { JsonLd } from "@/components/JsonLd";

export interface MediaSeoItem {
  url: string;
  type?: "image" | "video";
  title?: string;
  alt?: string;
  credit?: string;
  link?: string;
}

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "ogg"];

/** Normalize loose media input (strings or objects) into clean MediaSeoItem[]. */
export function normalizeMediaItems(input: unknown): MediaSeoItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((img): MediaSeoItem | null => {
      if (typeof img === "string") {
        const url = img.trim();
        return url ? { url } : null;
      }
      if (img && typeof img === "object") {
        const item = img as Record<string, unknown>;
        const url = typeof item.url === "string" ? item.url.trim() : "";
        if (!url) return null;
        const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
        const isVideo =
          item.type === "video" ||
          (item.type !== "image" && VIDEO_EXTENSIONS.includes(ext));
        return {
          url,
          type: isVideo ? "video" : "image",
          title: typeof item.title === "string" ? item.title.trim() || undefined : undefined,
          alt: typeof item.alt === "string" ? item.alt.trim() || undefined : undefined,
          credit: typeof item.credit === "string" ? item.credit.trim() || undefined : undefined,
          link: typeof item.link === "string" ? item.link.trim() || undefined : undefined,
        };
      }
      return null;
    })
    .filter((i): i is MediaSeoItem => i !== null);
}

/** Best available alt text for a media item. */
export function mediaAlt(item: MediaSeoItem, fallback = "Image"): string {
  return item.alt || item.title || fallback;
}

/**
 * Renders ImageGallery / ImageObject / VideoObject JSON-LD for a set of media
 * items — improves Google Images, video, and rich-result eligibility.
 */
export function MediaJsonLd({
  items,
  name,
  description,
}: {
  items: MediaSeoItem[];
  name?: string;
  description?: string;
}) {
  const valid = items.filter((i) => i.url);
  if (valid.length === 0) return null;

  const heading = name || "Media";
  const data = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: heading,
    description: description || undefined,
    image: valid.map((i) =>
      i.type === "video"
        ? {
            "@type": "VideoObject",
            contentUrl: i.url,
            name: i.title || i.alt || heading,
            description: i.alt || i.title || undefined,
          }
        : {
            "@type": "ImageObject",
            url: i.url,
            name: i.title || i.alt || heading,
            description: i.alt || i.title || undefined,
            creditText: i.credit || undefined,
            ...(i.link ? { contentUrl: i.link } : {}),
          }
    ),
  };

  return <JsonLd data={data} />;
}
