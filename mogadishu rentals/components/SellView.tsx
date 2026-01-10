import React, { useState, useRef } from "react";
import { MOGADISHU_DISTRICTS } from "../constants";
import { Product } from "../types";
import Icon from "./Icon";

interface SellViewProps {
  onBack: () => void;
  onCreate: (product: Omit<Product, "id">, files?: File[]) => Promise<void> | void;
  saving?: boolean;
}

type PhotoSlot = {
  file: File;
  preview: string;
};

const DEFAULT_PREVIEW = "https://picsum.photos/seed/p1/200/200";
const MAX_PHOTOS = 6;

type SubmitState = "idle" | "success";

const SellView: React.FC<SellViewProps> = ({ onBack, onCreate, saving }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Apartments");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [areaSqm, setAreaSqm] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState(`${MOGADISHU_DISTRICTS[0]}, Mogadishu`);
  const [errors, setErrors] = useState<string>("");
  const [photos, setPhotos] = useState<PhotoSlot[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (!selectedFiles.length) return;

    setPhotos((prev) => {
      const remaining = MAX_PHOTOS - prev.length;
      const filesToAdd = selectedFiles.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...filesToAdd];
    });

    e.target.value = ""; // allow re-selecting same file later
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const clone = [...prev];
      const [removed] = clone.splice(index, 1);
      if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
      return clone;
    });
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Apartments");
    setDescription("");
    setPrice(0);
    setBedrooms(1);
    setBathrooms(1);
    setAreaSqm(undefined);
    setLocation(`${MOGADISHU_DISTRICTS[0]}, Mogadishu`);
    setPhotos([]);
    setErrors("");
  };

  const handleSubmit = async () => {
    const issues: string[] = [];
    const digitRegex = /\d/;

    if (!title.trim()) issues.push("Title is required");
    if (digitRegex.test(title)) issues.push("Title must be text only (no numbers)");
    if (!price) issues.push("Rent is required");
    if (description && digitRegex.test(description)) issues.push("Description must be text only (no numbers)");

    if (issues.length) {
      setErrors(issues.join("; "));
      return;
    }

    setErrors("");
    setSubmitState("idle");

    const primaryPreview = photos[0]?.preview ?? DEFAULT_PREVIEW;
    const filesToUpload = photos.map((p) => p.file);

    const newProduct: Omit<Product, "id"> = {
      title,
      category,
      description: description || "No description provided.",
      price,
      location,
      address: location,
      city: "Mogadishu",
      state: undefined,
      bedrooms,
      bathrooms,
      areaSqft: areaSqm, // storing m2 in existing numeric field
      image: primaryPreview,
      verified: true,
    };

    await onCreate(newProduct, filesToUpload);
    setSubmitState("success");
    resetForm();
    setTimeout(() => setSubmitState("idle"), 1500);
  };

  const buttonLabel = saving ? "Saving..." : submitState === "success" ? "Success" : "Publish Rental";
  const buttonClasses = submitState === "success" ? "bg-green-500 text-black" : "bg-slate-900 dark:bg-primary text-white dark:text-black";

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h2 className="text-base font-bold tracking-tight text-center">New Rental</h2>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 sm:p-6 gap-8">
        {/* Photos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary-dark text-xs font-bold">1</span>
              Photos
            </h3>
            <span className="text-xs font-medium text-slate-400">Add up to {MAX_PHOTOS}</span>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleAddPhotos}
          />

          <div className="grid grid-cols-3 gap-3">
            {photos.map((p, idx) => (
              <div key={idx} className="relative group aspect-square">
                <div className={`w-full h-full rounded-2xl overflow-hidden border ${idx === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-white/10'} bg-slate-100`}>
                  <img src={p.preview} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-bold text-center py-1 backdrop-blur-sm">
                      Cover Photo
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all scale-90 hover:scale-100"
                  aria-label="Remove photo"
                >
                  <Icon name="close" className="text-base" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="add_photo_alternate" className="text-2xl" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-70 group-hover:opacity-100">Add Photo</span>
              </button>
            )}
          </div>
        </section>

        {/* Details */}
        <section className="flex flex-col gap-5">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary-dark text-xs font-bold">2</span>
            Details
          </h3>
          <div className="flex flex-col gap-4">
            <InputField label="Title" icon="loyalty" placeholder="e.g. Modern 2BR in Hodan" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Property Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Apartments', 'Houses', 'Commercial', 'Rooms'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                      category === cat ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    <Icon 
                      name={cat === 'Apartments' ? 'apartment' : cat === 'Houses' ? 'home' : cat === 'Commercial' ? 'store' : 'hotel'} 
                      className="text-2xl" 
                    />
                    <span className="text-xs font-bold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Beds" value={bedrooms} onChange={(v) => setBedrooms(v)} min={0} />
              <NumberField label="Baths" value={bathrooms} onChange={(v) => setBathrooms(v)} min={0} />
              <NumberField label="Area (m2)" value={areaSqm} onChange={(v) => setAreaSqm(Number.isNaN(v) ? undefined : v)} min={0} allowUndefined />
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Description</label>
              <textarea
                className="w-full rounded-2xl bg-gray-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-slate-900 px-5 py-4 text-base font-medium placeholder:text-slate-400 transition-all shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none outline-none"
                rows={4}
                placeholder="Describe the property (bedrooms, bathrooms, amenities, nearby landmarks...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-right mt-1"><span className="text-[10px] font-bold text-slate-400 tracking-wide">{description.length}/2000</span></div>
            </div>
          </div>
        </section>

        {/* Rent & Location */}
        <section className="flex flex-col gap-6 p-1">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
            Rent & Location
          </h3>
          
          <div className="bg-white dark:bg-white/5 rounded-3xl p-1 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                <span className="text-slate-400 font-bold text-lg">$</span>
                <div className="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
              </div>
              <input
                className="w-full bg-transparent border-none focus:ring-0 pl-16 pr-20 py-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-200 transition-all text-center"
                placeholder="0"
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">/ month</span>
            </div>
          </div>

          <div className="space-y-4">
            <SelectField
              label="District"
              icon="location_on"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={MOGADISHU_DISTRICTS.map((dist) => `${dist}, Mogadishu`)}
            />
          </div>

          {errors && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-3 animate-shake">
              <Icon name="error" />
              {errors}
            </div>
          )}
          
          <div className="mt-4 pb-8">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`w-full ${buttonClasses} font-bold py-4 rounded-2xl text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0`}
            >
              <span className="flex items-center justify-center gap-2">
                {saving && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {buttonLabel}
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const InputField: React.FC<{ label: string; icon: string; placeholder: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement> }> = ({ label, icon, placeholder, value, onChange }) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
        <Icon name={icon} className="text-xl" />
      </div>
      <input
        className="w-full rounded-2xl bg-gray-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-slate-900 pl-12 pr-4 py-4 text-base font-medium placeholder:text-slate-400 transition-all shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const NumberField: React.FC<{ label: string; value: number | undefined; onChange: (v: number) => void; min?: number; allowUndefined?: boolean }> = ({ label, value, onChange, min = 0, allowUndefined }) => (
  <div className="group">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <input
      className="w-full rounded-2xl bg-gray-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-slate-900 px-4 py-3 text-sm font-medium placeholder:text-slate-400 transition-all shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
      type="number"
      min={min}
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        if (val === '' && allowUndefined) onChange(NaN);
        else onChange(Number(val));
      }}
    />
  </div>
);

const SelectField: React.FC<{ label: string; icon: string; options: string[]; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement> }> = ({ label, icon, options, value, onChange }) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">{icon}</span>
      <select
        className="w-full appearance-none rounded-2xl bg-gray-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-slate-900 pl-12 pr-10 py-4 text-base font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none cursor-pointer"
        value={value}
        onChange={onChange}
      >
        <option disabled value="">
          Select {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">arrow_drop_down</span>
    </div>
  </div>
);

const CounterRow: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-2">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
    <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors disabled:opacity-50"
        disabled={value <= 0}
      >
        <span className="material-symbols-outlined text-lg">remove</span>
      </button>
      <span className="font-bold w-6 text-center text-slate-900 dark:text-white">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-lg">add</span>
      </button>
    </div>
  </div>
);

export default SellView;