import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { books, type Book } from "./books";

export type CartLine = { id: string; quantity: number };

const STORAGE_KEY = "leaf-and-lore-cart-v1";
const SHIPPING_FLAT = 4.95;
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.06;

type CartContextValue = {
  lines: CartLine[];
  items: Array<{ book: Book; quantity: number; lineTotal: number }>;
  count: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  add: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.id === "string" && Number.isFinite(l.quantity))
      .map((l) => ({ id: l.id as string, quantity: Math.max(1, Math.min(99, Math.floor(l.quantity))) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, hydrated]);

  const add = useCallback((id: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, quantity: Math.min(99, l.quantity + quantity) } : l,
        );
      }
      return [...prev, { id, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(99, quantity) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((line) => {
        const book = books.find((b) => b.id === line.id);
        return book ? { book, quantity: line.quantity, lineTotal: book.price * line.quantity } : null;
      })
      .filter((v): v is { book: Book; quantity: number; lineTotal: number } => v !== null);

    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shipping,
      tax,
      total: Math.round((subtotal + shipping + tax) * 100) / 100,
      add,
      setQuantity,
      remove,
      clear,
      hydrated,
    };
  }, [lines, add, setQuantity, remove, clear, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
