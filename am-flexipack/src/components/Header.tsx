"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { navLinks } from "@/config/siteData";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom px-4 lg:px-8">
          <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
            <a href="#home" className="flex items-center gap-1 group">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xl lg:text-2xl font-black tracking-tight transition-colors duration-300 ${
                      scrolled ? "text-navy" : "text-white"
                    }`}
                  >
                    AM FLEXI
                  </span>
                  <span
                    className={`text-xl lg:text-2xl font-black tracking-tight transition-colors duration-300 ${
                      scrolled ? "text-corporate-blue" : "text-blue-300"
                    }`}
                  >
                    PACK
                  </span>
                </div>
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-200 rounded-md hover:bg-white/10 ${
                    scrolled
                      ? "text-dark-text/80 hover:text-navy hover:bg-navy/5"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-3">
              <a href="#quote" className="btn-primary text-sm">
                Request a Quote
                <ChevronRight size={16} />
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors ${
                scrolled
                  ? "text-navy hover:bg-navy/5"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-400 xl:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-400 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-navy">AM FLEXI</span>
                <span className="text-lg font-black text-corporate-blue">PACK</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-secondary-text hover:text-navy rounded-lg hover:bg-light-bg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3 px-4 text-[0.9375rem] font-medium text-dark-text hover:text-corporate-blue hover:bg-light-blue rounded-lg transition-colors"
                >
                  {link.label}
                  <ChevronRight size={16} className="text-secondary-text" />
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-border">
              <a
                href="#quote"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Request a Quote
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
