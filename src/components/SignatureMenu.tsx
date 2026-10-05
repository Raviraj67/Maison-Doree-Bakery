import React, { useState } from 'react';
import { DAILY_MENU_ITEMS } from '../data/bakeryData';
import { DailyMenuItem } from '../types/bakery';
import { ShoppingBag, Check } from 'lucide-react';

interface SignatureMenuProps {
  onAddDailyItem: (
    item: DailyMenuItem,
    sliceOption?: 'whole' | 'thick_sliced' | 'thin_sliced'
  ) => void;
}

export const SignatureMenu: React.FC<SignatureMenuProps> = ({ onAddDailyItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [slicingPreferences, setSlicingPreferences] = useState<Record<string, 'whole' | 'thick_sliced' | 'thin_sliced'>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Daily Bakes' },
    { id: 'hearth_breads', label: 'Sourdough & Hearth Breads' },
    { id: 'morning_viennoiserie', label: 'Morning Viennoiserie' },
    { id: 'patisserie_desserts', label: 'Patisserie & Tarts' },
    { id: 'savory', label: 'Savory & Focaccia' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? DAILY_MENU_ITEMS
      : DAILY_MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleAddItem = (item: DailyMenuItem) => {
    const sliceOption = item.category === 'hearth_breads' ? slicingPreferences[item.id] || 'whole' : undefined;
    onAddDailyItem(item, sliceOption);
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  return (
    <section id="daily-bakes" className="py-16 md:py-24 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold mb-2">
              Fresh From the Hearth
            </p>
            <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-[#231f1d] tracking-tight">
              Daily Bakes & Patisserie
            </h2>
            <p className="mt-2 text-sm text-[#61554a] max-w-xl">
              Pulled from our stone hearth ovens every morning at dawn. Reserve your favorites for counter pickup or same-day delivery.
            </p>
          </div>

          {/* Interactive Category Filter Controls (functional buttons, not pills) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#ede6dc] rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#231f1d] shadow-xs'
                    : 'text-[#695d52] hover:text-[#231f1d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 3-column desktop layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isBread = item.category === 'hearth_breads';
            const currentSlice = slicingPreferences[item.id] || 'whole';
            const wasJustAdded = recentlyAddedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Product Image Slot with Fallback Container */}
                <div className="relative aspect-4/3 bg-[#f3ede4] overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Subtle Text Tag (Section 2B: max 1 subtle text tag, no badge spam) */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-[#231f1d]/85 text-[#fcfaf7] text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-[#7d6e60] mb-1">
                      <span>{item.preparationTimeNote}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.dietary.join(', ')}</span>
                    </div>

                    <h3 className="font-serif-display text-xl font-bold text-[#231f1d]">
                      {item.name}
                    </h3>
                    {item.frenchSubtitle && (
                      <p className="text-xs italic text-[#8a7258] mt-0.5">
                        {item.frenchSubtitle}
                      </p>
                    )}

                    <p className="text-xs text-[#635547] mt-2.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Slicing Options for Hearth Breads */}
                  {isBread && (
                    <div className="mt-4 pt-3 border-t border-[#f2eae1] text-xs">
                      <span className="text-[#736353] font-medium block mb-1.5">
                        Slicing Preference
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'whole', label: 'Whole Boule' },
                          { id: 'thick_sliced', label: 'Thick (18mm)' },
                          { id: 'thin_sliced', label: 'Toast (12mm)' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSlicingPreferences({
                                ...slicingPreferences,
                                [item.id]: opt.id as any,
                              })
                            }
                            className={`py-1 text-[11px] rounded-md border text-center transition-colors ${
                              currentSlice === opt.id
                                ? 'border-[#231f1d] bg-[#fbf8f3] text-[#231f1d] font-bold'
                                : 'border-[#e2d5c5] text-[#695d52]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Buy Action */}
                  <div className="mt-5 pt-3 border-t border-[#f2eae1] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#7d6e60] uppercase tracking-wider">
                        Price
                      </div>
                      <div className="text-lg font-serif-display font-bold text-[#231f1d] tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddItem(item)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs ${
                        wasJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#231f1d] hover:bg-[#3d342e] text-[#faf6f0]'
                      }`}
                    >
                      {wasJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
