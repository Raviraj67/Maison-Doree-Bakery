import React from 'react';
import heroImage from '../assets/images/bakery_hero_spread_1791180903080.jpg';
import { ArrowRight, Cake, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartCustomOrder: () => void;
  onExplorePastryBox: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCustomOrder,
  onExplorePastryBox,
}) => {
  return (
    <section className="relative bg-[#faf7f2] border-b border-[#ebdcd0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text / Action Zone (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a7258]">
              <span>Handcrafted in the Historic Mill District</span>
              <span aria-hidden="true">·</span>
              <span>Organic Levain & Patisserie</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-[#231f1d] leading-[1.08] tracking-tight">
              Artisanal bakes for life’s grand & quiet moments.
            </h1>

            <p className="text-base text-[#5c4e40] leading-relaxed max-w-xl">
              Slow-fermented hearth breads, flaky morning viennoiserie, and an interactive bespoke atelier
              where you can design custom celebration cakes layer by layer with live piped calligraphy.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#custom-cakes"
                onClick={onStartCustomOrder}
                className="px-6 py-3.5 bg-[#231f1d] hover:bg-[#3d342e] text-[#faf6f0] text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Cake className="w-4 h-4 text-amber-300" />
                <span>Design a Custom Cake</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#pastry-box"
                onClick={onExplorePastryBox}
                className="px-6 py-3.5 bg-white hover:bg-[#f6efe6] text-[#231f1d] border border-[#d6c7b5] text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span>Curate Pastry Box</span>
              </a>
            </div>

            {/* Trust Markers / Adjacency */}
            <div className="pt-6 border-t border-[#ebdcd0] flex flex-wrap items-center gap-6 text-xs text-[#706050]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-medium text-[#2d241d]">Fresh Oven Hearth:</span>
                <span>Morning bakes ready daily at 7:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="font-medium text-[#2d241d]">Custom Cakes:</span>
                <span>Minimum 48 hours notice required</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Slot (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#ebdcd0] aspect-16/10 lg:aspect-4/3 bg-[#f2ebe2]">
              <img
                src={heroImage}
                alt="Artisan bakery counter laden with fresh sourdough, golden croissants, and morning pastries"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle scrim for editorial quote */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-[#faf6f0]">
                  <p className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
                    The Hearth Promise
                  </p>
                  <p className="font-serif-display text-lg italic text-[#f4eee4]">
                    "Zero artificial additives, single-origin stone flours, pure unpasteurized pasture butter."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
