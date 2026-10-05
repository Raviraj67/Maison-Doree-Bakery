import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types/bakery';
import { X, Search, CheckCircle2, Clock, Cake, PackageCheck, AlertCircle } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

const SAMPLE_SEEDED_ORDER: OrderRecord = {
  orderNumber: 'MD-8492',
  createdAt: 'Oct 4, 2026, 09:30 AM',
  customerName: 'Claire Bennett',
  customerEmail: 'claire.b@example.com',
  customerPhone: '(555) 382-9912',
  fulfillmentType: 'pickup',
  pickupDate: '2026-10-06',
  pickupTime: '10:30 AM - 12:30 PM',
  specialInstructions: 'Carrying box carefully for a 20-min drive.',
  items: [
    {
      id: 'custom_1',
      type: 'custom_cake',
      title: 'Custom 2-Tier Atelier (6" + 8")',
      subtitle: 'Tahitian Vanilla Bean · Wild Mountain Raspberry Confit · Alabaster Ivory',
      price: 195.0,
      quantity: 1,
      details: {
        tierId: 'tier_2_classic',
        spongeId: 'vanilla_bean',
        fillingId: 'raspberry_confit',
        finishId: 'smooth_minimal',
        paletteId: 'palette_ivory',
        toppingIds: ['topping_gold_leaf', 'topping_pressed_florals'],
        pipingMessage: 'Happy 30th Claire!',
        pipingStyle: 'script',
        pipingColor: '#4d372c',
        dietary: 'standard',
        fulfillmentType: 'pickup',
        pickupDate: '2026-10-06',
        pickupTime: '10:30 AM - 12:30 PM',
        specialInstructions: '',
        calculatedPrice: 235.0,
      },
    },
  ],
  subtotal: 235.0,
  tax: 19.38,
  deliveryFee: 0,
  total: 254.38,
  status: 'decorating',
};

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber || 'MD-8492');
  const [foundOrder, setFoundOrder] = useState<OrderRecord | null>(SAMPLE_SEEDED_ORDER);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('maison_doree_orders');
      if (stored) {
        const list = JSON.parse(stored);
        setRecentOrders(list);
        if (initialOrderNumber) {
          const match = list.find((o: OrderRecord) => o.orderNumber === initialOrderNumber);
          if (match) {
            setFoundOrder(match);
            setSearchQuery(initialOrderNumber);
            return;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, [initialOrderNumber]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim().toUpperCase();

    // Check recent stored orders
    const matched = recentOrders.find(
      (o) => o.orderNumber.toUpperCase() === cleanQuery || o.orderNumber.replace('MD-', '') === cleanQuery
    );

    if (matched) {
      setFoundOrder(matched);
      return;
    }

    if (cleanQuery === 'MD-8492' || cleanQuery === '8492') {
      setFoundOrder(SAMPLE_SEEDED_ORDER);
      return;
    }

    setFoundOrder(null);
  };

  const steps = [
    { id: 'received', title: 'Order Queued', desc: 'Recipe staged & ingredients measured', icon: Clock },
    { id: 'baking', title: 'Hearth & Oven', desc: 'Slow-fermented sponges baked to golden crumb', icon: Cake },
    { id: 'decorating', title: 'Pastry Atelier', desc: 'Swiss buttercream frosted & message hand-piped', icon: CheckCircle2 },
    { id: 'ready', title: 'Ready for Pickup', desc: 'Resting in temperature-controlled pastry vault', icon: PackageCheck },
  ];

  const getStepIndex = (status: OrderRecord['status']) => {
    switch (status) {
      case 'received':
        return 0;
      case 'baking':
        return 1;
      case 'decorating':
        return 2;
      case 'ready':
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#ebdcd0] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold">
              Live Atelier Tracker
            </span>
            <h2 className="text-2xl font-serif-display font-bold text-[#231f1d]">
              Track Your Custom Order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6e6052] hover:text-[#231f1d] hover:bg-[#f5ede2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a7258] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # (e.g. MD-8492)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d6c7b5] text-xs bg-white text-[#231f1d] font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#231f1d] text-[#faf6f0] text-xs font-semibold rounded-xl hover:bg-[#3d342e] transition-colors whitespace-nowrap"
            >
              Lookup Order
            </button>
          </form>

          {/* Quick links to recent orders if present */}
          {recentOrders.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#706050] overflow-x-auto pb-1">
              <span>Your Recent Orders:</span>
              {recentOrders.slice(0, 3).map((ro) => (
                <button
                  key={ro.orderNumber}
                  type="button"
                  onClick={() => {
                    setSearchQuery(ro.orderNumber);
                    setFoundOrder(ro);
                  }}
                  className="font-mono underline text-[#231f1d] font-semibold hover:text-amber-800"
                >
                  {ro.orderNumber}
                </button>
              ))}
            </div>
          )}

          {foundOrder ? (
            <div className="space-y-6">
              {/* Order Card Overview */}
              <div className="p-4 bg-white border border-[#ebdcd0] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7d6e60]">Order Identifier</div>
                  <div className="font-mono text-lg font-bold text-[#231f1d]">
                    {foundOrder.orderNumber}
                  </div>
                  <div className="text-xs text-[#7d6e60] mt-0.5">
                    Placed for {foundOrder.customerName} on {foundOrder.createdAt}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#7d6e60]">Fulfillment Window</div>
                  <div className="text-xs font-bold text-[#231f1d]">
                    {foundOrder.pickupDate}
                  </div>
                  <div className="text-[11px] text-[#7d6e60]">
                    {foundOrder.pickupTime}
                  </div>
                </div>
              </div>

              {/* 4-Step Progress Indicator */}
              <div className="bg-white border border-[#ebdcd0] rounded-xl p-6">
                <div className="text-xs font-bold text-[#231f1d] uppercase tracking-wider mb-6">
                  Artisan Kitchen Progress
                </div>

                <div className="relative">
                  {/* Connecting Track Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#ede4d7] -z-0" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-[#231f1d] -z-0 transition-all duration-500"
                    style={{
                      width: `${(activeIndex / (steps.length - 1)) * 92}%`,
                    }}
                  />

                  <div className="grid grid-cols-4 gap-2 relative z-10">
                    {steps.map((st, i) => {
                      const isCompleted = i <= activeIndex;
                      const isCurrent = i === activeIndex;

                      return (
                        <div key={st.id} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                              isCompleted
                                ? 'bg-[#231f1d] text-[#faf6f0]'
                                : 'bg-white border-2 border-[#d6c7b5] text-[#8a7258]'
                            } ${isCurrent ? 'ring-4 ring-amber-200' : ''}`}
                          >
                            {i + 1}
                          </div>
                          <div
                            className={`mt-2 text-xs font-bold ${
                              isCompleted ? 'text-[#231f1d]' : 'text-[#8a7b6e]'
                            }`}
                          >
                            {st.title}
                          </div>
                          <div className="hidden sm:block text-[10px] text-[#736353] mt-0.5 max-w-[110px] leading-tight">
                            {st.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Itemized Order Content */}
              <div className="bg-white border border-[#ebdcd0] rounded-xl p-5 space-y-3">
                <div className="text-xs font-bold text-[#231f1d] pb-2 border-b border-[#f4ede4]">
                  Items in this Order
                </div>
                {foundOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <div>
                      <span className="font-semibold text-[#231f1d]">
                        {item.quantity}x {item.title}
                      </span>
                      <p className="text-[11px] text-[#78695b]">{item.subtitle}</p>
                    </div>
                    <span className="font-semibold tabular-nums text-[#231f1d]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#f0e6dc] flex justify-between text-xs font-bold text-[#231f1d]">
                  <span>Total Amount</span>
                  <span className="tabular-nums font-serif-display text-base">
                    ${foundOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-[#ebdcd0] rounded-xl space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
              <div className="font-bold text-sm text-[#231f1d]">No order matching "{searchQuery}"</div>
              <p className="text-xs text-[#706050] max-w-sm mx-auto">
                Please verify your order number in your confirmation email or receipt. Sample order MD-8492 is available for viewing.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('MD-8492');
                  setFoundOrder(SAMPLE_SEEDED_ORDER);
                }}
                className="mt-2 text-xs text-[#231f1d] font-bold underline"
              >
                Load Sample Order MD-8492
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
