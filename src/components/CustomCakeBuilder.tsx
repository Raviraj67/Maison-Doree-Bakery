import React, { useState, useMemo } from 'react';
import {
  TIER_OPTIONS,
  FLAVOR_OPTIONS,
  FILLING_OPTIONS,
  FINISH_OPTIONS,
  COLOR_PALETTES,
  TOPPING_OPTIONS,
} from '../data/bakeryData';
import {
  CustomCakeOrder,
  TierOption,
  FlavorOption,
  FillingOption,
  FinishOption,
  ColorPalette,
  ToppingOption,
  DietaryOption,
} from '../types/bakery';
import { CustomCakeVisualizer } from './CustomCakeVisualizer';
import { Calendar, Clock, Check, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

interface CustomCakeBuilderProps {
  onAddToCart: (order: CustomCakeOrder, visualSummary: { title: string; subtitle: string }) => void;
}

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({ onAddToCart }) => {
  // Config state
  const [selectedTierId, setSelectedTierId] = useState<string>(TIER_OPTIONS[1].id); // 8" classic default
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>(FLAVOR_OPTIONS[0].id);
  const [selectedFillingId, setSelectedFillingId] = useState<string>(FILLING_OPTIONS[0].id);
  const [selectedFinishId, setSelectedFinishId] = useState<string>(FINISH_OPTIONS[0].id);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(COLOR_PALETTES[0].id);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>(['topping_gold_leaf']);
  const [pipingMessage, setPipingMessage] = useState<string>('Happy Birthday!');
  const [pipingStyle, setPipingStyle] = useState<'script' | 'modern'>('script');
  const [dietary, setDietary] = useState<DietaryOption>('standard');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Date calculation: minimum 48 hours notice
  const minDateString = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // 48 hours minimum
    return d.toISOString().split('T')[0];
  }, []);

  const [pickupDate, setPickupDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [pickupTime, setPickupTime] = useState<string>('10:00 AM - 12:00 PM');
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Active Objects
  const selectedTier = TIER_OPTIONS.find((t) => t.id === selectedTierId) || TIER_OPTIONS[0];
  const selectedFlavor = FLAVOR_OPTIONS.find((f) => f.id === selectedFlavorId) || FLAVOR_OPTIONS[0];
  const selectedFilling = FILLING_OPTIONS.find((f) => f.id === selectedFillingId) || FILLING_OPTIONS[0];
  const selectedFinish = FINISH_OPTIONS.find((f) => f.id === selectedFinishId) || FINISH_OPTIONS[0];
  const selectedPalette = COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];
  const selectedToppings = TOPPING_OPTIONS.filter((t) => selectedToppingIds.includes(t.id));

  // Price Calculation
  const totalPrice = useMemo(() => {
    let sum = selectedTier.basePrice;
    sum += selectedFlavor.priceDelta;
    sum += selectedFilling.priceDelta;
    sum += selectedFinish.priceDelta;
    selectedToppings.forEach((t) => {
      sum += t.price;
    });
    if (dietary === 'gluten_friendly') sum += 15;
    if (dietary === 'vegan') sum += 18;
    return sum;
  }, [selectedTier, selectedFlavor, selectedFilling, selectedFinish, selectedToppings, dietary]);

  const toggleTopping = (toppingId: string) => {
    if (selectedToppingIds.includes(toppingId)) {
      setSelectedToppingIds(selectedToppingIds.filter((id) => id !== toppingId));
    } else {
      setSelectedToppingIds([...selectedToppingIds, toppingId]);
    }
  };

  const handleAddCustomCake = () => {
    const cakeOrder: CustomCakeOrder = {
      tierId: selectedTier.id,
      spongeId: selectedFlavor.id,
      fillingId: selectedFilling.id,
      finishId: selectedFinish.id,
      paletteId: selectedPalette.id,
      toppingIds: selectedToppingIds,
      pipingMessage,
      pipingStyle,
      pipingColor: selectedPalette.id === 'palette_midnight' ? '#eedbc5' : '#4d372c',
      dietary,
      fulfillmentType,
      pickupDate,
      pickupTime,
      specialInstructions,
      calculatedPrice: totalPrice,
    };

    const visualSummary = {
      title: `Custom ${selectedTier.name}`,
      subtitle: `${selectedFlavor.name} · ${selectedFilling.name} · ${selectedPalette.name}`,
    };

    onAddToCart(cakeOrder, visualSummary);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <section id="custom-cakes" className="py-16 md:py-24 bg-[#faf7f2] border-t border-[#ede5d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold mb-2">
            The Bespoke Atelier
          </p>
          <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-[#231f1d] tracking-tight">
            Design Your Celebration Cake
          </h2>
          <p className="mt-3 text-base text-[#61554a] leading-relaxed">
            Every celebration cake is baked to order from scratch using organic heritage grains, cultured butter,
            and natural botanicals. Select your silhouette, bespoke flavor pairings, and live piped message.
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Visualizer & Sticky Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <CustomCakeVisualizer
              selectedTier={selectedTier}
              selectedFlavor={selectedFlavor}
              selectedFilling={selectedFilling}
              selectedFinish={selectedFinish}
              selectedPalette={selectedPalette}
              selectedToppings={selectedToppings}
              pipingMessage={pipingMessage}
              pipingStyle={pipingStyle}
              dietary={dietary}
              totalPrice={totalPrice}
            />

            {/* Atelier Specification Summary Card */}
            <div className="bg-[#f5eee3] border border-[#e5d9c8] rounded-xl p-5 text-sm text-[#4d4237] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2d5c2]">
                <span className="font-serif-display text-lg font-bold text-[#231f1d]">
                  Bespoke Recipe Summary
                </span>
                <span className="font-mono text-xs text-[#706050] tracking-wider uppercase">
                  48h Notice Required
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#756658]">Silhouette & Size:</span>
                  <span className="font-semibold text-[#29221d] text-right">
                    {selectedTier.name} ({selectedTier.servingsDesc})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756658]">Sponge:</span>
                  <span className="font-semibold text-[#29221d] text-right">{selectedFlavor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756658]">Confit / Filling:</span>
                  <span className="font-semibold text-[#29221d] text-right">{selectedFilling.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756658]">Exterior Finish:</span>
                  <span className="font-semibold text-[#29221d] text-right">{selectedFinish.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756658]">Palette:</span>
                  <span className="font-semibold text-[#29221d] text-right">{selectedPalette.name}</span>
                </div>
                {selectedToppings.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#756658]">Accents:</span>
                    <span className="font-semibold text-[#29221d] text-right">
                      {selectedToppings.map((t) => t.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                )}
                {pipingMessage && (
                  <div className="flex justify-between">
                    <span className="text-[#756658]">Hand Inscription:</span>
                    <span className="font-semibold text-[#29221d] italic truncate max-w-[200px]">
                      "{pipingMessage}"
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#e2d5c2] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#756658]">Estimated Total</div>
                  <div className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomCake}
                  className="px-5 py-2.5 bg-[#2b241e] text-[#faf6f0] text-xs font-semibold rounded-lg hover:bg-[#3f352c] transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Cake to Bag</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Bespoke cake added to your order bag! Open bag to checkout.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customizer Accordion / Step Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-[#ebdcd0] rounded-2xl p-6 md:p-8 shadow-xs">
            {/* Step 1: Size & Tiers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e6dc]">
                <div>
                  <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                    01. Tier & Portion Scale
                  </span>
                  <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                    Choose Cake Silhouette
                  </h3>
                </div>
                <span className="text-xs text-[#7a6b5e]">
                  {selectedTier.servingsDesc}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {TIER_OPTIONS.map((tier) => {
                  const isSelected = tier.id === selectedTierId;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2d241d] bg-[#fbf8f3] ring-1 ring-[#2d241d]'
                          : 'border-[#ebdcd0] hover:border-[#bda893] bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#231f1d]">{tier.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#2d241d]" />}
                        </div>
                        <p className="text-xs text-[#706254] mt-1">{tier.diameterDesc}</p>
                        <p className="text-xs font-medium text-[#876747] mt-0.5">{tier.servingsDesc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#f0e6dc] text-xs font-semibold text-[#29221d] tabular-nums">
                        ${tier.basePrice} base
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Sponge Flavor */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  02. Sponge Cake Base
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Select Flavor Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FLAVOR_OPTIONS.map((flavor) => {
                  const isSelected = flavor.id === selectedFlavorId;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setSelectedFlavorId(flavor.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#2d241d] bg-[#fbf8f3] ring-1 ring-[#2d241d]'
                          : 'border-[#ebdcd0] hover:border-[#bda893] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: flavor.spongeColor }}
                          />
                          <span className="text-xs font-bold text-[#231f1d]">{flavor.name}</span>
                        </div>
                        {flavor.priceDelta > 0 && (
                          <span className="text-xs text-[#876747] font-semibold tabular-nums">
                            +${flavor.priceDelta}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6e5f52] mt-1.5 leading-relaxed">
                        {flavor.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Confit & Filling */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  03. Gourmet Layer Filling
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Choose Layer Confit & Cream
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FILLING_OPTIONS.map((filling) => {
                  const isSelected = filling.id === selectedFillingId;
                  return (
                    <button
                      key={filling.id}
                      type="button"
                      onClick={() => setSelectedFillingId(filling.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#2d241d] bg-[#fbf8f3] ring-1 ring-[#2d241d]'
                          : 'border-[#ebdcd0] hover:border-[#bda893] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: filling.fillingColor }}
                          />
                          <span className="text-xs font-bold text-[#231f1d]">{filling.name}</span>
                        </div>
                        {filling.priceDelta > 0 && (
                          <span className="text-xs text-[#876747] font-semibold tabular-nums">
                            +${filling.priceDelta}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6e5f52] mt-1.5 leading-relaxed">
                        {filling.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Finish & Color Palette */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  04. Buttercream Finish & Palette
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Exterior Texture & Palette
                </h3>
              </div>

              {/* Finish texture selector */}
              <div>
                <label className="block text-xs font-medium text-[#5c4e40] mb-2">
                  Texture Finish
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {FINISH_OPTIONS.map((finish) => {
                    const isSelected = finish.id === selectedFinishId;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinishId(finish.id)}
                        className={`p-2.5 rounded-lg text-left border text-xs transition-colors ${
                          isSelected
                            ? 'border-[#2d241d] bg-[#fbf8f3] font-semibold text-[#231f1d]'
                            : 'border-[#ebdcd0] text-[#635547] hover:border-[#bda893]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{finish.name}</span>
                          {finish.priceDelta > 0 && (
                            <span className="text-[#876747] font-semibold tabular-nums">
                              +${finish.priceDelta}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette Selector */}
              <div>
                <label className="block text-xs font-medium text-[#5c4e40] mb-2">
                  Color Shade
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {COLOR_PALETTES.map((pal) => {
                    const isSelected = pal.id === selectedPaletteId;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedPaletteId(pal.id)}
                        className={`p-2 rounded-lg text-center border transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#2d241d] bg-[#fbf8f3] ring-1 ring-[#2d241d]'
                            : 'border-[#ebdcd0] hover:border-[#bda893]'
                        }`}
                      >
                        <div className="flex items-center -space-x-1">
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: pal.primaryHex }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: pal.accentHex }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#2d241d] truncate w-full">
                          {pal.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 5: Accents & Florals */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  05. Handcrafted Accents
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Toppings & Edible Garnishes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOPPING_OPTIONS.map((topping) => {
                  const isChecked = selectedToppingIds.includes(topping.id);
                  return (
                    <label
                      key={topping.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#2d241d] bg-[#fbf8f3]'
                          : 'border-[#ebdcd0] hover:border-[#bda893]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTopping(topping.id)}
                        className="mt-0.5 rounded text-[#2d241d] focus:ring-[#2d241d]"
                      />
                      <div className="text-xs">
                        <div className="flex items-center justify-between font-bold text-[#231f1d]">
                          <span>{topping.name}</span>
                          <span className="text-[#876747] tabular-nums font-semibold">
                            +${topping.price}
                          </span>
                        </div>
                        <p className="text-[#695c4f] mt-0.5">{topping.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 6: Hand-Piped Custom Message */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  06. Custom Inscription
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Hand-Piped Message
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[#695c4f] mb-1">
                    <span>Text on Cake (Optional, max 30 characters)</span>
                    <span className="tabular-nums">{pipingMessage.length}/30</span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={pipingMessage}
                    onChange={(e) => setPipingMessage(e.target.value)}
                    placeholder="e.g. Happy 30th Claire!"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6c7b5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2d241d]/20 focus:border-[#2d241d] bg-white text-[#29221d]"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#695c4f] font-medium">Script Style:</span>
                  <div className="inline-flex rounded-lg border border-[#d6c7b5] p-0.5 bg-[#fbf8f3]">
                    <button
                      type="button"
                      onClick={() => setPipingStyle('script')}
                      className={`px-3 py-1 rounded-md transition-colors font-script text-sm ${
                        pipingStyle === 'script'
                          ? 'bg-white text-[#2d241d] shadow-xs font-bold'
                          : 'text-[#6e6052]'
                      }`}
                    >
                      French Calligraphy
                    </button>
                    <button
                      type="button"
                      onClick={() => setPipingStyle('modern')}
                      className={`px-3 py-1 rounded-md transition-colors font-serif-display text-xs ${
                        pipingStyle === 'modern'
                          ? 'bg-white text-[#2d241d] shadow-xs font-bold'
                          : 'text-[#6e6052]'
                      }`}
                    >
                      Modern Serif
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 7: Dietary Adaptation */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  07. Dietary Adjustments
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Recipe Adaptations
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', title: 'Traditional Heirloom', note: 'Organic stone-milled wheat & cultured butter', delta: 0 },
                  { id: 'gluten_friendly', title: 'Gluten-Friendly', note: 'Brown rice, almond flour & oat starch sponge', delta: 15 },
                  { id: 'vegan', title: 'Vegan Plant-Based', note: 'Coconut milk ganache & oat milk vanilla sponge', delta: 18 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDietary(item.id as DietaryOption)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs ${
                      dietary === item.id
                        ? 'border-[#2d241d] bg-[#fbf8f3] ring-1 ring-[#2d241d]'
                        : 'border-[#ebdcd0] hover:border-[#bda893]'
                    }`}
                  >
                    <div className="font-bold text-[#231f1d] flex justify-between">
                      <span>{item.title}</span>
                      {item.delta > 0 && <span className="text-[#876747] tabular-nums font-semibold">+${item.delta}</span>}
                    </div>
                    <p className="text-[#695c4f] mt-1">{item.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 8: Fulfillment Scheduling & Baker's Note */}
            <div className="space-y-4 pt-2">
              <div className="pb-2 border-b border-[#f0e6dc]">
                <span className="text-xs font-semibold text-[#967d64] tracking-wider uppercase">
                  08. Date & Atelier Instructions
                </span>
                <h3 className="text-xl font-serif-display font-bold text-[#231f1d]">
                  Pickup Slot & Baker's Notes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-medium text-[#5c4e40] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Fulfillment Date (Min 48h Notice)</span>
                  </label>
                  <input
                    type="date"
                    min={minDateString}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6c7b5] text-sm focus:ring-2 focus:ring-[#2d241d]/20 focus:border-[#2d241d] bg-white text-[#29221d]"
                  />
                </div>

                {/* Time slot */}
                <div>
                  <label className="block text-xs font-medium text-[#5c4e40] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Preferred Window</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6c7b5] text-sm focus:ring-2 focus:ring-[#2d241d]/20 focus:border-[#2d241d] bg-white text-[#29221d]"
                  >
                    <option value="08:30 AM - 10:30 AM">Morning Batch (08:30 AM – 10:30 AM)</option>
                    <option value="10:30 AM - 12:30 PM">Midday Window (10:30 AM – 12:30 PM)</option>
                    <option value="12:30 PM - 02:30 PM">Afternoon Window (12:30 PM – 02:30 PM)</option>
                    <option value="02:30 PM - 04:00 PM">Late Pickup (02:30 PM – 04:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Baker instructions */}
              <div>
                <label className="block text-xs font-medium text-[#5c4e40] mb-1">
                  Special Atelier Instructions or Allergies
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please pack cake securely for a 30-minute car trip. Nut allergy at the table."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6c7b5] text-sm focus:ring-2 focus:ring-[#2d241d]/20 focus:border-[#2d241d] bg-white text-[#29221d]"
                />
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#706050] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Handcrafted at 142 Artisan Row with 100% natural colorings.</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomCake}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#231f1d] hover:bg-[#38312d] text-[#faf6f0] text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Bespoke Cake to Bag — ${totalPrice.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
