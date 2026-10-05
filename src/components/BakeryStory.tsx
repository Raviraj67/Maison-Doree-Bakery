import React from 'react';
import { BAKERY_INFO, TESTIMONIALS } from '../data/bakeryData';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Award } from 'lucide-react';
import sourdoughImage from '../assets/images/artisan_sourdough_bread_1791180929506.jpg';

export const BakeryStory: React.FC = () => {
  return (
    <section id="story" className="py-16 md:py-24 bg-[#f5ede2] border-t border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story split view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold">
              The Maison Philosophy
            </p>
            <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-[#231f1d] leading-tight">
              Flour, Water, Salt, & 36 Hours of Fermentation
            </h2>
            <p className="text-sm text-[#57493d] leading-relaxed">
              Founded in the historic Mill District, Maison Dorée was born out of reverence for classical French
              fermentation craft. Every country loaf begins with our 8-year-old wild levain culture, nurtured daily
              with organic stone-milled whole rye and red winter wheat.
            </p>
            <p className="text-sm text-[#57493d] leading-relaxed">
              For our custom celebration atelier, our pastry chefs handcraft each sponge from scratch using farm-direct
              pasture eggs, Normandy cultured butter, and pure organic botanicals. We never use artificial food dyes or
              fondant sheets—every hue is extracted from freeze-dried raspberries, matcha, turmeric, and butterfly pea tea.
            </p>

            {/* 3 Pillar Metrics / Proof Points with explicit units */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e2d2c0]">
              <div>
                <div className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                  36 hrs
                </div>
                <div className="text-xs text-[#705e4f] mt-0.5">Cold Levain Ferment</div>
              </div>
              <div>
                <div className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                  84%
                </div>
                <div className="text-xs text-[#705e4f] mt-0.5">AOP French Butterfat</div>
              </div>
              <div>
                <div className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                  100%
                </div>
                <div className="text-xs text-[#705e4f] mt-0.5">Natural Botanical Hues</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#ebdcd0]">
              <img
                src={sourdoughImage}
                alt="Artisan baker scoring sourdough loaf"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                <div className="text-[#faf6f0]">
                  <p className="text-xs uppercase tracking-wider text-amber-200 font-semibold">
                    The Bread Hearth Atelier
                  </p>
                  <p className="text-base font-serif-display italic mt-1 text-[#f5eee3]">
                    "Real bread requires patience that industrial production can never afford."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Adjacency: Attributable Testimonials */}
        <div className="pt-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold">
              Client Testimonials
            </p>
            <h3 className="text-2xl font-serif-display font-bold text-[#231f1d]">
              Celebrated by Our Community
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#ebdcd0] rounded-2xl p-6 flex flex-col justify-between shadow-xs"
              >
                <p className="text-xs text-[#524438] leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-5 pt-3 border-t border-[#f2eae1] text-xs">
                  <div className="font-bold text-[#231f1d]">{t.author}</div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-[#7a6b5e] mt-0.5 text-[11px]">
                    <span>{t.occasion}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atelier Hours & Counter Location */}
        <div className="bg-white border border-[#ebdcd0] rounded-2xl p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visit Counter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#231f1d] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#8a7258]" />
                <span>Bakery & Pickup Counter</span>
              </div>
              <p className="text-xs text-[#635547] leading-relaxed">
                {BAKERY_INFO.address}
                <br />
                Historic Mill District
              </p>
              <p className="text-xs text-[#8a7258] pt-1">
                Curbside loading zone directly outside for celebration cake collection.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#231f1d] font-bold text-sm">
                <Clock className="w-4 h-4 text-[#8a7258]" />
                <span>Baking & Pickup Hours</span>
              </div>
              <div className="space-y-1 text-xs text-[#635547]">
                {BAKERY_INFO.hours.map((h, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium text-[#2d241d]">{h.days}:</span>
                    <span className="tabular-nums">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atelier Direct Contact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#231f1d] font-bold text-sm">
                <Phone className="w-4 h-4 text-[#8a7258]" />
                <span>Order Inquiries & Concierge</span>
              </div>
              <p className="text-xs text-[#635547]">{BAKERY_INFO.phone}</p>
              <p className="text-xs text-[#635547]">{BAKERY_INFO.email}</p>
              <div className="pt-2 text-[11px] text-[#8a7258] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Licensed Commercial Kitchen & Food Safety Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
