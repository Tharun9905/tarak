import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const CATEGORIES = ['All', 'Weddings', 'Portraits', 'Events'];

const PORTFOLIO_DATA = [
  { id: 1, category: 'Weddings', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2670&auto=format&fit=crop', alt: 'Wedding Details', span: 'col-span-1 row-span-2' },
  { id: 2, category: 'Portraits', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2670&auto=format&fit=crop', alt: 'Studio Portrait', span: 'col-span-1 row-span-1' },
  { id: 3, category: 'Events', src: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2670&auto=format&fit=crop', alt: 'Event Celebration', span: 'col-span-1 row-span-1' },
  { id: 4, category: 'Weddings', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2670&auto=format&fit=crop', alt: 'Wedding Couple', span: 'col-span-1 row-span-1' },
  { id: 5, category: 'Portraits', src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop', alt: 'Portrait Session', span: 'col-span-1 row-span-2' },
  { id: 6, category: 'Events', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop', alt: 'Live Event', span: 'col-span-1 row-span-1' }
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredData = activeTab === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === activeTab);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredData.length - 1 ? 0 : prev + 1));
  }, [filteredData.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredData.length - 1 : prev - 1));
  }, [filteredData.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`font-mono text-sm lg:text-base tracking-widest uppercase transition-colors duration-300 pb-1 border-b-2 ${
              activeTab === cat 
                ? 'text-ember border-ember' 
                : 'text-muted-film border-transparent hover:text-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-[250px]">
        {filteredData.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => openLightbox(index)}
            className={`gallery-item relative group overflow-hidden cursor-pointer bg-charcoal ${item.span} md:col-span-1 md:row-span-1`}
            style={{ minHeight: '250px' }} // For mobile fallback
          >
            <img 
              src={item.src} 
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border border-transparent group-hover:border-ember/50">
              <span className="font-display text-2xl tracking-widest text-cream translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                VIEW <span className="text-ember">▶</span>
              </span>
            </div>
            
            <div className="absolute bottom-4 left-4 font-mono text-xs text-cream/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {item.category}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-void/95 flex items-center justify-center backdrop-blur-md">
          <button onClick={closeLightbox} className="absolute top-6 right-6 lg:top-10 lg:right-10 text-cream hover:text-ember transition-colors z-50">
            <X size={36} />
          </button>
          
          <button onClick={prevImage} className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 text-cream hover:text-ember transition-colors p-4 z-50 group">
            <ChevronLeft size={48} className="group-hover:-translate-x-2 transition-transform" />
          </button>
          
          <button onClick={nextImage} className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 text-cream hover:text-ember transition-colors p-4 z-50 group">
            <ChevronRight size={48} className="group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="w-[90vw] h-[80vh] flex items-center justify-center relative">
            <img 
              src={filteredData[currentIndex]?.src} 
              alt={filteredData[currentIndex]?.alt}
              className="max-w-full max-h-full object-contain shadow-2xl border border-charcoal"
            />
            <div className="absolute bottom-[-40px] left-0 font-mono text-sm text-silver">
              {currentIndex + 1} / {filteredData.length} — {filteredData[currentIndex]?.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
