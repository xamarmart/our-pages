import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import Icon from './Icon';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onToggleSave: (id: string) => void;
}

const SWIPE_THRESHOLD = 30; // pixels

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack, onToggleSave }) => {
  const navigate = useNavigate();

  const handleViewingRequest = () => {
    const phone = '252612679357';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = origin + '/property/' + product.id;
    const rawLocation = product.location ?? product.city ?? '';
    const parts = rawLocation ? rawLocation.split(',').map(s => s.trim()).filter(Boolean) : [];
    const dedup: string[] = [];
    parts.forEach(p => { if (!dedup.some(u => u.toLowerCase() === p.toLowerCase())) dedup.push(p); });
    const displayLocationLocal = dedup.join(', ');
    const text = `Hello, I'm interested in this property:\n${product.title}\nPrice: $${product.price}/mo\nLocation: ${displayLocationLocal || 'N/A'}\n${link}`;
    const wa = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') window.open(wa, '_blank');
  };

  const photos = product.photos && product.photos.length ? product.photos.filter(Boolean) : [product.image];
  // normalize location string to remove duplicate segments like "Mogadishu, Mogadishu"
  const rawLocation = product.location ?? product.city ?? '';
  const _locationParts = rawLocation ? rawLocation.split(',').map(s => s.trim()).filter(Boolean) : [];
  const locationParts: string[] = [];
  _locationParts.forEach(p => {
    if (!locationParts.some(u => u.toLowerCase() === p.toLowerCase())) locationParts.push(p);
  });
  const displayLocation = locationParts.join(', ');
  const districtPill = locationParts[0] ?? '';
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prev = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  const next = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % photos.length);
  };

  // reset to first slide when product or photo count changes
  useEffect(() => {
    setIndex(0);
  }, [product.id, photos.length]);

  // No autoplay: users control slides via buttons or swipe. Clean-up not needed.

  const handleTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX;
    touchStartX.current = x ?? null;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX;
    touchEndX.current = x ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = touchEndX.current ?? start;
    if (start === null || end === null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) prev(e); else next(e);
  };

  // Share menu state and handlers
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const shareUrl = (typeof window !== 'undefined' ? window.location.origin : '') + '/property/' + product.id;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: product.title,
          text: product.description ?? product.title,
          url: shareUrl,
        });
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareOpen(false);
      alert('Link copied to clipboard');
    } catch (err) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleShareClick = async () => {
    const ok = await handleNativeShare();
    if (!ok) setShareOpen((s) => !s);
  };

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!shareRef.current) return;
      if (!shareRef.current.contains(ev.target as Node)) setShareOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24">
      {/* Floating Header */}
        <div className="fixed top-0 left-0 w-full z-30 p-4 pt-12 flex justify-between items-center pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-sm border border-white/20 hover:bg-white transition-all active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
            <div className="flex items-center gap-3 pointer-events-auto">
            <div className="relative" ref={shareRef}>
              <button onClick={handleShareClick} aria-haspopup="true" aria-expanded={shareOpen} className="flex items-center justify-center w-11 h-11 rounded-full transition-all active:scale-95 text-slate-800 dark:text-white/90">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {shareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg z-50 p-2">
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent((product.title ?? '') + ' ' + shareUrl)}`, '_blank')}>Share to WhatsApp</button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title ?? '')}&url=${encodeURIComponent(shareUrl)}`, '_blank')}>Share to Twitter</button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.title ?? '')}`, '_blank')}>Share to Telegram</button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800" onClick={copyLink}>Copy link</button>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Image Carousel */}
      <div
        className="relative w-full h-[55vh] bg-gray-100 dark:bg-gray-800 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* district pill removed */}
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${product.title} - ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-linear ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none"></div>

          {photos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/40">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/40">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {photos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`w-2 h-2 rounded-full border border-white/30 transition-colors duration-150 ${i === index ? 'bg-white' : 'bg-white/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-8 bg-background-light dark:bg-background-dark rounded-t-[2rem] px-6 pt-8 flex flex-col gap-8 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="bg-primary/10 text-primary-dark dark:text-primary text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">{product.condition || 'Available'}</span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{product.category}</span>
            {/* verified badge removed per design */}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.15] tracking-tight">{product.title}</h1>
          <div className="flex items-end justify-between mt-1 flex-wrap gap-3">
            <div className="flex flex-col">
              <p className="text-[13px] text-slate-400 font-medium mb-0.5"></p>
              <h2 className="text-3xl font-black text-primary tracking-tight">$ {product.price.toLocaleString()} /mo</h2>
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-1.5">
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.8" fill="none" />
                </svg>
                <span className="text-xs font-medium">Listed just now</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block" style={{width:28, height:28}} aria-hidden>
                  <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 .001-5.001A2.5 2.5 0 0 1 12 11.5z" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{displayLocation || ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

        <div className="grid grid-cols-2 gap-3">
          <DetailBadge label="Status" value={product.condition || 'Available'} icon="event_available" />
          <DetailBadge label="Property Type" value={product.category} icon="home_work" />
          <DetailBadge label="Bedrooms" value={typeof product.bedrooms === 'number' ? String(product.bedrooms) : '—'} icon="hotel" />
          <DetailBadge label="Bathrooms" value={typeof product.bathrooms === 'number' ? String(product.bathrooms) : '—'} icon="meeting_room" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-xl">Description</h3>
          {(() => {
            const desc = product.description || '';
            const words = desc.trim().split(/\s+/).filter(Boolean);
            const limit = 100;
            const [showAll, setShowAll] = React.useState(false);
            if (!desc) {
              return <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">No detailed description provided for this property yet.</p>;
            }
            if (words.length <= limit) {
              return <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">{desc}</p>;
            }
            return (
              <div>
                <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                  {showAll ? desc : words.slice(0, limit).join(' ') + '...'}
                </p>
                <button onClick={() => setShowAll(s => !s)} className="mt-1 text-primary font-bold text-sm hover:underline self-start">
                  {showAll ? 'Show less' : 'Read more'}
                </button>
              </div>
            );
          })()}
        </div>

        {/* Location block removed as requested */}

          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl flex gap-4 border border-blue-100 dark:border-blue-900/20 mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
            <Icon name="security" className="text-[16px]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200">View safely</h4>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              Meet at the property with a friend or during daylight. Avoid paying deposits before viewing.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 p-3 pb-6 shadow-lg z-50">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => onToggleSave(product.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all active:scale-95 ${
              product.saved 
                ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900/50' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 dark:text-slate-400'
            }`}
          >
            <Icon name="favorite" filled={!!product.saved} className="text-[22px]" />
          </button>
              <button
                onClick={handleViewingRequest}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold shadow-lg shadow-emerald-500/10 transition-transform active:scale-95 border border-emerald-200 dark:border-emerald-800"
              >
                <span className="text-base">Book Viewing</span>
              </button>
        </div>
      </div>
    </div>
  );
};

const DetailBadge: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
    <div className="flex items-center gap-2 mb-2 text-slate-400">
      <Icon name={icon} className="text-[18px]" />
      <span className="text-xs font-semibold uppercase">{label}</span>
    </div>
    <p className="font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default ProductDetailView;