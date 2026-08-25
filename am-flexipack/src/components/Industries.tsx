"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { industries } from "@/config/siteData";

export default function Industries() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="industries" className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={titleRef} className="animate-on-scroll text-center mb-16">
          <span className="eyebrow justify-center">Industries</span>
          <h2 className="section-title mb-4">
            Packaging Solutions Across Industries
          </h2>
          <p className="section-subtitle mx-auto">
            Specialized packaging solutions tailored for diverse industry requirements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {industries.map((industry, i) => (
            <IndustryCard key={i} industry={industry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCard({ industry, index }: { industry: typeof industries[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="animate-on-scroll group relative rounded-xl overflow-hidden h-64 cursor-pointer"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <img
        src={industry.image}
        alt={industry.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent group-hover:from-navy-deep/95 transition-all duration-400" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white mb-1">
          {industry.name}
        </h3>
        <p className="text-[0.8125rem] text-white/60 line-clamp-2 mb-3">
          {industry.description}
        </p>
        <div className="flex items-center gap-2 text-corporate-blue text-[0.8125rem] font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Learn More
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
