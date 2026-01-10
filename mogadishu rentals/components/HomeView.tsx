import React, { useMemo, useState } from 'react';
import { CATEGORIES, MOGADISHU_DISTRICTS } from '../constants';
import Icon from './Icon';
import normalizeLocation from '../utils/normalizeLocation';
import { Product } from '../types';

const PRICE_FILTERS = [
  { label: 'Any price', value: 'all' },
  { label: 'Under $500', value: 'under500' },
  { label: '$500 - $1,000', value: '500-1000' },
  { label: '$1,000 - $2,000', value: '1000-2000' },
  { label: 'Over $2,000', value: 'over2000' },
];

interface HomeViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onToggleSave: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ products, onProductClick, onToggleSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLocation, setActiveLocation] = useState<string>('All');
  const [activePrice, setActivePrice] = useState<string>('all');

  const priceMatches = (price: number) => {
    switch (activePrice) {
      case 'under500':
        return price < 500;
      case '500-1000':
        return price >= 500 && price <= 1000;
      case '1000-2000':
        return price > 1000 && price <= 2000;
      case 'over2000':
        return price > 2000;
      default:
        return true;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const loc = activeLocation.toLowerCase();
      const matchesLocation =
        activeLocation === 'All' ||
        (p.location ?? '').toLowerCase().includes(loc) ||
        (p.address ?? '').toLowerCase().includes(loc);
      const matchesPrice = priceMatches(p.price);
      return matchesCategory && matchesSearch && matchesLocation && matchesPrice;
    });
  }, [products, activeCategory, activeLocation, activePrice, searchTerm]);

  // pagination for load more: start with 20
  const [visibleCount, setVisibleCount] = useState(20);

  // reset visible count when filters/search change
  React.useEffect(() => {
    setVisibleCount(20);
  }, [filteredProducts]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-all">
        <div className="px-5 pt-4 pb-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-medium text-text-main-light dark:text-text-main-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm"
              placeholder="search property"
              type="text"
            />
          </div>
        </div>
      </div>

      <main className="pt-4">
        {/* Categories */}
        <div className="pl-5 mb-8">
          <div className="flex items-center justify-between pr-5 mb-4">
            <h2 className="text-base font-bold">Rental Categories</h2>
            <div className="flex items-center gap-2">
                  <span className="text-[20px] text-text-sub-light">$</span>
              <select
                className="pl-3 pr-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                value={activePrice}
                onChange={(e) => setActivePrice(e.target.value)}
              >
                {PRICE_FILTERS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pr-5 pb-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center gap-2 min-w-[76px] group ${activeCategory === 'All' ? 'text-primary' : ''}`}
            >
              <div className={`w-[72px] h-[72px] rounded-2xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden ${activeCategory === 'All' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5'}`}>
                <span className="relative z-10">
                  <Icon name="location_on" className="w-8 h-8 text-primary" />
                </span>
              </div>
              <span className="text-xs font-semibold text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors">All</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`flex flex-col items-center gap-2 min-w-[76px] group ${activeCategory === cat.name ? 'text-primary' : ''}`}>
                <div className={`w-[72px] h-[72px] rounded-2xl bg-white dark:bg-surface-dark shadow-sm border flex items-center justify-center group-active:scale-95 transition-all duration-300 relative overflow-hidden ${activeCategory === cat.name ? 'border-primary bg-primary/10' : 'border-gray-100 dark:border-white/5'}`}>
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                  <span className="relative z-10">
                    <Icon name={cat.icon} className="w-8 h-8 text-primary" />
                  </span>
                </div>
                <span className="text-xs font-semibold text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Available Rentals</h2>
            <div className="flex items-center gap-2">
              <select
                className="pl-3 pr-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                value={activeLocation}
                onChange={(e) => setActiveLocation(e.target.value)}
              >
                <option value="All">All locations</option>
                {MOGADISHU_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onToggleSave={() => onToggleSave(product.id)}
              />
            ))}
            {!filteredProducts.length && (
              <div className="col-span-2 text-center text-sm text-slate-500 py-8">No rentals match your filters.</div>
            )}
          </div>
          <div className="mt-8 flex justify-center pb-8">
            {filteredProducts.length > visibleCount ? (
              <button
                onClick={() => setVisibleCount(c => c + 20)}
                className="px-8 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shadow-sm"
              >
                Load More Rentals
              </button>
            ) : (
              filteredProducts.length > 0 && (
                <div className="text-sm text-slate-500">No more rentals.</div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onClick: () => void; onToggleSave: () => void }> = ({ product, onClick, onToggleSave }) => (
  <div onClick={onClick} className="group bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-soft dark:shadow-none dark:border dark:border-white/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
        style={{ backgroundImage: `url(${product.image})` }}
      ></div>
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${product.saved ? 'text-red-500' : 'text-text-sub-light dark:text-white hover:text-red-500'}`}
          >
            <Icon name="favorite" filled={!!product.saved} className={`text-[18px] ${product.saved ? 'text-red-500' : ''}`} />
          </button>
        </div>
        {/* verified badge removed from card */}
    </div>
    <div className="p-3.5">
      <h3 className="text-sm font-semibold line-clamp-1 mb-1.5">{product.title}</h3>
      <p className="text-primary font-bold text-base mb-2">$ {product.price.toLocaleString()} /mo</p>
            <div className="flex items-center gap-1 text-text-sub-light dark:text-text-sub-dark text-xs opacity-80">
        <span className="inline-block" style={{width:16, height:16}} aria-hidden>
          <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 .001-5.001A2.5 2.5 0 0 1 12 11.5z" fill="currentColor" />
          </svg>
        </span>
        <span className="truncate">{normalizeLocation(product.location ?? product.city).display}</span>
      </div>
    </div>
  </div>
);

export default HomeView;