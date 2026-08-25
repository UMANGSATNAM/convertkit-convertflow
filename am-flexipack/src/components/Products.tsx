"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/config/siteData";

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="animate-on-scroll group bg-white rounded-xl border border-border overflow-hidden transition-all duration-400 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-corporate-blue/20"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-56 overflow-hidden bg-light-bg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm text-white text-[0.6875rem] font-bold tracking-wider px-3 py-1.5 rounded-md">
          {product.number}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-dark-text mb-2 group-hover:text-corporate-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-[0.9375rem] text-secondary-text leading-relaxed mb-4">
          {product.shortDescription}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {product.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[0.6875rem] font-semibold px-2.5 py-1 rounded-md bg-light-blue text-corporate-blue"
            >
              {f}
            </span>
          ))}
          {product.features.length > 3 && (
            <span className="text-[0.6875rem] font-semibold px-2.5 py-1 rounded-md bg-light-bg text-secondary-text">
              +{product.features.length - 3} more
            </span>
          )}
        </div>
        <a
          href={`#products-${product.slug}`}
          className="inline-flex items-center gap-2 text-corporate-blue font-semibold text-[0.875rem] group-hover:gap-3 transition-all duration-300"
        >
          Explore Solution
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export default function Products() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
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
    <section id="products" className="section-padding bg-white">
      <div className="container-custom px-4 lg:px-8">
        <div ref={titleRef} className="animate-on-scroll text-center mb-16">
          <span className="eyebrow justify-center">Our Products</span>
          <h2 className="section-title mb-4">
            Flexible Packaging for Every Application
          </h2>
          <p className="section-subtitle mx-auto">
            Explore packaging formats designed for different products, applications and branding requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
