"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/config/siteData";

function CountUp({ target }: { target: string }) {
  const [count, setCount] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (target.startsWith("[")) {
      setCount(target);
      return;
    }

    const numMatch = target.match(/\d+/);
    if (!numMatch) { setCount(target); return; }
    const num = parseInt(numMatch[0]);
    const suffix = target.replace(/\d+/, "");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * num) + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

export default function TrustStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 lg:py-20 bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div
          ref={sectionRef}
          className="animate-on-scroll"
        >
          <div className="text-center mb-12">
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-dark-text tracking-tight">
              Built Around Quality, Flexibility & Performance
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-black text-navy leading-none mb-2 transition-transform duration-300 group-hover:scale-105">
                  <CountUp target={stat.value} />
                </div>
                <div className="text-[0.8125rem] md:text-sm font-semibold text-secondary-text uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="w-10 h-[2px] bg-corporate-blue mx-auto mt-3 transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
