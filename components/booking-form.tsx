"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2, Car, MapPin, Users, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export interface BookingFormProps {
  /** formId used in the formSubmissions table — defaults to "booking" */
  formId?: string;
  /** Where the form was embedded, e.g. "page-builder", "collection-item" */
  source?: string;
  /** Extra context merged into formData (e.g. itemTitle, collectionName) */
  context?: Record<string, unknown>;
  submitText?: string;
  successMessage?: string;
  onSubmitted?: () => void;
  defaultDestination?: string;
  /** Fallback fleet options when the fleet collection is empty */
  fleetOptions?: string[];
}

const DEFAULT_FLEET_OPTIONS = [
  "Safari 4x4 Land Cruiser",
  "Airport Transfer Sedan",
  "Corporate Staff Shuttle",
  "Minibus / Coaster",
  "Wheelchair-Accessible Van",
  "Not sure — advise me",
];

export function BookingForm({
  formId = "booking",
  source = "website",
  context,
  submitText = "Confirm Booking Request",
  successMessage = "Booking request received! We'll confirm your details shortly.",
  onSubmitted,
  defaultDestination = "",
  fleetOptions,
}: BookingFormProps) {
  const submitForm = useMutation(api.forms.submitForm);

  // Fleet options come from the "fleet" collection (all published items)
  const fleetCollection = useQuery(api.collections.getCollectionBySlug, { slug: "fleet" });
  const fleetItems = useQuery(
    api.collections.getPublishedItemsByCollection,
    fleetCollection?._id ? { collectionId: fleetCollection._id } : "skip"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fleet: "",
    destination: defaultDestination,
    numberOfDays: "1",
    numberOfPeople: "1",
    date: "",
    details: "",
  });

  const fleetChoices =
    fleetItems && fleetItems.length > 0
      ? fleetItems.map((item) => ({
          value: item.title,
          label: item.metadata?.price
            ? `${item.title} — ${item.metadata.price}`
            : item.title,
        }))
      : (fleetOptions && fleetOptions.length > 0 ? fleetOptions : DEFAULT_FLEET_OPTIONS).map(
          (opt) => ({ value: opt, label: opt })
        );

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.destination.trim() || !form.details.trim()) {
      toast.error("Please fill in your name, email, destination and details");
      return;
    }

    setIsSubmitting(true);
    try {
      const fleetItem = fleetItems?.find((i) => i.title === form.fleet);
      await submitForm({
        formId,
        formData: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          fleet: form.fleet || "Not specified",
          fleetSlug: fleetItem?.slug,
          destination: form.destination.trim(),
          numberOfDays: Number(form.numberOfDays) || 1,
          numberOfPeople: Number(form.numberOfPeople) || 1,
          preferredDate: form.date,
          details: form.details.trim(),
          formType: "booking",
          source,
          ...context,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          submittedAtReadable: new Date().toISOString(),
        },
      });
      toast.success(successMessage);
      setForm((p) => ({ ...p, name: "", email: "", phone: "", fleet: "", destination: "", numberOfDays: "1", numberOfPeople: "1", date: "", details: "" }));
      onSubmitted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit booking request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bk-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bk-name"
            placeholder="e.g. Jane Wanjiku"
            value={form.name}
            onChange={set("name")}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bk-email"
            type="email"
            placeholder="you@example.co.ke"
            value={form.email}
            onChange={set("email")}
            required
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bk-phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone / WhatsApp
          </Label>
          <Input
            id="bk-phone"
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={form.phone}
            onChange={set("phone")}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-fleet" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Car className="h-3 w-3" /> Preferred Fleet / Vehicle
          </Label>
          <Select value={form.fleet} onValueChange={(v) => setForm((p) => ({ ...p, fleet: v || "" }))}>
            <SelectTrigger id="bk-fleet" className="rounded-xl">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {fleetChoices.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-destination" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" /> Destination <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bk-destination"
          placeholder="e.g. Maasai Mara, Diani Beach, JKIA Airport..."
          value={form.destination}
          onChange={set("destination")}
          required
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bk-days" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Number of Days
          </Label>
          <Input
            id="bk-days"
            type="number"
            min={1}
            value={form.numberOfDays}
            onChange={set("numberOfDays")}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-people" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" /> Number of People
          </Label>
          <Input
            id="bk-people"
            type="number"
            min={1}
            value={form.numberOfPeople}
            onChange={set("numberOfPeople")}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <CalendarDays className="h-3 w-3" /> Preferred Date (optional)
        </Label>
        <Input
          id="bk-date"
          type="date"
          value={form.date}
          onChange={set("date")}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bk-details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trip Details <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="bk-details"
          placeholder="Pickup location, times, special requirements, itinerary ideas..."
          rows={3}
          value={form.details}
          onChange={set("details")}
          required
          className="rounded-xl resize-y"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-md transition"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            {submitText}
          </>
        )}
      </Button>
    </form>
  );
}
