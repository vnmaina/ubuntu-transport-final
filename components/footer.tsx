
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaThreads,
  FaFacebookF,
  FaDiscord,
} from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Footer() {
  const pages = useQuery(api.pages.getPublishedPagesForNav);
  const organization = useQuery(api.organization.getOrganization);

  const servicesCollection = useQuery(
    api.collections.getCollectionBySlug,
    { slug: "services" }
  );

  const destinationsCollection = useQuery(
    api.collections.getCollectionBySlug,
    { slug: "destinations" }
  );

  const serviceItems = useQuery(
    api.collections.getPublishedItemsByCollection,
    servicesCollection?._id
      ? { collectionId: servicesCollection._id }
      : "skip"
  );

  const destinationItems = useQuery(
    api.collections.getPublishedItemsByCollection,
    destinationsCollection?._id
      ? { collectionId: destinationsCollection._id }
      : "skip"
  );

  const topServices = (serviceItems ?? []).slice(0, 5);
  const topDestinations = (destinationItems ?? []).slice(0, 5);

  const socialLinks = [
    { url: organization?.facebook, icon: FaFacebookF, label: "Facebook" },
    { url: organization?.twitter, icon: FaXTwitter, label: "X" },
    { url: organization?.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
    { url: organization?.instagram, icon: FaInstagram, label: "Instagram" },
    { url: organization?.github, icon: FaGithub, label: "GitHub" },
  ].filter((social) => social.url);

  const footerLinkClass =
    "text-sm text-muted-foreground transition-colors duration-200 hover:text-primary hover:translate-x-0.5 inline-flex";

  const headingClass =
    "text-sm font-bold tracking-wide text-foreground";

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/30">

      {/* Main Footer */}
      <div className="container mx-auto px-5 py-14 md:px-8 md:py-16 lg:py-20">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-4">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Ubuntu Logistics homepage"
            >
              <Image
                src="/ubuntu-logo.webp"
                alt="Ubuntu Logistics"
                width={56}
                height={56}
                priority
                className="h-14 w-auto object-contain"
              />

              <div className="flex flex-col">
                <span className="text-xl font-extrabold leading-tight tracking-tight">
                  <span className="text-primary">Ubuntu</span>{" "}
                  <span className="text-secondary">Logistics</span>
                </span>

                <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                  Tours, Safaris & Corporate Transport
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Discover exceptional travel experiences, unforgettable
              safari adventures and reliable corporate transport
              solutions with Ubuntu Logistics.
            </p>

            {/* Contact Details */}
            <div className="space-y-3">
              {organization?.email && (
                <a
                  href={`mailto:${organization.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span className="break-all">{organization.email}</span>
                </a>
              )}

              {organization?.phone && (
                <a
                  href={`tel:${organization.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span>{organization.phone}</span>
                </a>
              )}

              {organization?.address && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{organization.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}

          </div>

          {/* Quick Links */}
          <div className="space-y-5 lg:col-span-2">
            <h4 className={headingClass}>Explore</h4>

            <ul className="space-y-3">
              {pages?.slice(0, 6).map((page) => (
                <li key={page._id}>
                  <Link
                    href={`/${page.slug}`}
                    className={footerLinkClass}
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5 lg:col-span-2">
            <h4 className={headingClass}>Our Services</h4>

            <ul className="space-y-3">
              {topServices.length > 0 ? (
                topServices.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/collections/services/${item.slug}`}
                      className={footerLinkClass}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/collections/services"
                    className={footerLinkClass}
                  >
                    All Services
                  </Link>
                </li>
              )}
            </ul>

            <Link
              href="/collections/services"
              className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-primary transition-colors hover:text-secondary"
            >
              View all services
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Destinations */}
          <div className="space-y-5 lg:col-span-2">
            <h4 className={headingClass}>Destinations</h4>

            <ul className="space-y-3">
              {topDestinations.length > 0 ? (
                topDestinations.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/collections/destinations/${item.slug}`}
                      className={footerLinkClass}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/collections/destinations"
                    className={footerLinkClass}
                  >
                    All Destinations
                  </Link>
                </li>
              )}
            </ul>

            <Link
              href="/collections/destinations"
              className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-primary transition-colors hover:text-secondary"
            >
              Explore destinations
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Resources */}
          <div className="space-y-5 lg:col-span-2">
            <h4 className={headingClass}>Resources</h4>

            <ul className="space-y-3">
              <li>
                <Link href="/blogs" className={footerLinkClass}>
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className={footerLinkClass}>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className={footerLinkClass}>
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLinkClass}>
                  Contact Us
                </Link>
              </li>
            </ul>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-primary transition-colors hover:text-secondary"
            >
              Get in touch
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-14 border-t border-border pt-7 md:mt-16">

          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

            <p className="text-xs leading-relaxed text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-foreground">
                {organization?.name || "Ubuntu Logistics"}
              </span>
              . All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/contact"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
