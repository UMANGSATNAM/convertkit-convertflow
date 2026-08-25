"use client";

import { useEffect, useRef, useState } from "react";
import { customizationOptions } from "@/config/siteData";

export default function Customization() {
  const [activeIndex, setActiveIndex] = useState(0);
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
    <section className="section-padding bg-light-bg">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-12">
            <span className="eyebrow justify-center">Customization</span>
            <h2 className="section-title mb-4">Designed Around Your Product</h2>
            <p className="section-subtitle mx-auto">
              Packaging can be customized around your product, brand and application requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-5xl mx-auto">
            {/* Left - Options */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0">
              {customizationOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-shrink-0 lg:flex-shrink px-5 py-3.5 rounded-lg text-left text-[0.9375rem] font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeIndex === i
                      ? "bg-corporate-blue text-white shadow-lg shadow-corporate-blue/20"
                      : "bg-white text-dark-text hover:bg-light-blue border border-border"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>

            {/* Right - Description */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-border">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-light-blue flex items-center justify-center">
                  <span className="text-2xl font-black text-corporate-blue">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-3">
                    {customizationOptions[activeIndex].name}
                  </h3>
                  <p className="text-[1.0625rem] leading-relaxed text-secondary-text">
                    {customizationOptions[activeIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
