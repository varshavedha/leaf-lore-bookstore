import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/books";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Leaf & Lore Bookstore" },
      {
        name: "description",
        content: "Review the books in your bag, adjust quantities and see your order total.",
      },
      { property: "og:title", content: "Your Bag — Leaf & Lore Bookstore" },
      { property: "og:description", content: "Review your books and continue to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, tax, total, count, setQuantity, remove, clear, hydrated } =
    useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold">Your bag</h1>
      <p className="mt-3 text-muted-foreground" aria-live="polite">
        {hydrated ? `${count} ${count === 1 ? "book" : "books"} ready to wrap.` : "Loading your bag…"}
      </p>

      {hydrated && items.length === 0 ? (
        <div className="mt-12 rounded-md border border-dashed border-border py-20 text-center">
          <ShoppingBag className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 text-xl">Your bag is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are twenty-four books waiting to be picked up.
          </p>
          <Button asChild className="mt-6">
            <Link to="/books" search={{}}>
              Browse the shelves
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map(({ book, quantity, lineTotal }) => (
              <li key={book.id} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  to="/books/$bookId"
                  params={{ bookId: book.id }}
                  className="focus-ring w-20 shrink-0 sm:w-24"
                >
                  <BookCover book={book} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-base leading-snug">
                        <Link
                          to="/books/$bookId"
                          params={{ bookId: book.id }}
                          className="focus-ring underline-offset-4 hover:underline"
                        >
                          {book.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {book.author} · {book.format}
                      </p>
                    </div>
                    <p className="font-display text-lg font-semibold">{formatPrice(lineTotal)}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                    <div className="flex items-center gap-1 rounded-full border border-border p-1">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${book.title}`}
                        onClick={() => setQuantity(book.id, quantity - 1)}
                        className="focus-ring flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${book.title}`}
                        onClick={() => setQuantity(book.id, quantity + 1)}
                        className="focus-ring flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(book.price)} each
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        remove(book.id);
                        toast("Removed from bag", { description: book.title });
                      }}
                      className="focus-ring ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-border bg-card p-6 shadow-paper">
              <h2 className="text-xl">Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated tax</dt>
                  <dd>{formatPrice(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="font-display text-lg">{formatPrice(total)}</dd>
                </div>
              </dl>

              {remaining > 0 && (
                <p className="mt-4 rounded-sm bg-primary/8 px-3 py-2 text-xs text-primary">
                  Add {formatPrice(remaining)} more for free shipping.
                </p>
              )}

              <Button asChild size="lg" className="mt-6 w-full">
                <Link to="/checkout">
                  Checkout
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="mt-3 flex items-center justify-between text-sm">
                <Link to="/books" search={{}} className="focus-ring hover:text-primary">
                  Keep browsing
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    toast("Bag emptied");
                  }}
                  className="focus-ring text-muted-foreground hover:text-destructive"
                >
                  Empty bag
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
