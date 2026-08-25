"use client";

import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";
import { testimonials } from "@/config/siteData";

export default function Testimonials() {
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
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">Testimonials</span>
            <h2 className="section-title">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
              >
                <Quote size={32} className="text-corporate-blue/20 mb-4" />
                <p className="text-[1.0625rem] text-secondary-text leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <div className="font-bold text-dark-text">{t.name}</div>
                  <div className="text-[0.875rem] text-secondary-text">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
