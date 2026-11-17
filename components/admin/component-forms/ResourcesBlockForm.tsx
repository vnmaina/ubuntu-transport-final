"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link2, ExternalLink, BookOpen } from "lucide-react";
import { ComponentFormProps } from "./form-registry";
import { ResourceLink } from "@/components/blocks/ResourcesBlock";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function ResourcesBlockForm({ props, onChange, mode = "edit" }: ComponentFormProps) {
  const [localProps, setLocalProps] = React.useState(props);
  const [prevProps, setPrevProps] = React.useState(props);
  if (props !== prevProps) {
    setPrevProps(props);
    setLocalProps(props);
  }
  const debounced = useDebounce(localProps, 400);
  React.useEffect(() => {
    Object.keys(debounced).forEach((key) => {
      if (debounced[key] !== props[key]) onChange(key, debounced[key]);
    });
  }, [debounced, props, onChange]);

  const updateProp = (key: string, value: unknown) =>
    setLocalProps((prev: Record<string, unknown>) => ({ ...prev, [key]: value }));

  const items: ResourceLink[] = Array.isArray(localProps.items)
    ? localProps.items.map((item: ResourceLink | string) =>
        typeof item === "string" ? { title: item, url: item } : item
      )
    : [];

  const updateItem = (index: number, field: keyof ResourceLink, value: string) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value || undefined } : item
    );
    updateProp("items", next);
  };

  const addItem = () =>
    updateProp("items", [...items, { title: "", url: "", description: "", group: "" }]);

  const removeItem = (index: number) =>
    updateProp("items", items.filter((_, i) => i !== index));

  if (mode === "form") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          Configure resource links in the <strong>Edit</strong> tab.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section copy */}
      <div className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Section Copy
        </p>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Eyebrow Label</Label>
          <Input
            value={localProps.eyebrow || ""}
            onChange={(e) => updateProp("eyebrow", e.target.value)}
            placeholder="Useful Links"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            value={localProps.title || ""}
            onChange={(e) => updateProp("title", e.target.value)}
            placeholder="Explore Our Resources"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Subtitle</Label>
          <Textarea
            value={localProps.subtitle || ""}
            onChange={(e) => updateProp("subtitle", e.target.value)}
            placeholder="Quick links to services, destinations, fleet and more..."
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      {/* Link items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resource Links ({items.length})
          </p>
          <Button type="button" size="sm" variant="secondary" onClick={addItem} className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Link
          </Button>
        </div>

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No links yet — click <strong>Add Link</strong> to start.
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, i) => {
            const external = /^https?:\/\//i.test(item.url || "");
            return (
              <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.url ? (
                      external ? (
                        <ExternalLink className="h-4 w-4 text-primary" />
                      ) : (
                        <Link2 className="h-4 w-4 text-primary" />
                      )
                    ) : null}
                    <Badge variant="secondary" className="text-xs">Link {i + 1}</Badge>
                    {item.group && (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                        {item.group}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) => updateItem(i, "title", e.target.value)}
                      placeholder="e.g. Safari Packages"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      URL {external ? "(external — opens in new tab)" : "(internal path or full URL)"}
                    </Label>
                    <Input
                      value={item.url || ""}
                      onChange={(e) => updateItem(i, "url", e.target.value)}
                      placeholder={external ? "https://..." : "/collections/services"}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground">Description (optional)</Label>
                    <Input
                      value={item.description || ""}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Short description shown under the title"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Group (for Columns layout)
                    </Label>
                    <Input
                      value={item.group || ""}
                      onChange={(e) => updateItem(i, "group", e.target.value)}
                      placeholder="e.g. Services, Fleet, Destinations"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        <strong>Tip:</strong> Internal paths like <code>/collections/fleet</code> use fast client-side
        navigation. Full <code>https://</code> URLs open in a new tab automatically. Use the{" "}
        <strong>Group</strong> field with the <strong>Columns</strong> layout to organize links into
        categories like Services, Fleet and Destinations.
      </p>
    </div>
  );
}
