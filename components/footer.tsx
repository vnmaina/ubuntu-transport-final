"use client";

import Link from "next/link";
import Image from "next/image";

// Imported a comprehensive set of social icons from react-icons
import {
  FaGithub,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaThreads,
  FaFacebookF,
  FaDiscord
} from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Footer() {
  const pages = useQuery(api.pages.getPublishedPagesForNav);
  const organization = useQuery(api.organization.getOrganization);

  const socialLinks = organization ? {
    github: organization.github,
    twitter: organization.twitter,
    linkedin: organization.linkedin,
    instagram: organization.instagram,
  } : {};

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Socials */}
          <div className="space-y-4">
   {/* Left — Logo */}
<div className="flex w-fit items-center rounded-full bg-white/80 p-1 backdrop-blur-md">
  <Link
    href='/'
    className="flex items-center gap-3"
  >
    <Image
      src='/ubuntu-logo.webp'
      alt='Ubuntu Logistics'
      width={56}
      height={56}
      priority
      className="h-14 w-auto max-w-[180px] object-contain"
    />

    <span className="text-xl font-extrabold leading-tight tracking-tight whitespace-nowrap">
      <span className="text-primary">Ubuntu</span>{" "}
      <span className="text-secondary">Logistics</span>
    </span>
     <span className="mt-0.5 text-xs leading-tight text-muted-foreground">
     Tours, Safaris & Corporate Transport
          </span>
  </Link>
</div>
            {/* Social Media Grid Layout */}
            <div className="grid grid-cols-5 gap-y-4 gap-x-2 max-w-[200px]">
              {socialLinks.github && (
                <Link href={socialLinks.github} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                  <FaGithub size={20} />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link href={socialLinks.twitter} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X (formerly Twitter)">
                  <FaXTwitter size={20} />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link href={socialLinks.linkedin} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                  <FaLinkedinIn size={20} />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link href={socialLinks.instagram} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <FaInstagram size={20} />
                </Link>
              )}
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                <FaYoutube size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="TikTok">
                <FaTiktok size={18} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Threads">
                <FaThreads size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <FaFacebookF size={18} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
                <FaDiscord size={20} />
              </Link>
              {organization?.email && (
                <Link href={`mailto:${organization.email}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                  <MdOutlineMail size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {pages?.slice(0, 5).map((page) => (
                <li key={page._id}>
                  <Link 
                    href={`/${page.slug}`} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {organization?.name || "Your Brand"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
