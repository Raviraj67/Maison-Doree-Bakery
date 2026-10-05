import React from 'react';
import { BAKERY_INFO } from '../data/bakeryData';

interface FooterProps {
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTracker }) => {
  return (
    <footer className="bg-[#231f1d] text-[#e8dfd5] border-t border-[#38312d] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Heritage */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-2xl font-serif-display font-bold tracking-tight text-[#faf7f2]">
              Maison Dorée
            </span>
            <p className="text-xs text-[#b8ab9d] leading-relaxed max-w-sm">
              Artisanal bakery and custom cake atelier located in the Historic Mill District.
              Dedicated to 36-hour wild levain sourdough fermentation, French viennoiserie, and bespoke celebration cakes.
            </p>
            <p className="text-xs text-[#998b7e]">
              142 Artisan Row · Historic Mill District · (555) 382-7491
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#ebdcd0]">
              Atelier Offerings
            </h4>
            <ul className="space-y-2 text-xs text-[#b8ab9d]">
              <li>
                <a href="#custom-cakes" className="hover:text-[#faf7f2] transition-colors">
                  Custom Celebration Cakes
                </a>
              </li>
              <li>
                <a href="#pastry-box" className="hover:text-[#faf7f2] transition-colors">
                  Custom Pastry Boxes
                </a>
              </li>
              <li>
                <a href="#daily-bakes" className="hover:text-[#faf7f2] transition-colors">
                  Daily Hearth Sourdough
                </a>
              </li>
              <li>
                <a href="#daily-bakes" className="hover:text-[#faf7f2] transition-colors">
                  Morning Viennoiserie
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Order Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#ebdcd0]">
              Order Assistance
            </h4>
            <ul className="space-y-2 text-xs text-[#b8ab9d]">
              <li>
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Track Existing Order
                </button>
              </li>
              <li>
                <a href="#story" className="hover:text-[#faf7f2] transition-colors">
                  Bakery Hours & Counter Pickup
                </a>
              </li>
              <li>
                <a href="#custom-cakes" className="hover:text-[#faf7f2] transition-colors">
                  Custom Cake Lead Time (48h)
                </a>
              </li>
              <li>
                <a href="mailto:bonjour@maisondoreebakery.com" className="hover:text-[#faf7f2] transition-colors">
                  Weddings & Corporate Catering
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Copyright Line */}
        <div className="pt-8 border-t border-[#38312d] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a7c6f] gap-4">
          <p>© 2026 Maison Dorée Artisanal Bakery & Patisserie. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Food Safety Licensed</span>
            <span aria-hidden="true">·</span>
            <span>Organic Flours Only</span>
            <span aria-hidden="true">·</span>
            <span>100% Tree-Nut Conscious Atelier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
