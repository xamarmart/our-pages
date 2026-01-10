
import React, { useMemo, useState, useEffect } from "react";
import { MOCK_PRODUCTS } from "../constants";
import { Product } from "../types";

interface POSViewProps {
  onBack: () => void;
}

interface CartLine extends Product {
  quantity: number;
}

const TAX_RATE = 0.08; // 8% VAT similar to many POS setups

const POSView: React.FC<POSViewProps> = ({ onBack }) => {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Mobile" | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [paymentError, setPaymentError] = useState<string>("");
  const [orderCompleteMessage, setOrderCompleteMessage] = useState<string>("");

  const categories = useMemo(() => ["All", ...new Set(MOCK_PRODUCTS.map((p) => p.category))], []);
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  useEffect(() => {
    setAmountReceived(total);
  }, [total]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addCustomItem = () => {
    const title = prompt("Item name");
    const priceInput = prompt("Price (number only)");
    const price = priceInput ? Number(priceInput) : 0;
    if (!title || !price || Number.isNaN(price)) return;
    setCart((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title,
        price,
        quantity: 1,
        image: "https://picsum.photos/seed/custom/100/100",
        category: "Custom",
      },
    ]);
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeLine = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  const startPayment = () => {
    if (!cart.length) {
      setPaymentError("Add items first");
      return;
    }
    if (!paymentMethod) {
      setPaymentError("Choose a payment method");
      return;
    }
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const completeSale = () => {
    const change = paymentMethod === "Cash" ? Math.max(amountReceived - total, 0) : 0;
    const ref = `POS-${Date.now().toString().slice(-6)}`;
    setOrderCompleteMessage(`Order ${ref} completed. ${change ? `Change: KSh ${change.toLocaleString()}` : ""}`);
    setShowPaymentModal(false);
    clearCart();
    setPaymentMethod(null);
    setTimeout(() => setOrderCompleteMessage(""), 4000);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="flex-none bg-white dark:bg-surface-dark p-4 pb-2 z-10 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center">Point of Sale</h2>
          <button onClick={addCustomItem} className="size-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 transition-colors" title="Add custom item">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-[360px]">
        {/* Search */}
        <div className="px-4 py-3 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
          <div className="flex w-full items-stretch rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-center pl-3 bg-white dark:bg-surface-dark border border-r-0 border-gray-200 dark:border-white/5">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </div>
            <input
              className="w-full flex-1 bg-white dark:bg-surface-dark border border-l-0 border-gray-200 dark:border-white/5 h-12 px-3 text-base outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 shrink-0 px-5 rounded-full text-sm font-semibold border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-black border-primary"
                  : "bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="flex flex-col gap-2 p-2 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 active:scale-95 transition-transform cursor-pointer group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                <div className="absolute bottom-2 right-2 bg-white dark:bg-black/80 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">add</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold truncate leading-tight">{product.title}</p>
                <p className="text-primary text-sm font-bold mt-1">KSh {product.price.toLocaleString()}</p>
                              <p className="text-primary text-sm font-bold mt-1">$ {product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!filteredProducts.length && (
            <div className="col-span-2 text-center text-sm text-gray-500 py-6">No products match that search.</div>
          )}
        </div>
      </main>
      {/* Cart Summary */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white dark:bg-surface-dark shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-gray-100 dark:border-white/5">
        <div className="flex w-full justify-center pt-3 pb-1">
          <div className="h-1 w-12 rounded-full bg-gray-300"></div>
        </div>
        <div className="px-5 pb-5 pt-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Order</h3>
            <button onClick={clearCart} className="text-xs text-red-500 font-medium">Clear All</button>
          </div>

          <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={item.image} className="size-10 rounded-lg object-cover" alt={item.title} />
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-gray-500 text-xs">KSh {item.price.toLocaleString()}</p>
                                      <p className="text-gray-500 text-xs">$ {item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 h-8">
                    <button className="w-8 h-full flex items-center justify-center" onClick={() => changeQty(item.id, -1)}>
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button className="w-8 h-full flex items-center justify-center" onClick={() => changeQty(item.id, 1)}>
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-red-500" onClick={() => removeLine(item.id)}>
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {!cart.length && <div className="text-center text-sm text-gray-400 py-4">Cart is empty</div>}
          </div>

          <div className="border-t border-dashed border-gray-200 dark:border-white/10 my-1"></div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "Cash" as const, icon: "payments" },
              { key: "Card" as const, icon: "credit_card" },
              { key: "Mobile" as const, icon: "smartphone" },
            ].map((method) => (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border text-[10px] font-bold uppercase transition-colors ${
                  paymentMethod === method.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${paymentMethod === method.key ? "text-primary" : ""}`}>
                  {method.icon}
                </span>
                <span>{method.key}</span>
              </button>
            ))}
          </div>
          {paymentError && <div className="text-xs text-red-500 font-medium">{paymentError}</div>}
          {orderCompleteMessage && <div className="text-xs text-green-600 font-semibold">{orderCompleteMessage}</div>}
          <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
                          <span>$ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>KSh {tax.toLocaleString()}</span>
                          <span>$ {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white">
              <span>Total</span>
              <span>KSh {total.toLocaleString()}</span>
                          <span>$ {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            className="w-full h-14 bg-primary hover:bg-green-400 transition-all rounded-xl shadow-lg flex items-center justify-between px-6 group active:scale-95"
            onClick={startPayment}
          >
            <span className="text-black font-bold text-lg">Charge</span>
            <div className="flex items-center gap-2">
              <span className="text-black font-extrabold text-lg">KES {total.toLocaleString()}</span>
              <span className="material-symbols-outlined text-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>
        </div>
      </footer>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <button
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20"
              onClick={() => setShowPaymentModal(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-lg font-bold mb-4">Take Payment ({paymentMethod})</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Total Due</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">KSh {total.toLocaleString()}</span>
                            <span className="font-bold text-base text-slate-900 dark:text-white">$ {total.toLocaleString()}</span>
              </div>
              {paymentMethod === "Cash" && (
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Amount Received
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              )}
              {paymentMethod !== "Cash" && <div className="text-sm text-gray-500">Confirm payment on the terminal, then complete the sale.</div>}
              {paymentMethod === "Cash" && (
                <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <span>Change Due</span>
                  <span>KSh {Math.max(amountReceived - total, 0).toLocaleString()}</span>
                                  <span>$ {Math.max(amountReceived - total, 0).toLocaleString()}</span>
                              <span className="text-black font-extrabold text-lg">$ {total.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-primary text-black text-sm font-bold shadow-md active:scale-95 transition-transform"
                onClick={completeSale}
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSView;
