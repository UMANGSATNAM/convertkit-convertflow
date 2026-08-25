"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { galleryImages, galleryCategories } from "@/config/siteData";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

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

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <section id="portfolio" className="section-padding bg-light-bg">
        <div className="container-custom px-4 lg:px-8">
          <div ref={sectionRef} className="animate-on-scroll">
            <div className="text-center mb-10">
              <span className="eyebrow justify-center">Portfolio</span>
              <h2 className="section-title mb-4">
                Packaging That Gets Noticed
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-lg text-[0.8125rem] font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-corporate-blue text-white shadow-lg shadow-corporate-blue/20"
                      : "bg-white text-dark-text border border-border hover:border-corporate-blue/30 hover:text-corporate-blue"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img, i) => (
                <div
                  key={`${activeCategory}-${i}`}
                  className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
                  onClick={() => setLightbox(img.src)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300 flex items-end">
                    <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white text-[0.75rem] font-semibold bg-navy/60 backdrop-blur-sm px-3 py-1.5 rounded-md">
                        {img.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <img src={lightbox} alt="Gallery detail view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
