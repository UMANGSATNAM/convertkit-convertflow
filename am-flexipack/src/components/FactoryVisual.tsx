"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { images } from "@/config/siteData";

export default function FactoryVisual() {
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
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={images.factory}
          alt="Flexible packaging manufacturing production line"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy-deep/85" />
      </div>

      <div className="container-custom px-4 lg:px-8 relative z-10">
        <div ref={sectionRef} className="animate-on-scroll max-w-3xl">
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-black text-white leading-tight tracking-tight mb-6">
            Precision Manufacturing.
            <br />
            <span className="text-blue-300">Consistent Results.</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
            Every packaging solution begins with the right combination of materials, design and manufacturing processes.
          </p>
          <a href="#capabilities" className="btn-primary text-base px-8 py-4">
            Explore Our Capabilities
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
