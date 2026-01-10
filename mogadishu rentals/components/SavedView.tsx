import React from 'react';
import { Product } from '../types';
import Icon from './Icon';
import normalizeLocation from '../utils/normalizeLocation';

interface SavedViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onToggleSave: (id: string) => void;
}

const SavedView: React.FC<SavedViewProps> = ({ products, onProductClick, onToggleSave }) => {
  return (
    <div className="pb-20 px-5 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4 mb-4">
        <h2 className="text-xl font-bold">Saved Properties</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Properties you favorited for later</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(product.id);
                }}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${product.saved ? 'text-red-500' : 'text-white'}`}
              >
                <Icon name="favorite" filled={!!product.saved} className="text-[18px]" />
              </button>
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
                {(() => {
                  const loc = normalizeLocation(product.location ?? product.city);
                  const remainder = loc.display.split(',').slice(1).join(', ').trim();
                  return (
                    <span className="truncate">
                      <span className="font-semibold mr-1">{loc.district || loc.display}</span>
                      {remainder ? <span className="text-[12px] text-text-sub-light dark:text-text-sub-dark">{`, ${remainder}`}</span> : null}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
        {!products.length && (
          <div className="col-span-2 text-center text-sm text-slate-500 py-10">No saved properties yet.</div>
        )}
      </div>
    </div>
  );
};

export default SavedView;
