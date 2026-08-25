"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/config/siteData";

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
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
    <section className="section-padding bg-light-bg">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">Our Process</span>
            <h2 className="section-title mb-4">
              From Concept to Finished Pouch
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {processSteps.map((step, i) => (
              <div key={i} className="relative flex gap-6 lg:gap-10 group">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-corporate-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0 z-10 group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-border group-hover:bg-corporate-blue/30 transition-colors duration-300" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10 lg:pb-14 flex-1">
                  <h3 className="text-lg font-bold text-dark-text mb-1.5 group-hover:text-corporate-blue transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[0.9375rem] text-secondary-text leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
