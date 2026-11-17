import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon } from 'lucide-react';
import { TwitterIcon } from '@/components/ui/brand-icons';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import Link from "next/link";

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { title: 'How it works', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Use Cases', href: '#' },
      { title: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About us', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'Careers', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Community', href: '#' },
      { title: 'Help Center', href: '#' },
      { title: 'Partners', href: '#' },
      { title: 'Status', href: '#' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { title: 'API', href: '#' },
      { title: 'Documentation', href: '#' },
      { title: 'Guides', href: '#' },
      { title: 'Tools', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
];

export default function FooterSubscribe() {
  return (
    <footer className="bg-background w-full border-t">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        {/* Newsletter Section */}
        <div className="border-border border-b py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground mt-4 max-w-lg">
                Get the latest updates, articles, and resources sent straight to
                your inbox. No spam, unsubscribe at any time.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <form className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2"
                >
                  Subscribe <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="#" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Your Company</span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Empowering the next generation of creators and innovators.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-border border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-center text-sm md:text-left">
              &copy; {new Date().getFullYear()} Your Company, Inc. All rights
              reserved.
            </p>
            <nav className="flex gap-6">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
