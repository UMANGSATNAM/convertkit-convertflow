"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { images } from "@/config/siteData";

const showcaseImages = [
  { src: images.packaging1, alt: "Matte finish flexible packaging pouch" },
  { src: images.packaging2, alt: "Glossy printed food packaging" },
  { src: images.packaging3, alt: "Kraft paper flexible pouch" },
  { src: images.packaging4, alt: "Transparent window packaging" },
  { src: images.packaging5, alt: "Metallic finish premium pouch" },
  { src: images.packaging6, alt: "Custom printed snack packaging" },
  { src: images.packaging7, alt: "Spout pouch for beverages" },
  { src: images.packaging8, alt: "Premium coffee pouch packaging" },
  { src: images.packaging9, alt: "Stand-up pouch with zipper" },
  { src: images.packaging10, alt: "Spice packaging solutions" },
];

export default function ProductShowcase() {
  const [lightbox, setLightbox] = useState<string | null>(null);
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
      <section className="section-padding bg-light-bg">
        <div className="container-custom px-4 lg:px-8">
          <div ref={sectionRef} className="animate-on-scroll">
            <div className="text-center mb-12">
              <span className="eyebrow justify-center">Showcase</span>
              <h2 className="section-title">
                Packaging Designed to Stand Out
              </h2>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {showcaseImages.map((img, i) => (
                <div
                  key={i}
                  className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(img.src)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="Packaging detail view"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
