"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { images } from "@/config/siteData";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-light-bg">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={images.about}
                  alt="AM Flexi Pack flexible packaging manufacturing facility"
                  className="w-full h-[400px] lg:h-[520px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-navy rounded-xl p-6 shadow-xl hidden md:block">
                <div className="text-3xl font-black text-white mb-1">10+</div>
                <div className="text-sm text-white/70 font-medium">Years of Packaging Expertise</div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <span className="eyebrow">About AM Flexi Pack</span>
              <h2 className="section-title mb-6">
                Packaging Built
                <br />
                Around Your Product.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-secondary-text mb-6">
                AM Flexi Pack provides flexible packaging solutions designed around the needs of modern businesses. From everyday FMCG packaging to specialized applications, we focus on combining functionality, presentation and product protection.
              </p>
              <p className="text-[1.0625rem] leading-relaxed text-secondary-text mb-8">
                Our approach is simple — understand the product, understand the application, and develop packaging that performs.
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 text-corporate-blue font-semibold text-[0.9375rem] hover:gap-3 transition-all duration-300 group">
                Learn More About Us
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
