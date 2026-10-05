import React, { useState } from 'react';
import { CartItemType, OrderRecord } from '../types/bakery';
import { BAKERY_INFO } from '../data/bakeryData';
import { X, Check, MapPin, Calendar, Clock, CreditCard, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemType[];
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('10:00 AM - 12:00 PM');
  const [paymentOption, setPaymentOption] = useState<'card_online' | 'pay_at_pickup'>('card_online');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [specialNote, setSpecialNote] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const deliveryFee = fulfillmentType === 'delivery' ? 12.0 : 0;
  const grandTotal = subtotal + tax + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNum = `MD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderRecord = {
        orderNumber: orderNum,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName,
        customerEmail,
        customerPhone,
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'delivery' ? `${streetAddress}, Postal: ${postalCode}` : undefined,
        pickupDate,
        pickupTime,
        specialInstructions: specialNote,
        items: [...cartItems],
        subtotal,
        tax,
        deliveryFee,
        total: grandTotal,
        status: 'received',
      };

      // Save to localStorage history
      try {
        const stored = localStorage.getItem('maison_doree_orders');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newOrder);
        localStorage.setItem('maison_doree_orders', JSON.stringify(list));
      } catch (err) {
        // ignore storage error
      }

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
    }, 700);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] border border-[#ebdcd0] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
        {/* Modal Header */}
        <div className="p-6 bg-white border-b border-[#ebdcd0] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold">
              Maison Dorée Atelier Checkout
            </span>
            <h2 className="text-2xl font-serif-display font-bold text-[#231f1d]">
              {confirmedOrder ? 'Order Confirmed & Atelier Receipt' : 'Complete Your Custom Order'}
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

        {/* Modal Body */}
        {confirmedOrder ? (
          /* ============= ORDER RECEIPT CONFIRMATION STATE ============= */
          <div className="p-6 md:p-8 space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-sm">Thank You, {confirmedOrder.customerName}!</div>
                <p>
                  Your order <span className="font-mono font-bold text-emerald-900">{confirmedOrder.orderNumber}</span> has been confirmed.
                  Our bakers have scheduled your bake cycle for {confirmedOrder.pickupDate}.
                </p>
              </div>
            </div>

            {/* Official Receipt Box */}
            <div className="bg-white border border-[#ebdcd0] rounded-xl p-6 space-y-4 print:border-none print:shadow-none">
              <div className="flex justify-between items-start pb-4 border-b border-[#f0e6dc]">
                <div>
                  <div className="font-serif-display text-xl font-bold text-[#231f1d]">
                    Maison Dorée Artisanal Bakery
                  </div>
                  <div className="text-xs text-[#736353]">{BAKERY_INFO.address}</div>
                  <div className="text-xs text-[#736353]">{BAKERY_INFO.phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-[#231f1d]">
                    {confirmedOrder.orderNumber}
                  </div>
                  <div className="text-xs text-[#736353]">{confirmedOrder.createdAt}</div>
                  <div className="inline-block px-2 py-0.5 mt-1 bg-amber-100 text-amber-900 text-[11px] font-semibold rounded">
                    Status: Order Received & Queued
                  </div>
                </div>
              </div>

              {/* Fulfillment Spec */}
              <div className="grid grid-cols-2 gap-4 text-xs text-[#524438] bg-[#fbf9f5] p-3 rounded-lg border border-[#eee4d7]">
                <div>
                  <span className="font-bold text-[#231f1d] block">
                    {confirmedOrder.fulfillmentType === 'pickup' ? 'Counter Pickup' : 'Courier Delivery'}
                  </span>
                  <div>Date: {confirmedOrder.pickupDate}</div>
                  <div>Window: {confirmedOrder.pickupTime}</div>
                </div>
                <div>
                  <span className="font-bold text-[#231f1d] block">Recipient</span>
                  <div>{confirmedOrder.customerName}</div>
                  <div>{confirmedOrder.customerPhone}</div>
                  {confirmedOrder.deliveryAddress && <div>{confirmedOrder.deliveryAddress}</div>}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-[#231f1d] pb-1 border-b border-[#f4ede4]">
                  Itemized Order Details
                </div>
                {confirmedOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <div>
                      <span className="font-semibold text-[#231f1d]">
                        {it.quantity}x {it.title}
                      </span>
                      <div className="text-[11px] text-[#78695b]">{it.subtitle}</div>
                    </div>
                    <span className="font-bold tabular-nums text-[#231f1d]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-3 border-t border-[#f0e6dc] space-y-1 text-xs text-[#6e5f52]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold">${confirmedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State & Local Bakery Tax (8.25%)</span>
                  <span className="tabular-nums font-semibold">${confirmedOrder.tax.toFixed(2)}</span>
                </div>
                {confirmedOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Local Courier Delivery</span>
                    <span className="tabular-nums font-semibold">${confirmedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#231f1d] pt-2 border-t border-[#ebdcd0]">
                  <span>Total Paid / Authorized</span>
                  <span className="tabular-nums font-serif-display text-lg">
                    ${confirmedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 border border-[#d6c7b5] text-xs font-semibold rounded-lg text-[#231f1d] hover:bg-white transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#231f1d] text-[#faf6f0] text-xs font-semibold rounded-lg hover:bg-[#3d342e] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ============= CHECKOUT FORM ============= */
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
            {/* Fulfillment Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#231f1d] uppercase tracking-wider">
                1. Delivery or Bakery Counter Pickup
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-start gap-2.5 ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#231f1d] bg-white ring-1 ring-[#231f1d]'
                      : 'border-[#ebdcd0] hover:border-[#bda893] bg-[#fbf9f6]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#8a7258] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#231f1d]">Counter Pickup (Free)</div>
                    <div className="text-[11px] text-[#736353]">142 Artisan Row, Mill District</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-start gap-2.5 ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#231f1d] bg-white ring-1 ring-[#231f1d]'
                      : 'border-[#ebdcd0] hover:border-[#bda893] bg-[#fbf9f6]'
                  }`}
                >
                  <Clock className="w-4 h-4 text-[#8a7258] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#231f1d]">Local Courier (+$12.00)</div>
                    <div className="text-[11px] text-[#736353]">Temperature-controlled van (within 12 mi)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Contact Verification Form */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#231f1d] uppercase tracking-wider">
                2. Customer Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] text-[#5e5043] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Claire Bennett"
                    className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] text-[#5e5043] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="claire@example.com"
                    className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] text-[#5e5043] mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 234-5678"
                    className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                  />
                </div>
              </div>

              {fulfillmentType === 'delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-[#5e5043] mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#5e5043] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="94107"
                      className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time Window confirmation */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#231f1d] uppercase tracking-wider">
                3. Fulfillment Schedule
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#5e5043] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#5e5043] mb-1">Time Slot Window</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d6c7b5] rounded-lg text-xs bg-white text-[#29221d]"
                  >
                    <option value="08:30 AM - 10:30 AM">08:30 AM – 10:30 AM (Morning Batch)</option>
                    <option value="10:30 AM - 12:30 PM">10:30 AM – 12:30 PM (Midday)</option>
                    <option value="12:30 PM - 02:30 PM">12:30 PM – 02:30 PM (Afternoon)</option>
                    <option value="02:30 PM - 04:00 PM">02:30 PM – 04:00 PM (Late Collection)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#231f1d] uppercase tracking-wider">
                4. Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentOption('card_online')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    paymentOption === 'card_online'
                      ? 'border-[#231f1d] bg-white ring-1 ring-[#231f1d] font-bold text-[#231f1d]'
                      : 'border-[#ebdcd0] hover:border-[#bda893] bg-[#fbf9f6] text-[#695d52]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#8a7258]" />
                  <span>Card / Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('pay_at_pickup')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    paymentOption === 'pay_at_pickup'
                      ? 'border-[#231f1d] bg-white ring-1 ring-[#231f1d] font-bold text-[#231f1d]'
                      : 'border-[#ebdcd0] hover:border-[#bda893] bg-[#fbf9f6] text-[#695d52]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#8a7258]" />
                  <span>Pay Upon Counter Pickup</span>
                </button>
              </div>

              {paymentOption === 'card_online' && (
                <div className="p-3 bg-white border border-[#ebdcd0] rounded-xl grid grid-cols-3 gap-2 text-xs">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-[11px] text-[#635547] mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#d6c7b5] rounded-md font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#635547] mb-1">Exp & CVC</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-1/2 px-2 py-1.5 border border-[#d6c7b5] rounded-md font-mono text-xs text-center"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-1/2 px-2 py-1.5 border border-[#d6c7b5] rounded-md font-mono text-xs text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-white border border-[#ebdcd0] rounded-xl space-y-2 text-xs text-[#6e5f52]">
              <div className="flex justify-between">
                <span>Items Subtotal ({cartItems.length} lines)</span>
                <span className="tabular-nums font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Bakery Tax (8.25%)</span>
                <span className="tabular-nums font-semibold">${tax.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Courier Delivery Fee</span>
                  <span className="tabular-nums font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#ebdcd0] flex justify-between text-sm font-bold text-[#231f1d]">
                <span>Total Amount</span>
                <span className="tabular-nums font-serif-display text-xl">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#231f1d] hover:bg-[#3d342e] text-[#faf6f0] text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting to Bakery Hearth...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Custom Bakery Order (${grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
