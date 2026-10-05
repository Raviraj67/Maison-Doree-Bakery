export type TierOption = {
  id: string;
  name: string;
  diameterDesc: string;
  servingsDesc: string;
  servingsCount: number;
  tiersCount: 1 | 2 | 3;
  basePrice: number;
  recommendation: string;
};

export type FlavorOption = {
  id: string;
  name: string;
  category: 'classic' | 'botanical' | 'signature';
  description: string;
  spongeColor: string;
  priceDelta: number;
  dietaryNotes?: string;
};

export type FillingOption = {
  id: string;
  name: string;
  description: string;
  fillingColor: string;
  priceDelta: number;
};

export type FinishOption = {
  id: string;
  name: string;
  description: string;
  texture: 'semi-naked' | 'ribbed' | 'smooth' | 'lambeth' | 'ganache-drip';
  priceDelta: number;
};

export type ColorPalette = {
  id: string;
  name: string;
  primaryHex: string;
  accentHex: string;
  description: string;
};

export type ToppingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'florals' | 'edible_metals' | 'fruits' | 'piping';
};

export type DietaryOption = 'standard' | 'gluten_friendly' | 'vegan';

export type CustomCakeOrder = {
  tierId: string;
  spongeId: string;
  fillingId: string;
  finishId: string;
  paletteId: string;
  toppingIds: string[];
  pipingMessage: string;
  pipingStyle: 'script' | 'modern';
  pipingColor: string;
  dietary: DietaryOption;
  fulfillmentType: 'pickup' | 'delivery';
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
  calculatedPrice: number;
};

export type PastryItem = {
  id: string;
  name: string;
  frenchName?: string;
  category: 'croissant' | 'tart' | 'brioche' | 'cookie' | 'choux';
  description: string;
  singlePrice: number;
  image: string;
  dietary?: string[];
};

export type CustomPastryBox = {
  size: 6 | 12;
  items: { pastryId: string; quantity: number }[];
  calculatedPrice: number;
  boxStyle: 'gift_ribbon' | 'classic_bakery';
  customGiftNote: string;
};

export type DailyMenuItem = {
  id: string;
  name: string;
  category: 'hearth_breads' | 'morning_viennoiserie' | 'patisserie_desserts' | 'savory';
  frenchSubtitle?: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  dietary: string[];
  allergens: string[];
  preparationTimeNote: string;
};

export type CartItemType =
  | {
      id: string;
      type: 'custom_cake';
      title: string;
      subtitle: string;
      price: number;
      quantity: number;
      details: CustomCakeOrder;
      image?: string;
    }
  | {
      id: string;
      type: 'pastry_box';
      title: string;
      subtitle: string;
      price: number;
      quantity: number;
      details: CustomPastryBox;
      image?: string;
    }
  | {
      id: string;
      type: 'daily_bake';
      title: string;
      subtitle: string;
      price: number;
      quantity: number;
      item: DailyMenuItem;
      sliceOption?: 'whole' | 'thick_sliced' | 'thin_sliced';
    };

export type OrderRecord = {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
  items: CartItemType[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'baking' | 'decorating' | 'ready' | 'completed';
};
