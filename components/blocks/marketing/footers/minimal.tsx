"use client";

import { ArrowUpIcon } from 'lucide-react';
import { TwitterIcon, InstagramIcon, GithubIcon } from '@/components/ui/brand-icons';
import Link from "next/link";

const footerLinks = [
  {
    title: 'Product',
    links: [
      { title: 'Features', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '#' },
      { title: 'Support', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy', href: '#' },
      { title: 'Terms', href: '#' },
      { title: 'Cookies', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
];

export default function FooterMinimal() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background w-full border-t">
      <div className="container mx-auto px-4 py-12 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <Link href="#" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Your Company</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              Simplifying complexity, one interface at a time.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-medium">{group.title}</h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            aria-label="Scroll to top"
          >
            Back to top <ArrowUpIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
