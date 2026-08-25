"use client";

import { useEffect, useRef } from "react";
import { materials } from "@/config/siteData";

export default function Materials() {
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
            <span className="eyebrow justify-center">Materials</span>
            <h2 className="section-title mb-4">
              Engineered Materials.
              <br className="hidden md:block" />
              <span className="text-corporate-blue"> Reliable Performance.</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Packaging structures can be selected according to product requirements, barrier needs and application specifications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {materials.map((material, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl border border-border bg-white hover:border-corporate-blue/30 hover:shadow-[0_4px_24px_rgba(20,85,217,0.06)] transition-all duration-400"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-light-blue flex items-center justify-center group-hover:bg-corporate-blue group-hover:text-white transition-colors duration-300">
                    <span className="text-[0.6875rem] font-bold text-corporate-blue group-hover:text-white transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-text mb-1 group-hover:text-corporate-blue transition-colors">
                      {material.name}
                    </h3>
                    <p className="text-[0.875rem] text-secondary-text leading-relaxed">
                      {material.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
