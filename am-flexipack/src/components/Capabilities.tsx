"use client";

import { useEffect, useRef } from "react";
import { Printer, Layers, Package, Sparkles, CheckCircle } from "lucide-react";
import { capabilities } from "@/config/siteData";

const iconMap: Record<string, React.ElementType> = {
  Printer,
  Layers,
  Package,
  Sparkles,
  CheckCircle,
};

export default function Capabilities() {
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
    <section id="capabilities" className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container-custom px-4 lg:px-8 relative z-10">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.1em] uppercase text-corporate-blue mb-4">
              Capabilities
            </span>
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-black text-white leading-tight tracking-tight">
              Built for <span className="text-blue-300">Precision</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {capabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon] || Package;
              return (
                <div
                  key={i}
                  className="group p-7 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-corporate-blue/20 transition-all duration-400"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-corporate-blue/15 flex items-center justify-center mb-5 group-hover:bg-corporate-blue/25 transition-colors">
                    <Icon size={24} className="text-blue-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-[0.9375rem] text-white/50 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
