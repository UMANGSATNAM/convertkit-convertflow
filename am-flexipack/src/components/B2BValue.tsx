"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Eye, Shield, Palette, Sliders } from "lucide-react";

const points = [
  {
    icon: Eye,
    title: "Better Shelf Presence",
    description: "Packaging designed to help products stand out on retail shelves.",
  },
  {
    icon: Shield,
    title: "Product Protection",
    description: "Packaging structures selected around product requirements.",
  },
  {
    icon: Palette,
    title: "Brand Consistency",
    description: "Consistent visual presentation across product ranges.",
  },
  {
    icon: Sliders,
    title: "Flexible Customization",
    description: "Different formats, sizes, finishes and features.",
  },
];

export default function B2BValue() {
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
    <section className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">Why Better Packaging</span>
            <h2 className="section-title mb-4">
              Why Businesses Choose Better Packaging
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="text-center p-6 rounded-xl group hover:bg-light-blue/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-light-blue mx-auto mb-5 flex items-center justify-center group-hover:bg-corporate-blue transition-colors duration-300">
                    <Icon size={24} className="text-corporate-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-dark-text mb-2">{point.title}</h3>
                  <p className="text-[0.9375rem] text-secondary-text leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <a href="#quote" className="inline-flex items-center gap-2 text-corporate-blue font-semibold text-[0.9375rem] hover:gap-3 transition-all duration-300 group">
              Discuss Your Packaging Requirement
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
