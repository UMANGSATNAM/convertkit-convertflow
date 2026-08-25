"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
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
    <section className="relative py-24 lg:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container-custom px-4 lg:px-8 relative z-10">
        <div ref={sectionRef} className="animate-on-scroll text-center max-w-3xl mx-auto">
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-black text-white leading-tight tracking-tight mb-4">
            Have a Packaging Requirement?
          </h2>
          <p className="text-xl text-blue-300 font-semibold mb-6">
            Let&apos;s build the right pouch for your product.
          </p>
          <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
            Share your product, size, quantity and packaging requirements with us and our team can help you explore the right solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#quote" className="btn-primary text-base px-8 py-4">
              Request a Quote
              <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn-secondary text-base px-8 py-4">
              Talk to an Expert
              <Phone size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
