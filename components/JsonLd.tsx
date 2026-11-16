import { serializeJsonLd } from "@/lib/seo";

/** Renders a JSON-LD <script> tag. Safe for server components. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
