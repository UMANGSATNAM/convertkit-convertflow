"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, ArrowRight, Shield, Star, Layers, Users } from "lucide-react";
import { images } from "@/config/siteData";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, []);

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden bg-navy-deep">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={images.hero}
          alt="Premium flexible packaging pouches collection"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/85 to-navy-deep/70" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative container-custom px-4 lg:px-8 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left content */}
          <div
            ref={heroRef}
            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-corporate-blue animate-pulse" />
              <span className="text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-white/80">
                Flexible Packaging Solutions
              </span>
            </div>

            <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-black leading-[1.05] text-white mb-6 tracking-tight">
              Packaging That
              <span className="block text-blue-300">Protects.</span>
              Packaging That
              <span className="block text-blue-300">Performs.</span>
            </h1>

            <p className="text-[1.0625rem] md:text-lg text-white/65 leading-relaxed max-w-xl mb-10">
              Smart, reliable and customizable flexible packaging solutions designed to protect your products and strengthen your brand.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#quote" className="btn-primary text-base px-8 py-4">
                Request a Quote
                <ArrowRight size={18} />
              </a>
              <a href="#products" className="btn-secondary text-base px-8 py-4">
                Explore Products
                <ChevronRight size={18} />
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: Shield, label: "Custom Packaging" },
                { icon: Star, label: "Premium Printing" },
                { icon: Layers, label: "Multiple Formats" },
                { icon: Users, label: "B2B Solutions" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon size={14} className="text-blue-300" />
                  </div>
                  <span className="text-[0.8125rem] font-medium text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Product Image with floating cards */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <img
                src={images.hero}
                alt="Premium flexible packaging pouches collection"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 z-20 glass rounded-xl px-5 py-3.5 animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue/20 flex items-center justify-center">
                  <Star size={18} className="text-blue-300" />
                </div>
                <div>
                  <div className="text-[0.6875rem] font-semibold text-white/60 uppercase tracking-wider">Quality</div>
                  <div className="text-sm font-bold text-white">Custom Printed</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 z-20 glass rounded-xl px-5 py-3.5 animate-[float_5s_ease-in-out_infinite_0.5s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue/20 flex items-center justify-center">
                  <Shield size={18} className="text-blue-300" />
                </div>
                <div>
                  <div className="text-[0.6875rem] font-semibold text-white/60 uppercase tracking-wider">Protection</div>
                  <div className="text-sm font-bold text-white">High Barrier Options</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 z-20 glass rounded-xl px-5 py-3.5 animate-[float_4.5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue/20 flex items-center justify-center">
                  <Layers size={18} className="text-blue-300" />
                </div>
                <div>
                  <div className="text-[0.6875rem] font-semibold text-white/60 uppercase tracking-wider">Versatility</div>
                  <div className="text-sm font-bold text-white">Multiple Formats</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 -right-4 z-20 glass rounded-xl px-5 py-3.5 animate-[float_5.5s_ease-in-out_infinite_1.5s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue/20 flex items-center justify-center">
                  <Users size={18} className="text-blue-300" />
                </div>
                <div>
                  <div className="text-[0.6875rem] font-semibold text-white/60 uppercase tracking-wider">Tailored</div>
                  <div className="text-sm font-bold text-white">Made for Your Product</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
