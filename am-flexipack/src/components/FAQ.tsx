"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/config/siteData";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">FAQ</span>
            <h2 className="section-title">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-border last:border-b-0"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-[1.0625rem] font-semibold text-dark-text pr-4 group-hover:text-corporate-blue transition-colors">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-light-bg flex items-center justify-center transition-transform duration-300 ${openIndex === i ? "rotate-180 bg-corporate-blue" : ""}`}>
                    <ChevronDown size={16} className={`transition-colors ${openIndex === i ? "text-white" : "text-secondary-text"}`} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-48 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-[0.9375rem] text-secondary-text leading-relaxed">
                    {faq.answer}
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
