"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { qualityChecks, certifications, images } from "@/config/siteData";

export default function Quality() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="quality" className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">Quality</span>
            <h2 className="section-title mb-4">
              Quality Built Into Every Layer
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={images.quality}
                alt="Quality inspection in flexible packaging manufacturing"
                className="w-full h-[350px] lg:h-[420px] object-cover"
                loading="lazy"
              />
            </div>

            {/* Right - Quality Checks */}
            <div>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {qualityChecks.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-light-bg border border-border group hover:border-corporate-blue/20 hover:bg-light-blue/50 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-corporate-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-corporate-blue group-hover:text-white transition-colors">
                      <Check size={14} className="text-corporate-blue group-hover:text-white" />
                    </div>
                    <span className="text-[0.9375rem] font-semibold text-dark-text">
                      {check}
                    </span>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-bold text-dark-text mb-4">
                  Certifications & Standards
                </h3>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="px-5 py-3 rounded-lg border border-dashed border-border bg-light-bg text-secondary-text text-[0.875rem] font-medium"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
