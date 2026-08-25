"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { company } from "@/config/siteData";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
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

  const contactInfo = [
    { icon: Phone, label: "Phone", value: company.phone },
    { icon: Mail, label: "Email", value: company.email },
    { icon: MapPin, label: "Address", value: company.address },
    { icon: Clock, label: "Working Hours", value: company.workingHours },
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-16">
            <span className="eyebrow justify-center">Contact</span>
            <h2 className="section-title mb-4">Let&apos;s Talk Packaging</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Left - Contact Info */}
            <div>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-light-blue flex items-center justify-center flex-shrink-0 group-hover:bg-corporate-blue transition-colors duration-300">
                        <Icon size={20} className="text-corporate-blue group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-[0.8125rem] font-semibold text-secondary-text mb-0.5">
                          {info.label}
                        </div>
                        <div className="text-[1.0625rem] font-medium text-dark-text">
                          {info.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Right - Quick Enquiry Form */}
            <div className="bg-light-bg rounded-2xl p-8 border border-border">
              <h3 className="text-lg font-bold text-dark-text mb-6">Quick Enquiry</h3>
              {submitted ? (
                <div className="text-center py-10">
                  <p className="text-dark-text font-semibold mb-2">Thank you!</p>
                  <p className="text-secondary-text text-[0.9375rem]">We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] bg-white transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] bg-white transition-all duration-200"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] bg-white transition-all duration-200 resize-none"
                      placeholder="Your message"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send Message
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
