"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Navbar1 } from "@/components/navbar1";
import { Footer } from "@/components/footer";

export function NavbarWrapper() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure header height so we can reserve space when it goes fixed
  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver(() => {
      setHeaderHeight(headerRef.current?.offsetHeight ?? 0);
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full z-50 transition-all duration-300 bg-white ${
          isScrolled
            ? "fixed top-0 left-0 right-0 shadow-md"
            : "relative"
        }`}
      >
        <Navbar1 />
      </header>
      {/* Spacer to prevent content jump when header becomes fixed */}
      {isScrolled && <div style={{ height: headerHeight }} aria-hidden="true" />}
    </>
  );
}

export function FooterWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
}
