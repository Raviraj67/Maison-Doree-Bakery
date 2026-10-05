import React, { useState, useMemo } from 'react';
import { PASTRIES_FOR_BOX } from '../data/bakeryData';
import { CustomPastryBox, PastryItem } from '../types/bakery';
import { Plus, Minus, Check, Gift, ShoppingBag, Sparkles } from 'lucide-react';
import pastryBoxImage from '../assets/images/pastry_viennoiserie_box_1791180939556.jpg';

interface CustomPastryBoxBuilderProps {
  onAddBoxToCart: (box: CustomPastryBox, summary: { title: string; subtitle: string }) => void;
}

export const CustomPastryBoxBuilder: React.FC<CustomPastryBoxBuilderProps> = ({ onAddBoxToCart }) => {
  const [boxSize, setBoxSize] = useState<6 | 12>(6);
  // pastryId -> quantity map
  const [itemsMap, setItemsMap] = useState<Record<string, number>>({
    pst_almond_croissant: 2,
    pst_pain_au_chocolat: 2,
    pst_kouign_amann: 1,
    pst_cardamom_bun: 1,
  });
  const [boxStyle, setBoxStyle] = useState<'classic_bakery' | 'gift_ribbon'>('classic_bakery');
  const [giftNote, setGiftNote] = useState<string>('');
  const [toastAdded, setToastAdded] = useState<boolean>(false);

  // Total items currently selected in the box
  const totalCount = useMemo(() => {
    return Object.values(itemsMap).reduce((sum, q) => sum + q, 0);
  }, [itemsMap]);

  const remainingSlots = boxSize - totalCount;

  // Box Pricing: Discounted bundle pricing
  // 6-box fixed tier = $34 (savings vs single items $37)
  // 12-box fixed tier = $64 (savings vs single items $74)
  const baseBoxPrice = boxSize === 6 ? 34.0 : 64.0;
  const ribbonFee = boxStyle === 'gift_ribbon' ? 4.5 : 0;
  const finalPrice = baseBoxPrice + ribbonFee;

  const updateQuantity = (pastryId: string, delta: number) => {
    const current = itemsMap[pastryId] || 0;
    const next = current + delta;
    if (next < 0) return;
    if (delta > 0 && totalCount >= boxSize) return;

    setItemsMap((prev) => {
      const copy = { ...prev };
      if (next === 0) {
        delete copy[pastryId];
      } else {
        copy[pastryId] = next;
      }
      return copy;
    });
  };

  const handleSelectBoxSize = (size: 6 | 12) => {
    setBoxSize(size);
    // If switching down from 12 to 6, clamp selections
    if (size === 6 && totalCount > 6) {
      setItemsMap({
        pst_almond_croissant: 2,
        pst_pain_au_chocolat: 2,
        pst_kouign_amann: 1,
        pst_cardamom_bun: 1,
      });
    }
  };

  const handleAddBox = () => {
    if (totalCount !== boxSize) return;

    const boxOrder: CustomPastryBox = {
      size: boxSize,
      items: Object.entries(itemsMap).map(([pastryId, quantity]) => ({ pastryId, quantity })),
      calculatedPrice: finalPrice,
      boxStyle,
      customGiftNote: giftNote,
    };

    const pastryNames = Object.entries(itemsMap)
      .map(([id, qty]) => {
        const item = PASTRIES_FOR_BOX.find((p) => p.id === id);
        return `${qty}x ${item?.name.split(' ')[0] || 'Pastry'}`;
      })
      .join(', ');

    onAddBoxToCart(boxOrder, {
      title: `${boxSize === 6 ? 'Half-Dozen' : 'Artisan Baker’s Dozen'} Pastry Box`,
      subtitle: `${pastryNames}${boxStyle === 'gift_ribbon' ? ' · Wax Seal & Ribbon' : ''}`,
    });

    setToastAdded(true);
    setTimeout(() => setToastAdded(false), 3000);
  };

  return (
    <section id="pastry-box" className="py-16 md:py-24 bg-[#f6f2ec] border-t border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold mb-2">
            Morning Viennoiserie Curation
          </p>
          <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-[#231f1d] tracking-tight">
            Build a Custom Pastry Box
          </h2>
          <p className="mt-3 text-base text-[#61554a] leading-relaxed">
            Curate your personal dozen or half-dozen of warm laminated croissants, brioches, and seasonal tartlets.
            Packed in our embossed kraft bakery box with unbleached parchment and bakers' twine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Assortment Tray & Status (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-[#ebdcd0] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#f0e6dc]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8a7258]">
                    Your Box Assortment
                  </span>
                  <h3 className="font-serif-display text-xl font-bold text-[#231f1d]">
                    {boxSize === 6 ? 'Half-Dozen Box (6 Pieces)' : 'Bakers Dozen Box (12 Pieces)'}
                  </h3>
                </div>

                {/* Slot counter indicator */}
                <div
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    remainingSlots === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {remainingSlots === 0 ? 'Box Complete (Ready)' : `${remainingSlots} slots remaining`}
                </div>
              </div>

              {/* Visual Box Slot Representation */}
              <div className="my-6">
                <div
                  className={`grid gap-2.5 p-4 bg-[#fbf9f5] border-2 border-dashed rounded-xl ${
                    remainingSlots === 0 ? 'border-emerald-300' : 'border-[#d9cab9]'
                  } ${boxSize === 6 ? 'grid-cols-3' : 'grid-cols-4'}`}
                >
                  {Array.from({ length: boxSize }).map((_, index) => {
                    // Flatten itemsMap into array
                    const flattened: PastryItem[] = [];
                    Object.entries(itemsMap).forEach(([id, qty]) => {
                      const item = PASTRIES_FOR_BOX.find((p) => p.id === id);
                      if (item) {
                        for (let i = 0; i < qty; i++) {
                          flattened.push(item);
                        }
                      }
                    });

                    const currentItem = flattened[index];

                    return (
                      <div
                        key={`slot-${index}`}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 text-center transition-all ${
                          currentItem
                            ? 'bg-white border border-[#ddcfbf] shadow-xs'
                            : 'bg-[#f4efe8]/60 border border-dashed border-[#dcd0c2] text-[#998b7e]'
                        }`}
                      >
                        {currentItem ? (
                          <>
                            <span className="text-lg">🥐</span>
                            <span className="text-[11px] font-semibold text-[#29221d] line-clamp-2 mt-1 leading-tight">
                              {currentItem.name.split(' ')[0]}
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] font-medium">Slot {index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box Packaging & Ribbon Choice */}
              <div className="space-y-3 pt-3 border-t border-[#f0e6dc] text-xs">
                <span className="font-semibold text-[#5c4e40] block">Packaging & Presentation</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBoxStyle('classic_bakery')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      boxStyle === 'classic_bakery'
                        ? 'border-[#2d241d] bg-[#fbf8f3] font-semibold text-[#2d241d]'
                        : 'border-[#ebdcd0] text-[#695c4f]'
                    }`}
                  >
                    <div>Classic Craft Box</div>
                    <div className="text-[11px] text-[#857668]">Parchment & Twine</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoxStyle('gift_ribbon')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      boxStyle === 'gift_ribbon'
                        ? 'border-[#2d241d] bg-[#fbf8f3] font-semibold text-[#2d241d]'
                        : 'border-[#ebdcd0] text-[#695c4f]'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Gift Ribbon</span>
                      <span className="text-[#876747] font-semibold tabular-nums">+$4.50</span>
                    </div>
                    <div className="text-[11px] text-[#857668]">Wax Seal & French Ribbon</div>
                  </button>
                </div>

                {boxStyle === 'gift_ribbon' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-[#5c4e40] mb-1">
                      Gift Note Card Message (Handwritten)
                    </label>
                    <input
                      type="text"
                      maxLength={70}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="e.g. Wishing you the warmest weekend! With love, Claire"
                      className="w-full px-3 py-2 border border-[#d6c7b5] rounded-md text-xs bg-white text-[#29221d]"
                    />
                  </div>
                )}
              </div>

              {/* Price & Add Button */}
              <div className="pt-5 mt-4 border-t border-[#f0e6dc] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#736456]">Box Total</div>
                  <div className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                    ${finalPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={totalCount !== boxSize}
                  onClick={handleAddBox}
                  className={`px-6 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs ${
                    totalCount === boxSize
                      ? 'bg-[#231f1d] hover:bg-[#39322e] text-[#faf6f0]'
                      : 'bg-[#d6cbbe] text-[#786b5e] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {totalCount === boxSize ? 'Add Box to Order' : `Select ${remainingSlots} more`}
                  </span>
                </button>
              </div>

              {toastAdded && (
                <div className="mt-3 p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Custom pastry box added to your bag!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Size Toggle & Pastry Assortment Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Box Size Toggle Bar */}
            <div className="flex items-center justify-between p-2 bg-white border border-[#ebdcd0] rounded-xl">
              <span className="text-xs font-semibold text-[#66574a] pl-2">Select Box Volume:</span>
              <div className="inline-flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectBoxSize(6)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    boxSize === 6
                      ? 'bg-[#2d241d] text-[#faf6f0] shadow-xs'
                      : 'text-[#6e6052] hover:text-[#2d241d]'
                  }`}
                >
                  Half-Dozen (6 Pastries) — $34
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBoxSize(12)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    boxSize === 12
                      ? 'bg-[#2d241d] text-[#faf6f0] shadow-xs'
                      : 'text-[#6e6052] hover:text-[#2d241d]'
                  }`}
                >
                  Artisan Dozen (12 Pastries) — $64
                </button>
              </div>
            </div>

            {/* Pastry Grid Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PASTRIES_FOR_BOX.map((pastry) => {
                const qty = itemsMap[pastry.id] || 0;
                const canAdd = totalCount < boxSize;

                return (
                  <div
                    key={pastry.id}
                    className="p-4 bg-white border border-[#ebdcd0] rounded-xl flex flex-col justify-between hover:border-[#bda893] transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#231f1d]">{pastry.name}</h4>
                          {pastry.frenchName && (
                            <p className="text-[11px] italic text-[#8a7663]">{pastry.frenchName}</p>
                          )}
                        </div>
                        <span className="text-xs text-[#736353] tabular-nums font-semibold">
                          ${pastry.singlePrice.toFixed(2)}/ea
                        </span>
                      </div>
                      <p className="text-xs text-[#6e5f52] mt-2 leading-relaxed">
                        {pastry.description}
                      </p>
                    </div>

                    {/* Stepper Controls */}
                    <div className="mt-4 pt-3 border-t border-[#f2eae1] flex items-center justify-between">
                      <span className="text-xs font-medium text-[#7a6b5e]">Quantity in Box</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(pastry.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-md border border-[#d6c7b5] flex items-center justify-center text-[#2d241d] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f6f2ec] transition-colors"
                          aria-label={`Decrease quantity of ${pastry.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#231f1d] tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(pastry.id, 1)}
                          disabled={!canAdd}
                          className="w-7 h-7 rounded-md border border-[#d6c7b5] flex items-center justify-center text-[#2d241d] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f6f2ec] transition-colors"
                          aria-label={`Increase quantity of ${pastry.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
