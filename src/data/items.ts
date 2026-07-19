import type { PackingItem } from '../types';

// The packing list — 40 items, ordered: documents → tech → toiletries → clothes.
// To add / remove / rename an item, edit THIS file (and add a drawing in
// illustrations.tsx if a new one is needed). Never rename an `id` once the app
// is live — it is the localStorage key, so renaming drops a user's saved checkmark.
export const PACKING_ITEMS: PackingItem[] = [
  // ── Documents & money ──
  { id: 'passport', label: 'Passport', illu: 'passport' },
  { id: 'wallet', label: 'Wallet', illu: 'wallet' },
  { id: 'cash', label: 'Cash', illu: 'cash' },
  { id: 'keys', label: 'Keys', illu: 'keys' },

  // ── Tech & accessories ──
  { id: 'phone', label: 'Phone', illu: 'phone' },
  { id: 'iphone-charger', label: 'iPhone charger', illu: 'charger' },
  { id: 'iphone-cable', label: 'iPhone cable', illu: 'cable' },
  { id: 'airpods', label: 'AirPods', illu: 'earbuds' },
  { id: 'adapter', label: 'Adapter', illu: 'adapter' },
  { id: 'power-bank', label: 'Power bank', illu: 'powerbank' },
  { id: 'camera', label: 'Camera', illu: 'camera' },
  { id: 'sunglasses', label: 'Sunglasses', illu: 'sunglasses' },
  { id: 'umbrella', label: 'Umbrella', illu: 'umbrella' },
  { id: 'laptop', label: 'Laptop', illu: 'laptop' },
  { id: 'laptop-charger', label: 'Laptop charger', illu: 'laptopcharger' },
  { id: 'usb-hub', label: 'USB hub', illu: 'hub' },
  { id: 'mouse', label: 'Mouse', illu: 'mouse' },

  // ── Toiletries & care ──
  { id: 'toothbrush', label: 'Toothbrush', illu: 'toothbrush' },
  { id: 'toothpaste', label: 'Toothpaste', illu: 'toothpaste' },
  { id: 'deodorant', label: 'Deodorant', illu: 'deodorant' },
  { id: 'perfume', label: 'Perfume', illu: 'perfume' },
  { id: 'razor', label: 'Razor', illu: 'razor' },
  { id: 'hairbrush', label: 'Hairbrush', illu: 'hairbrush' },
  { id: 'hair-tie', label: 'Hair tie', illu: 'hairtie' },
  { id: 'hair-products', label: 'Hair products', illu: 'hairproducts' },
  { id: 'face-moisturizer', label: 'Face moisturizer', illu: 'facemoist' },
  { id: 'body-moisturizer', label: 'Body moisturizer', illu: 'bodymoist' },
  { id: 'face-sunscreen', label: 'Face sunscreen', illu: 'sunscreen' },
  { id: 'body-sunscreen', label: 'Body sunscreen', illu: 'bodysun' },
  { id: 'eye-sunscreen', label: 'Eye sunscreen', illu: 'eyesun' },
  { id: 'sunblock-pills', label: 'Sunblock pills', illu: 'pills' },

  // ── Clothes ──
  { id: 'underwear', label: 'Underwear', illu: 'underwear' },
  { id: 'socks', label: 'Socks', illu: 'socks' },
  { id: 'outfits', label: 'Outfits', illu: 'outfits' },
  { id: 'pajamas', label: 'Pajamas', illu: 'pyjamas' },
  { id: 'gym-clothes', label: 'Gym clothes', illu: 'gymclothes' },
  { id: 'nice-shoes', label: 'Nice shoes', illu: 'shoes' },
  { id: 'sneakers', label: 'Sneakers', illu: 'sneakers' },
  { id: 'cap', label: 'Cap', illu: 'cap' },
  { id: 'bags', label: 'Bags', illu: 'duffel' },
];
