import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { CustomPastryBoxBuilder } from './components/CustomPastryBoxBuilder';
import { SignatureMenu } from './components/SignatureMenu';
import { BakeryStory } from './components/BakeryStory';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';
import {
  CartItemType,
  CustomCakeOrder,
  CustomPastryBox,
  DailyMenuItem,
  OrderRecord,
} from './types/bakery';
import { X, Sparkles } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem('maison_doree_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string | undefined>(undefined);
  const [showTopBanner, setShowTopBanner] = useState(true);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maison_doree_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add Custom Cake Handler
  const handleAddCustomCake = (
    order: CustomCakeOrder,
    summary: { title: string; subtitle: string }
  ) => {
    const newItem: CartItemType = {
      id: `cake_${Date.now()}`,
      type: 'custom_cake',
      title: summary.title,
      subtitle: summary.subtitle,
      price: order.calculatedPrice,
      quantity: 1,
      details: order,
    };
    setCartItems((prev) => [newItem, ...prev]);
  };

  // Add Custom Pastry Box Handler
  const handleAddPastryBox = (
    box: CustomPastryBox,
    summary: { title: string; subtitle: string }
  ) => {
    const newItem: CartItemType = {
      id: `box_${Date.now()}`,
      type: 'pastry_box',
      title: summary.title,
      subtitle: summary.subtitle,
      price: box.calculatedPrice,
      quantity: 1,
      details: box,
    };
    setCartItems((prev) => [newItem, ...prev]);
  };

  // Add Daily Bake Handler
  const handleAddDailyItem = (
    item: DailyMenuItem,
    sliceOption?: 'whole' | 'thick_sliced' | 'thin_sliced'
  ) => {
    setCartItems((prev) => {
      // Check if identical item & sliceOption already exists
      const existingIdx = prev.findIndex(
        (ci) => ci.type === 'daily_bake' && ci.item.id === item.id && ci.sliceOption === sliceOption
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }

      const newItem: CartItemType = {
        id: `daily_${item.id}_${sliceOption || 'std'}_${Date.now()}`,
        type: 'daily_bake',
        title: item.name,
        subtitle: sliceOption ? `Slicing: ${sliceOption.replace('_', ' ')}` : item.category.replace('_', ' '),
        price: item.price,
        quantity: 1,
        item,
        sliceOption,
      };
      return [newItem, ...prev];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    // Clear cart upon successful order
    setCartItems([]);
    setActiveTrackingNumber(order.orderNumber);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col text-[#231f1d]">
      {/* Slim, Dismissible Promotional Banner (<= 40px) */}
      {showTopBanner && (
        <div className="bg-[#2a241f] text-[#f7f2ea] text-[11px] py-1.5 px-4 flex items-center justify-between z-50">
          <div className="mx-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Now booking weekend bespoke cakes & pastry boxes. Complimentary courier delivery on custom orders over $150.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTopBanner(false)}
            className="text-[#b8ab9d] hover:text-white p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setActiveTrackingNumber(undefined);
          setIsTrackerOpen(true);
        }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartCustomOrder={() => {
            const el = document.getElementById('custom-cakes');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExplorePastryBox={() => {
            const el = document.getElementById('pastry-box');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Bespoke Celebration Cake Builder (Interactive Live Studio) */}
        <CustomCakeBuilder onAddToCart={handleAddCustomCake} />

        {/* Custom Pastry & Viennoiserie Box Builder */}
        <CustomPastryBoxBuilder onAddBoxToCart={handleAddPastryBox} />

        {/* Daily Fresh Bakes & Sourdough Hearth */}
        <SignatureMenu onAddDailyItem={handleAddDailyItem} />

        {/* Bakery Heritage, Testimonials & Hours */}
        <BakeryStory />
      </main>

      {/* Footer */}
      <Footer
        onOpenTracker={() => {
          setActiveTrackingNumber(undefined);
          setIsTrackerOpen(true);
        }}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal & Official Receipt */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderNumber={activeTrackingNumber}
      />
    </div>
  );
}
