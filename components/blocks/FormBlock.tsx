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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormRenderer } from "@/components/form-renderer";
import { BookingForm } from "@/components/booking-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  Star,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";

export interface FormBlockProps {
  id?: string;
  formType?: "contact" | "booking" | "subscribe" | "feedback" | "custom";
  layout?: "card" | "split" | "banner" | "minimal";
  title?: string;
  subtitle?: string;
  badgeText?: string;
  submitText?: string;
  successTitle?: string;
  successMessage?: string;
  customFormSlug?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    workingHours?: string;
    responseTime?: string;
  };
  bookingServices?: string[];
  feedbackCategories?: string[];
  redirectUrl?: string;
}

export function FormBlock({
  id,
  formType = "contact",
  layout = "split",
  title,
  subtitle,
  badgeText,
  submitText,
  successTitle,
  successMessage,
  customFormSlug,
  contactInfo = {
    email: "ben@ubuntulogistics.co.ke",
    phone: "+254 728 798589",
    address: "North Airport Road, Embakasi, Nairobi, Kenya",
    workingHours: "Mon - Sat, 6:00 AM - 10:00 PM",
    responseTime: "Usually responds within 1 hour",
  },
  bookingServices = [
    "Safari 4x4 Land Cruiser",
    "Airport Transfer Sedan",
    "Corporate Staff Shuttle",
    "Minibus / Coaster",
    "Wheelchair-Accessible Van",
  ],
  feedbackCategories = [
    "General Experience",
    "Product Feature Request",
    "Bug Report",
    "Customer Support",
    "Other",
  ],
  redirectUrl,
}: FormBlockProps) {
  const submitForm = useMutation(api.forms.submitForm);

  // Custom form query if custom type
  const customForm = useQuery(
    api.forms.getFormBySlug,
    formType === "custom" && customFormSlug ? { slug: customFormSlug } : "skip"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
  });

  // Subscribe form state
  const [subscribeData, setSubscribeData] = useState({
    email: "",
    name: "",
  });

  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    rating: 5,
    category: feedbackCategories[0] || "General Experience",
    comments: "",
    wouldRecommend: "yes",
  });

  const getFormIdentifier = () => {
    if (formType === "custom" && customFormSlug) return customFormSlug;
    return formType;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      toast.error("Please fill in required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm({
        formId: getFormIdentifier(),
        formData: {
          ...contactData,
          formType: "contact",
          submittedAtReadable: new Date().toISOString(),
        },
      });
      setIsSuccess(true);
      toast.success(successMessage || "Message sent successfully! We'll reply shortly.");
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeData.email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm({
        formId: getFormIdentifier(),
        formData: {
          ...subscribeData,
          formType: "subscribe",
          source: "Newsletter Block",
          submittedAtReadable: new Date().toISOString(),
        },
      });
      setIsSuccess(true);
      toast.success(successMessage || "Thank you for subscribing! Welcome aboard.");
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackData.comments.trim()) {
      toast.error("Please write your feedback message");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm({
        formId: getFormIdentifier(),
        formData: {
          ...feedbackData,
          formType: "feedback",
          submittedAtReadable: new Date().toISOString(),
        },
      });
      setIsSuccess(true);
      toast.success(successMessage || "Thank you for your valuable feedback!");
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setContactData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "email",
    });
    setSubscribeData({ email: "", name: "" });
    setFeedbackData({
      name: "",
      email: "",
      rating: 5,
      category: feedbackCategories[0] || "General Experience",
      comments: "",
      wouldRecommend: "yes",
    });
  };

  // Render Success Card
  const renderSuccessState = () => (
    <Card className="border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20 backdrop-blur-sm p-8 text-center shadow-lg rounded-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 mb-4 animate-in zoom-in-75 duration-300">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        {successTitle || (
          formType === "booking"
            ? "Booking Request Confirmed!"
            : formType === "subscribe"
            ? "Welcome to Our Community!"
            : formType === "feedback"
            ? "Feedback Received!"
            : "Message Sent Successfully!"
        )}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {successMessage || (
          formType === "booking"
            ? "We've received your booking request. Our team will confirm vehicle availability and reach out with a quote shortly."
            : formType === "subscribe"
            ? "You are now on the insider list. Expect thoughtful updates, exclusive insights, and zero spam."
            : formType === "feedback"
            ? "Your thoughts help us continuously enhance our products and services. Thank you for your time!"
            : "Thank you for reaching out. We will review your message and reply as soon as possible."
        )}
      </p>
      <Button variant="outline" onClick={resetForm} className="rounded-xl">
        Submit Another Response
      </Button>
    </Card>
  );

  // 1. SUBSCRIBE BANNER LAYOUT
  if (formType === "subscribe" && layout === "banner") {
    return (
      <section className="py-16 px-4 md:px-8 w-full max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 md:p-14 shadow-2xl border border-indigo-500/20">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          {isSuccess ? (
            renderSuccessState()
          ) : (
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              {badgeText && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
                  <BellRing className="w-3.5 h-3.5" />
                  {badgeText}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                {title || "Stay ahead with exclusive updates"}
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
                {subtitle || "Subscribe to our curated newsletter. Receive regular product news, expert insights, and community stories."}
              </p>

              <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={subscribeData.email}
                  onChange={(e) => setSubscribeData((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-6 px-4 focus:ring-2 focus:ring-indigo-400"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    submitText || "Subscribe"
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> No spam ever
                </span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
                <span>•</span>
                <span>100% Privacy protected</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Helper: Contact Info Left Column for Split Layout
  const renderContactInfoColumn = () => (
    <div className="flex flex-col justify-between p-8 md:p-10 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950 text-white shadow-xl border border-slate-800">
      <div>
        {badgeText && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {badgeText}
          </span>
        )}
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          {formType === "booking"
            ? "Book Your Transport"
            : formType === "feedback"
            ? "Your Voice Shapes Us"
            : "Let's Start a Conversation"}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          {formType === "booking"
            ? "Choose your vehicle, destination and travel dates. Our team will confirm availability and send you a quote swiftly."
            : formType === "feedback"
            ? "We read every single comment. Tell us what went well, what we can improve, or feature requests."
            : "Have questions about our solutions, bespoke projects, or custom pricing? Our team is standing by to help."}
        </p>

        <div className="space-y-6">
          {contactInfo?.email && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Email Us</p>
                <a href={`mailto:${contactInfo.email}`} className="text-sm font-medium hover:underline text-white">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          )}

          {contactInfo?.phone && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Phone</p>
                <a href={`tel:${contactInfo.phone}`} className="text-sm font-medium hover:underline text-white">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          )}

          {contactInfo?.address && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Headquarters</p>
                <p className="text-sm text-slate-300">{contactInfo.address}</p>
              </div>
            </div>
          )}

          {contactInfo?.workingHours && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Business Hours</p>
                <p className="text-sm text-slate-300">{contactInfo.workingHours}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {contactInfo?.responseTime && (
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs text-indigo-200">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>{contactInfo.responseTime}</span>
        </div>
      )}
    </div>
  );

  // Form Fields per Form Type
  const renderFormFields = () => {
    // 1. CONTACT FORM
    if (formType === "contact") {
      return (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-name"
                placeholder="Jane Doe"
                value={contactData.name}
                onChange={(e) => setContactData((p) => ({ ...p, name: e.target.value }))}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="jane@example.com"
                value={contactData.email}
                onChange={(e) => setContactData((p) => ({ ...p, email: e.target.value }))}
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number (optional)
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={contactData.phone}
                onChange={(e) => setContactData((p) => ({ ...p, phone: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subject
              </Label>
              <Input
                id="contact-subject"
                placeholder="Partnership, General Inquiry, etc."
                value={contactData.subject}
                onChange={(e) => setContactData((p) => ({ ...p, subject: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="contact-message"
              placeholder="Tell us about your project, timeline, or requirements..."
              rows={4}
              value={contactData.message}
              onChange={(e) => setContactData((p) => ({ ...p, message: e.target.value }))}
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
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {submitText || "Send Message"}
              </>
            )}
          </Button>
        </form>
      );
    }

    // 2. BOOKING FORM (shared Ubuntu booking form → formSubmissions)
    if (formType === "booking") {
      return (
        <BookingForm
          formId="booking"
          source="page-builder"
          fleetOptions={bookingServices}
          submitText={submitText || "Confirm Booking Request"}
          successMessage={successMessage || "Booking request received! We will confirm your details shortly."}
          onSubmitted={() => {
            setIsSuccess(true);
            if (redirectUrl) {
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 1500);
            }
          }}
        />
      );
    }


    // 3. SUBSCRIBE (CARD / MINIMAL)
    if (formType === "subscribe") {
      return (
        <form onSubmit={handleSubscribeSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sub-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Name (Optional)
            </Label>
            <Input
              id="sub-name"
              placeholder="e.g. Sarah"
              value={subscribeData.name}
              onChange={(e) => setSubscribeData((p) => ({ ...p, name: e.target.value }))}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sub-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sub-email"
              type="email"
              placeholder="you@example.com"
              value={subscribeData.email}
              onChange={(e) => setSubscribeData((p) => ({ ...p, email: e.target.value }))}
              required
              className="rounded-xl"
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
                Joining...
              </>
            ) : (
              <>
                <BellRing className="mr-2 h-4 w-4" />
                {submitText || "Subscribe Now"}
              </>
            )}
          </Button>
        </form>
      );
    }

    // 4. FEEDBACK FORM
    if (formType === "feedback") {
      return (
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall Rating
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFeedbackData((p) => ({ ...p, rating: star }))}
                  className={`p-2 rounded-xl transition ${
                    feedbackData.rating >= star
                      ? "text-amber-400 bg-amber-50 dark:bg-amber-950/40"
                      : "text-slate-300 dark:text-slate-700 hover:text-amber-300"
                  }`}
                >
                  <Star className="w-7 h-7 fill-current" />
                </button>
              ))}
              <span className="text-sm font-bold text-foreground ml-2">
                {feedbackData.rating} / 5 stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="feedback-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Name (optional)
              </Label>
              <Input
                id="feedback-name"
                placeholder="Anonymous or your name"
                value={feedbackData.name}
                onChange={(e) => setFeedbackData((p) => ({ ...p, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedback-category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <Select
                value={feedbackData.category}
                onValueChange={(val) => setFeedbackData((p) => ({ ...p, category: val || "" }))}
              >
                <SelectTrigger id="feedback-category" className="rounded-xl">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-comments" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Feedback & Comments <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="feedback-comments"
              placeholder="What did you love? What can we do better?"
              rows={4}
              value={feedbackData.comments}
              onChange={(e) => setFeedbackData((p) => ({ ...p, comments: e.target.value }))}
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
                Submitting Feedback...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {submitText || "Submit Feedback"}
              </>
            )}
          </Button>
        </form>
      );
    }

    // 5. CUSTOM FORM (using FormRenderer)
    if (formType === "custom") {
      if (customForm === undefined) {
        return (
          <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading custom form...
          </div>
        );
      }
      if (!customForm) {
        return (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
            Custom form <code className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{customFormSlug || "unspecified"}</code> was not found or is unpublished.
          </div>
        );
      }

      return (
        <FormRenderer
          formId={customForm.slug}
          blocks={customForm.blocks}
          settings={customForm.settings}
        />
      );
    }

    return null;
  };

  // Section Header Info
  const defaultTitles: Record<string, { title: string; subtitle: string; badge: string }> = {
    contact: {
      title: "Get in Touch with Our Team",
      subtitle: "Have a project in mind or need assistance? Fill out the form and we'll respond promptly.",
      badge: "Contact Us",
    },
    booking: {
      title: "Book Your Transport",
      subtitle: "Choose your vehicle, destination, travel dates and group size — we'll confirm availability and pricing.",
      badge: "Quick Booking",
    },
    subscribe: {
      title: "Subscribe to Our Newsletter",
      subtitle: "Join thousands of product creators and leaders receiving our weekly curated briefing.",
      badge: "Stay Updated",
    },
    feedback: {
      title: "We Value Your Feedback",
      subtitle: "Help us craft a better experience. Your comments and suggestions guide our roadmap.",
      badge: "User Review",
    },
    custom: {
      title: customForm?.name || "Form Submission",
      subtitle: customForm?.description || "Please complete the form fields below.",
      badge: "Custom Form",
    },
  };

  const headerTitle = title || defaultTitles[formType]?.title || "Form Submission";
  const headerSubtitle = subtitle || defaultTitles[formType]?.subtitle || "";
  const headerBadge = badgeText || defaultTitles[formType]?.badge || "";

  // 2. MINIMAL LAYOUT
  if (layout === "minimal") {
    return (
      <section className="py-12 px-4 max-w-xl mx-auto w-full">
        <div className="text-center mb-8">
          {headerBadge && (
            <Badge variant="secondary" className="mb-2">
              {headerBadge}
            </Badge>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{headerTitle}</h2>
          {headerSubtitle && <p className="text-sm text-muted-foreground mt-1">{headerSubtitle}</p>}
        </div>

        {isSuccess ? renderSuccessState() : <div className="p-2">{renderFormFields()}</div>}
      </section>
    );
  }

  // 3. CARD LAYOUT (Centered single card)
  if (layout === "card") {
    return (
      <section className="py-16 px-4 max-w-2xl mx-auto w-full">
        {isSuccess ? (
          renderSuccessState()
        ) : (
          <Card className="border shadow-xl rounded-2xl overflow-hidden bg-card/95 backdrop-blur">
            <CardHeader className="text-center pb-6 border-b bg-muted/30">
              {headerBadge && (
                <div className="flex justify-center mb-2">
                  <Badge variant="secondary" className="font-semibold">
                    {headerBadge}
                  </Badge>
                </div>
              )}
              <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {headerTitle}
              </CardTitle>
              {headerSubtitle && (
                <CardDescription className="text-sm md:text-base max-w-md mx-auto">
                  {headerSubtitle}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-6 md:p-8">{renderFormFields()}</CardContent>
          </Card>
        )}
      </section>
    );
  }

  // 4. SPLIT LAYOUT (Default: side info + form card)
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        {headerBadge && (
          <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold uppercase tracking-wider text-xs">
            {headerBadge}
          </Badge>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary">
          {headerTitle}
        </h2>
        {headerSubtitle && (
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            {headerSubtitle}
          </p>
        )}
      </div>

      {isSuccess ? (
        <div className="max-w-xl mx-auto">{renderSuccessState()}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex">{renderContactInfoColumn()}</div>

          <div className="lg:col-span-7 flex">
            <Card className="w-full border shadow-xl rounded-2xl p-6 md:p-8 bg-card flex flex-col justify-center">
              {renderFormFields()}
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
