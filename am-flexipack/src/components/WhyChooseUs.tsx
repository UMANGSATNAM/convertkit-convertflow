"use client";

import { useEffect, useRef } from "react";
import { Shield, Printer, Settings, Layers, CheckCircle, TrendingUp } from "lucide-react";
import { whyChooseUs } from "@/config/siteData";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Printer,
  Settings,
  Layers,
  CheckCircle,
  TrendingUp,
};

export default function WhyChooseUs() {
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
    <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container-custom px-4 lg:px-8 relative z-10">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.1em] uppercase text-corporate-blue mb-4">
              Why AM Flexi Pack
            </span>
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-black text-white leading-tight tracking-tight max-w-3xl mx-auto">
              More Than Packaging.
              <br />
              <span className="text-blue-300">A Better Way to Protect Your Product.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, i) => {
              const Icon = iconMap[item.icon] || Shield;
              return (
                <div
                  key={i}
                  className="group p-7 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-corporate-blue/20 transition-all duration-400"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-corporate-blue/15 flex items-center justify-center mb-5 group-hover:bg-corporate-blue/25 transition-colors">
                    <Icon size={22} className="text-blue-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[0.9375rem] text-white/50 leading-relaxed">
                    {item.description}
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
