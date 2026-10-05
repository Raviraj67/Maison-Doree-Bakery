import React, { useState } from 'react';
import {
  TierOption,
  FlavorOption,
  FillingOption,
  FinishOption,
  ColorPalette,
  ToppingOption,
  DietaryOption,
} from '../types/bakery';
import { Sparkles, Eye, Layers } from 'lucide-react';

interface CustomCakeVisualizerProps {
  selectedTier: TierOption;
  selectedFlavor: FlavorOption;
  selectedFilling: FillingOption;
  selectedFinish: FinishOption;
  selectedPalette: ColorPalette;
  selectedToppings: ToppingOption[];
  pipingMessage: string;
  pipingStyle: 'script' | 'modern';
  dietary: DietaryOption;
  totalPrice: number;
}

export const CustomCakeVisualizer: React.FC<CustomCakeVisualizerProps> = ({
  selectedTier,
  selectedFlavor,
  selectedFilling,
  selectedFinish,
  selectedPalette,
  selectedToppings,
  pipingMessage,
  pipingStyle,
  dietary,
  totalPrice,
}) => {
  const [viewMode, setViewMode] = useState<'exterior' | 'cross_section'>('exterior');

  const tiersCount = selectedTier.tiersCount;
  const hasGoldLeaf = selectedToppings.some((t) => t.id === 'topping_gold_leaf');
  const hasFlorals = selectedToppings.some((t) => t.id === 'topping_pressed_florals');
  const hasFigs = selectedToppings.some((t) => t.id === 'topping_fresh_figs');
  const hasMacarons = selectedToppings.some((t) => t.id === 'topping_macaron_crown');
  const hasPearlBorder = selectedToppings.some((t) => t.id === 'topping_pearl_border');

  // Determine tier dimensions in SVG units
  // Tier 1 (bottom), Tier 2 (middle if >=2), Tier 3 (top if 3)
  const tierConfigs = {
    1: [{ width: 220, height: 110, y: 230, label: selectedTier.diameterDesc }],
    2: [
      { width: 250, height: 95, y: 245, label: '8" Base Tier' },
      { width: 175, height: 85, y: 160, label: '6" Upper Tier' },
    ],
    3: [
      { width: 270, height: 85, y: 255, label: '10" Base' },
      { width: 200, height: 75, y: 180, label: '8" Mid' },
      { width: 140, height: 65, y: 115, label: '6" Crown' },
    ],
  }[tiersCount];

  return (
    <div className="flex flex-col bg-[#fdfbf7] border border-[#e8dfd3] rounded-2xl p-6 shadow-xs relative">
      {/* Top Bar inside preview */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ebdcd0]">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#7a6b5e]">
          <span>Artisan Preview</span>
          <span aria-hidden="true">·</span>
          <span>{selectedTier.name}</span>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-0.5 bg-[#ede5d8] rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode('exterior')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'exterior'
                ? 'bg-white text-[#2a241f] shadow-xs'
                : 'text-[#6b5f54] hover:text-[#2a241f]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Exterior Finish</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cross_section')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'cross_section'
                ? 'bg-white text-[#2a241f] shadow-xs'
                : 'text-[#6b5f54] hover:text-[#2a241f]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inside Layers</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center my-2 select-none overflow-hidden">
        <svg
          viewBox="0 0 400 420"
          className="w-full h-full max-h-[390px] drop-shadow-md transition-all duration-300"
          aria-label="Interactive 2D preview of custom bakery cake"
        >
          <defs>
            {/* Soft backdrop radial light */}
            <radialGradient id="cakeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fdfbf7" stopOpacity="0" />
            </radialGradient>

            {/* Stand Metallic Gradient */}
            <linearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c5b299" />
              <stop offset="35%" stopColor="#eedec7" />
              <stop offset="70%" stopColor="#d4c2a8" />
              <stop offset="100%" stopColor="#a39076" />
            </linearGradient>

            {/* Cake Exterior Cylinder Gradient */}
            <linearGradient id="tierGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={selectedPalette.primaryHex} stopOpacity="0.88" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="60%" stopColor={selectedPalette.primaryHex} stopOpacity="1" />
              <stop offset="100%" stopColor={selectedPalette.accentHex} stopOpacity="0.9" />
            </linearGradient>

            {/* Semi-naked sponge gradient */}
            <linearGradient id="spongeShowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={selectedFlavor.spongeColor} stopOpacity="0.75" />
              <stop offset="50%" stopColor={selectedPalette.primaryHex} stopOpacity="0.5" />
              <stop offset="100%" stopColor={selectedFlavor.spongeColor} stopOpacity="0.65" />
            </linearGradient>

            {/* Filling gradient for cross section */}
            <linearGradient id="fillingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={selectedFilling.fillingColor} />
              <stop offset="70%" stopColor={selectedFilling.fillingColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor={selectedFilling.fillingColor} />
            </linearGradient>

            {/* Gold leaf pattern */}
            <pattern id="goldFleckPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <polygon points="12,4 16,8 14,14 8,11" fill="#dfb15b" opacity="0.85" />
              <polygon points="28,22 34,25 31,31 25,27" fill="#f5d58a" opacity="0.95" />
              <polygon points="5,30 9,33 7,37 3,34" fill="#cfa043" opacity="0.8" />
            </pattern>
          </defs>

          {/* Background Ambient Aura */}
          <ellipse cx="200" cy="220" rx="180" ry="160" fill="url(#cakeGlow)" />

          {/* Pedestal Stand Shadow */}
          <ellipse cx="200" cy="375" rx="150" ry="16" fill="#000000" opacity="0.08" />

          {/* Marble/Brass Footed Cake Pedestal */}
          {/* Base Foot */}
          <path
            d="M 140 375 C 140 365, 170 362, 200 362 C 230 362, 260 365, 260 375 Z"
            fill="url(#standGradient)"
          />
          {/* Stem */}
          <path
            d="M 188 340 L 186 363 L 214 363 L 212 340 Z"
            fill="url(#standGradient)"
          />
          {/* Rim Plate Plate Top */}
          <ellipse cx="200" cy="342" rx="160" ry="16" fill="url(#standGradient)" stroke="#b59f83" strokeWidth="0.8" />
          <ellipse cx="200" cy="340" rx="154" ry="13" fill="#f7f3ec" />

          {/* ================= EXTERIOR VIEW ================= */}
          {viewMode === 'exterior' && (
            <g id="exteriorCake">
              {tierConfigs.map((tier, index) => {
                const rx = tier.width / 2;
                const ry = rx * 0.18;
                const topY = tier.y;
                const botY = tier.y + tier.height;
                const isTopTier = index === tierConfigs.length - 1;

                return (
                  <g key={`tier-${index}`}>
                    {/* Shadow underneath tier */}
                    <ellipse
                      cx="200"
                      cy={botY + 3}
                      rx={rx + 2}
                      ry={ry + 2}
                      fill="#1c130b"
                      opacity="0.14"
                    />

                    {/* Tier Cylinder Body */}
                    <path
                      d={`M ${200 - rx} ${topY}
                          L ${200 - rx} ${botY}
                          A ${rx} ${ry} 0 0 0 ${200 + rx} ${botY}
                          L ${200 + rx} ${topY}
                          Z`}
                      fill={
                        selectedFinish.texture === 'semi-naked'
                          ? 'url(#spongeShowGradient)'
                          : 'url(#tierGradient)'
                      }
                      stroke={selectedPalette.accentHex}
                      strokeWidth="0.75"
                    />

                    {/* Finish Textures */}
                    {selectedFinish.texture === 'ribbed' && (
                      <g opacity="0.35" stroke={selectedPalette.accentHex} strokeWidth="1.2">
                        {Array.from({ length: 5 }).map((_, rIdx) => {
                          const ridgeY = topY + (tier.height / 6) * (rIdx + 1);
                          return (
                            <path
                              key={`ridge-${rIdx}`}
                              d={`M ${200 - rx + 4} ${ridgeY} A ${rx - 4} ${ry} 0 0 0 ${200 + rx - 4} ${ridgeY}`}
                              fill="none"
                            />
                          );
                        })}
                      </g>
                    )}

                    {selectedFinish.texture === 'semi-naked' && (
                      <g opacity="0.35" stroke={selectedFlavor.spongeColor} strokeWidth="2.5" strokeDasharray="14 10 22 8">
                        <path
                          d={`M ${200 - rx + 10} ${topY + tier.height * 0.35} A ${rx - 10} ${ry} 0 0 0 ${200 + rx - 10} ${topY + tier.height * 0.35}`}
                          fill="none"
                        />
                        <path
                          d={`M ${200 - rx + 8} ${topY + tier.height * 0.7} A ${rx - 8} ${ry} 0 0 0 ${200 + rx - 8} ${topY + tier.height * 0.7}`}
                          fill="none"
                        />
                      </g>
                    )}

                    {/* Tier Top Oval Rim */}
                    <ellipse
                      cx="200"
                      cy={topY}
                      rx={rx}
                      ry={ry}
                      fill={selectedPalette.primaryHex}
                      stroke={selectedPalette.accentHex}
                      strokeWidth="0.75"
                    />

                    {/* Lambeth piped scalloped garlands */}
                    {selectedFinish.texture === 'lambeth' && (
                      <g stroke={selectedPalette.accentHex} fill="none" strokeWidth="1.5">
                        {Array.from({ length: 6 }).map((_, gIdx) => {
                          const span = (tier.width - 20) / 6;
                          const startX = 200 - rx + 10 + gIdx * span;
                          const endX = startX + span;
                          return (
                            <path
                              key={`swag-${gIdx}`}
                              d={`M ${startX} ${topY + 4} Q ${(startX + endX) / 2} ${topY + 16} ${endX} ${topY + 4}`}
                            />
                          );
                        })}
                      </g>
                    )}

                    {/* Ganache Drip effect */}
                    {selectedFinish.texture === 'ganache-drip' && (
                      <path
                        d={`M ${200 - rx} ${topY}
                            Q ${200 - rx + 15} ${topY + 22} ${200 - rx + 25} ${topY + 6}
                            Q ${200 - rx + 40} ${topY + 30} ${200 - rx + 55} ${topY + 8}
                            Q ${200 - rx + 80} ${topY + 36} ${200 - rx + 100} ${topY + 7}
                            Q ${200} ${topY + 28} ${200 + 30} ${topY + 8}
                            Q ${200 + 55} ${topY + 32} ${200 + 80} ${topY + 6}
                            Q ${200 + rx - 20} ${topY + 25} ${200 + rx} ${topY}
                            Z`}
                        fill="#382117"
                        opacity="0.9"
                      />
                    )}

                    {/* Pearl border along base rim */}
                    {hasPearlBorder && (
                      <g fill="#faf7f0" stroke="#d5c8b5" strokeWidth="0.5">
                        {Array.from({ length: 16 }).map((_, pIdx) => {
                          const angle = Math.PI * (pIdx / 15);
                          const px = 200 - Math.cos(angle) * (rx - 2);
                          const py = botY + Math.sin(angle) * (ry * 0.95);
                          return <circle key={`pearl-${pIdx}`} cx={px} cy={py} r="2.8" />;
                        })}
                      </g>
                    )}

                    {/* Gold Leaf Accents */}
                    {hasGoldLeaf && (
                      <g fill="url(#goldFleckPattern)" opacity="0.95">
                        <ellipse cx={200 - rx * 0.4} cy={topY + tier.height * 0.45} rx="18" ry="12" />
                        <ellipse cx={200 + rx * 0.35} cy={topY + tier.height * 0.6} rx="14" ry="10" />
                        <ellipse cx={200 + rx * 0.1} cy={topY + 6} rx="15" ry="6" />
                      </g>
                    )}

                    {/* Pressed Organic Florals */}
                    {hasFlorals && (
                      <g>
                        <circle cx={200 - rx * 0.3} cy={topY + tier.height * 0.5} r="5" fill="#a46d8f" opacity="0.8" />
                        <circle cx={200 - rx * 0.22} cy={topY + tier.height * 0.46} r="4.5" fill="#d9996d" opacity="0.85" />
                        <circle cx={200 + rx * 0.4} cy={topY + tier.height * 0.4} r="5.5" fill="#6c8f95" opacity="0.85" />
                        <ellipse cx={200 + rx * 0.48} cy={topY + tier.height * 0.45} rx="6" ry="2.5" fill="#758e65" opacity="0.8" />
                      </g>
                    )}

                    {/* Live Custom Message on Front of Tier */}
                    {/* Render message on the most prominent tier (top tier if 1 or 2, mid/crown tier) */}
                    {pipingMessage && isTopTier && (
                      <g>
                        <text
                          x="200"
                          y={topY + tier.height * 0.58}
                          textAnchor="middle"
                          fill={selectedPalette.id === 'palette_midnight' ? '#eedbc5' : '#4d372c'}
                          className={pipingStyle === 'script' ? 'font-script' : 'font-serif-display'}
                          style={{
                            fontSize: pipingStyle === 'script' ? '18px' : '12px',
                            fontWeight: pipingStyle === 'script' ? 500 : 600,
                            letterSpacing: pipingStyle === 'script' ? '0.04em' : '0.12em',
                            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.15))',
                          }}
                        >
                          {pipingMessage}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Top Tier Crown Toppings: Figs & Berries, Macarons */}
              {(() => {
                const crownTier = tierConfigs[tierConfigs.length - 1];
                const crownY = crownTier.y;
                return (
                  <g id="crownGarnish">
                    {/* Macarons */}
                    {hasMacarons && (
                      <g transform={`translate(200, ${crownY - 14})`}>
                        {/* Macaron 1 (Ivory) */}
                        <g transform="translate(-24, 0) rotate(-12)">
                          <ellipse cx="0" cy="0" rx="12" ry="5.5" fill="#f5ede0" stroke="#d6c6b2" strokeWidth="0.6" />
                          <rect x="-11" y="-1.5" width="22" height="3" fill="#dfcfbd" rx="1" />
                        </g>
                        {/* Macaron 2 (Pistachio) */}
                        <g transform="translate(0, -6)">
                          <ellipse cx="0" cy="0" rx="13" ry="6" fill="#c3d4a4" stroke="#9cad7b" strokeWidth="0.6" />
                          <rect x="-12" y="-1.5" width="24" height="3" fill="#a4b785" rx="1" />
                        </g>
                        {/* Macaron 3 (Blush) */}
                        <g transform="translate(24, 2) rotate(14)">
                          <ellipse cx="0" cy="0" rx="12" ry="5.5" fill="#ebc2bd" stroke="#c89d98" strokeWidth="0.6" />
                          <rect x="-11" y="-1.5" width="22" height="3" fill="#cfa5a0" rx="1" />
                        </g>
                      </g>
                    )}

                    {/* Fresh Mission Figs & Blackberries */}
                    {hasFigs && (
                      <g transform={`translate(200, ${crownY - 8})`}>
                        {/* Fig Half (Deep Purple skin + Ruby core) */}
                        <path
                          d="M -16 6 C -24 0, -22 -14, -12 -16 C -2 -14, 0 0, -10 6 Z"
                          fill="#422538"
                          stroke="#2f1727"
                          strokeWidth="0.75"
                        />
                        <path
                          d="M -15 3 C -20 -1, -19 -11, -12 -13 C -5 -11, -3 -1, -9 3 Z"
                          fill="#a3283c"
                        />
                        <circle cx="-11" cy="-4" r="1" fill="#fce5bb" />
                        <circle cx="-13" cy="-7" r="0.9" fill="#fce5bb" />
                        {/* Blackberry cluster */}
                        <g transform="translate(10, -2)">
                          <circle cx="0" cy="0" r="4" fill="#1e1824" />
                          <circle cx="-3" cy="-4" r="3.5" fill="#2c2235" />
                          <circle cx="3" cy="-4" r="3.5" fill="#251d2d" />
                          <circle cx="0" cy="-7" r="3" fill="#32263d" />
                        </g>
                        {/* Fresh Thyme Sprig */}
                        <path d="M -2 4 Q 4 -4 14 -8" stroke="#4f6e3d" strokeWidth="1.2" fill="none" />
                        <ellipse cx="6" cy="-5" rx="3" ry="1.5" fill="#5e8248" transform="rotate(-30 6 -5)" />
                        <ellipse cx="12" cy="-9" rx="3" ry="1.5" fill="#5e8248" transform="rotate(-40 12 -9)" />
                      </g>
                    )}
                  </g>
                );
              })()}
            </g>
          )}

          {/* ================= CROSS-SECTION VIEW ================= */}
          {viewMode === 'cross_section' && (
            <g id="crossSectionCake">
              {tierConfigs.map((tier, index) => {
                const rx = tier.width / 2;
                const topY = tier.y;
                const layerHeight = tier.height / 7; // 4 sponge layers + 3 filling layers
                const isBottomTier = index === 0;

                return (
                  <g key={`xsec-${index}`}>
                    {/* Tier outer boundary */}
                    <rect
                      x={200 - rx}
                      y={topY}
                      width={tier.width}
                      height={tier.height}
                      rx="3"
                      fill="#ffffff"
                      stroke="#8c7866"
                      strokeWidth="1"
                    />

                    {/* Alternating Sponge & Filling slices */}
                    {/* Layer 1: Sponge */}
                    <rect x={200 - rx + 3} y={topY + 3} width={tier.width - 6} height={layerHeight} fill={selectedFlavor.spongeColor} />
                    {/* Layer 2: Filling */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight} width={tier.width - 6} height={layerHeight * 0.9} fill="url(#fillingGradient)" />
                    {/* Layer 3: Sponge */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight * 1.9} width={tier.width - 6} height={layerHeight} fill={selectedFlavor.spongeColor} />
                    {/* Layer 4: Filling */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight * 2.9} width={tier.width - 6} height={layerHeight * 0.9} fill="url(#fillingGradient)" />
                    {/* Layer 5: Sponge */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight * 3.8} width={tier.width - 6} height={layerHeight} fill={selectedFlavor.spongeColor} />
                    {/* Layer 6: Filling */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight * 4.8} width={tier.width - 6} height={layerHeight * 0.9} fill="url(#fillingGradient)" />
                    {/* Layer 7: Base Sponge */}
                    <rect x={200 - rx + 3} y={topY + 3 + layerHeight * 5.7} width={tier.width - 6} height={layerHeight} fill={selectedFlavor.spongeColor} />

                    {/* Outer Frosting crumb coat seal */}
                    <rect
                      x={200 - rx}
                      y={topY}
                      width="5"
                      height={tier.height}
                      fill={selectedPalette.primaryHex}
                      stroke={selectedPalette.accentHex}
                      strokeWidth="0.5"
                    />
                    <rect
                      x={200 + rx - 5}
                      y={topY}
                      width="5"
                      height={tier.height}
                      fill={selectedPalette.primaryHex}
                      stroke={selectedPalette.accentHex}
                      strokeWidth="0.5"
                    />

                    {/* Annotation on bottom tier */}
                    {isBottomTier && (
                      <g>
                        <line x1={200 + rx + 10} y1={topY + layerHeight * 2.5} x2={200 + rx + 35} y2={topY + layerHeight * 2.5} stroke="#8c7866" strokeWidth="0.75" />
                        <text x={200 + rx + 40} y={topY + layerHeight * 2.8} fill="#5c4e40" fontSize="9" fontWeight="600">
                          {selectedFilling.name.split(' ')[0]} Filling
                        </text>
                        <line x1={200 - rx - 10} y1={topY + layerHeight * 4.2} x2={200 - rx - 35} y2={topY + layerHeight * 4.2} stroke="#8c7866" strokeWidth="0.75" />
                        <text x={200 - rx - 40} y={topY + layerHeight * 4.5} textAnchor="end" fill="#5c4e40" fontSize="9" fontWeight="600">
                          4 Sponge Layers
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Visualizer Bottom Meta Bar */}
      <div className="pt-3 border-t border-[#ebdcd0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6e6155]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#29221d]">{selectedTier.servingsDesc}</span>
          <span aria-hidden="true">·</span>
          <span>{selectedFlavor.name.split(' ')[0]}</span>
          <span aria-hidden="true">/</span>
          <span>{selectedFilling.name.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-3">
          {dietary !== 'standard' && (
            <span className="text-amber-800 font-medium">
              {dietary === 'gluten_friendly' ? 'Gluten-Friendly Recipe' : 'Vegan Plant-Based'}
            </span>
          )}
          <span className="text-base font-semibold text-[#29221d] tabular-nums">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
