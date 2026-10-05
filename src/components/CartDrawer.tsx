import React from 'react';
import { CartItemType } from '../types/bakery';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Calendar, Clock, MapPin } from 'lucide-react';
import { TIER_OPTIONS, FLAVOR_OPTIONS, FILLING_OPTIONS, COLOR_PALETTES } from '../data/bakeryData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemType[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] border-l border-[#ebdcd0] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#ebdcd0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#231f1d]" />
              <h2 className="font-serif-display text-xl font-bold text-[#231f1d]">
                Your Order Bag
              </h2>
              <span className="text-xs text-[#7d6e60] tabular-nums">
                ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#695d52] hover:text-[#231f1d] hover:bg-[#f3ece2] transition-colors"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#eee5d8] flex items-center justify-center text-2xl">
                  🎂
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#231f1d]">
                    Your bag is currently empty
                  </h3>
                  <p className="text-xs text-[#7a6b5e] mt-1 max-w-xs mx-auto">
                    Design a bespoke celebration cake, curate a pastry box, or reserve fresh morning sourdough.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#231f1d] text-[#faf6f0] text-xs font-semibold rounded-lg hover:bg-[#3d342e] transition-colors"
                >
                  Explore Bakery Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-[#ebdcd0] rounded-xl flex flex-col justify-between shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#231f1d] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#7d6e60] mt-0.5">{item.subtitle}</p>

                        {/* Extra details for custom cakes */}
                        {item.type === 'custom_cake' && (
                          <div className="mt-2 text-[11px] text-[#635547] space-y-1 bg-[#fbf9f6] p-2 rounded-md border border-[#ebdcd0]">
                            {item.details.pipingMessage && (
                              <div className="italic text-[#29221d] font-medium">
                                Inscription: "{item.details.pipingMessage}"
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[#826f5d]">
                              <Calendar className="w-3 h-3" />
                              <span>{item.details.pickupDate}</span>
                              <span aria-hidden="true">·</span>
                              <Clock className="w-3 h-3" />
                              <span>{item.details.pickupTime}</span>
                            </div>
                            {item.details.dietary !== 'standard' && (
                              <div className="text-amber-800 font-semibold">
                                Dietary: {item.details.dietary.replace('_', ' ')}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Extra details for daily bakes */}
                        {item.type === 'daily_bake' && item.sliceOption && (
                          <div className="text-[11px] text-[#8a7663] mt-1">
                            Slicing: {item.sliceOption.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#998b7e] hover:text-red-700 p-1 transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#f4ede4] flex items-center justify-between">
                      {/* Quantity selector */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-[#d6c7b5] flex items-center justify-center text-[#231f1d] hover:bg-[#f6f2ec] text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-[#d6c7b5] flex items-center justify-center text-[#231f1d] hover:bg-[#f6f2ec] text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-serif-display text-[#231f1d] tabular-nums">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#ebdcd0] space-y-4">
              <div className="space-y-1.5 text-xs text-[#6e5f52]">
                <div className="flex justify-between">
                  <span>Order Subtotal</span>
                  <span className="font-semibold text-[#231f1d] tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Local Bakery Tax (Estimated)</span>
                  <span className="font-semibold text-[#231f1d] tabular-nums">
                    ${(subtotal * 0.0825).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#8a7258]">
                  <span>Fulfillment Choice</span>
                  <span>Calculated next step</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ebdcd0] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#231f1d]">Estimated Total</span>
                <span className="text-2xl font-serif-display font-bold text-[#231f1d] tabular-nums">
                  ${(subtotal * 1.0825).toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#231f1d] hover:bg-[#3b322c] text-[#faf6f0] text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Order Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
