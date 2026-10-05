import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracker,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#ebdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single text element wordmark in display face */}
          <a
            href="/"
            className="text-2xl font-serif-display font-bold tracking-tight text-[#231f1d] hover:text-[#524438] transition-colors"
          >
            Maison Dorée
          </a>

          {/* Zone 2: 4-6 clean text navigation links (1-2 word labels, single line) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5c4e40]">
            <a
              href="#custom-cakes"
              className="hover:text-[#231f1d] transition-colors hover:underline underline-offset-4 whitespace-nowrap"
            >
              Custom Cakes
            </a>
            <a
              href="#pastry-box"
              className="hover:text-[#231f1d] transition-colors hover:underline underline-offset-4 whitespace-nowrap"
            >
              Pastry Box
            </a>
            <a
              href="#daily-bakes"
              className="hover:text-[#231f1d] transition-colors hover:underline underline-offset-4 whitespace-nowrap"
            >
              Daily Bakes
            </a>
            <a
              href="#story"
              className="hover:text-[#231f1d] transition-colors hover:underline underline-offset-4 whitespace-nowrap"
            >
              Our Story
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenTracker}
              className="px-3.5 py-2 text-xs font-semibold text-[#5c4e40] hover:text-[#231f1d] border border-[#d6c7b5] rounded-lg hover:bg-white transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#8a7258]" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="px-4 py-2 text-xs font-semibold text-[#faf6f0] bg-[#231f1d] hover:bg-[#3d342e] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 shadow-xs"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
