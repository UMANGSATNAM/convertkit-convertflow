"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Upload, CheckCircle } from "lucide-react";

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="quote" className="section-padding bg-light-bg">
      <div className="container-custom px-4 lg:px-8">
        <div ref={sectionRef} className="animate-on-scroll">
          <div className="text-center mb-12">
            <span className="eyebrow justify-center">Get a Quote</span>
            <h2 className="section-title mb-4">Request a Quote</h2>
            <p className="section-subtitle mx-auto">
              Share your packaging requirements and our team will get back to you with a solution.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-3">Thank You!</h3>
              <p className="text-secondary-text">
                Your enquiry has been received. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-border">
                {/* Contact Information */}
                <h3 className="text-lg font-bold text-dark-text mb-6 pb-3 border-b border-border">
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Packaging Requirement */}
                <h3 className="text-lg font-bold text-dark-text mb-6 pb-3 border-b border-border">
                  Packaging Requirement
                </h3>
                <div className="grid sm:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Industry
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50">
                      <option value="">Select Industry</option>
                      <option>Food & Beverages</option>
                      <option>Spices & Seasonings</option>
                      <option>Snacks & Namkeen</option>
                      <option>Coffee & Tea</option>
                      <option>Dry Fruits & Nuts</option>
                      <option>Pet Food</option>
                      <option>Personal Care</option>
                      <option>Home Care</option>
                      <option>Agriculture</option>
                      <option>Nutraceuticals</option>
                      <option>Confectionery</option>
                      <option>FMCG</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Product Type *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="e.g., Coffee, Spices, Snacks"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Pouch Type
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50">
                      <option value="">Select Pouch Type</option>
                      <option>Stand-Up Pouch</option>
                      <option>Flat Bottom Pouch</option>
                      <option>Center Seal Pouch</option>
                      <option>Three Side Seal Pouch</option>
                      <option>Spout Pouch</option>
                      <option>Side Gusset Pouch</option>
                      <option>Vacuum Pouch</option>
                      <option>Custom Shape Pouch</option>
                      <option>Not Sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Required Quantity
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="e.g., 10,000 pcs"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Approximate Pack Size
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50"
                      placeholder="e.g., 200g, 500ml"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Preferred Finish
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50">
                      <option value="">Select Finish</option>
                      <option>Matte</option>
                      <option>Gloss</option>
                      <option>Soft Touch</option>
                      <option>Metallic</option>
                      <option>Kraft</option>
                      <option>Not Sure</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Custom Printing
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="printing" value="yes" className="w-4 h-4 accent-corporate-blue" />
                        <span className="text-[0.9375rem] text-dark-text">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="printing" value="no" className="w-4 h-4 accent-corporate-blue" />
                        <span className="text-[0.9375rem] text-dark-text">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <h3 className="text-lg font-bold text-dark-text mb-6 pb-3 border-b border-border">
                  Additional Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border text-dark-text text-[0.9375rem] transition-all duration-200 bg-light-bg/50 resize-none"
                      placeholder="Describe your packaging requirements in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8125rem] font-semibold text-dark-text mb-2">
                      Upload Artwork / Reference File
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-corporate-blue/40 transition-colors cursor-pointer">
                      <Upload size={28} className="text-secondary-text mx-auto mb-3" />
                      <p className="text-[0.875rem] text-secondary-text">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-[0.75rem] text-secondary-text/60 mt-1">
                        PDF, AI, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center text-base px-10 py-4">
                    Request My Quote
                    <Send size={18} />
                  </button>
                  <p className="text-[0.8125rem] text-secondary-text">
                    Your information will only be used to respond to your enquiry.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
