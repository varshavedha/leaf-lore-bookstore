import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { books, findBook, formatPrice } from "@/lib/books";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/books/$bookId")({
  loader: ({ params }) => {
    const book = findBook(params.bookId);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book not found — Leaf & Lore" }, { name: "robots", content: "noindex" }],
      };
    }
    const { book } = loaderData;
    const title = `${book.title} by ${book.author} — Leaf & Lore`;
    return {
      meta: [
        { title },
        { name: "description", content: book.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: book.blurb },
        { property: "og:type", content: "book" },
      ],
    };
  },
  component: BookDetail,
});

function BookDetail() {
  const { book } = Route.useLoaderData();
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  const related = books
    .filter((b) => b.id !== book.id && b.genre === book.genre)
    .slice(0, 3)
    .concat(books.filter((b) => b.id !== book.id && b.genre !== book.genre).slice(0, 3))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to="/books"
        search={{}}
        className="focus-ring inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to the shelves
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[18rem] lg:max-w-none">
          <BookCover book={book} className="shadow-lifted" />
        </div>

        <div>
          <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">
            {book.genre} · {book.year}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-semibold text-balance">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">by {book.author}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-gilt text-gilt" aria-hidden="true" />
              <span className="font-medium">{book.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">/ 5</span>
            </span>
            <span className="text-border" aria-hidden="true">
              |
            </span>
            <span className="text-muted-foreground">
              {book.format} · {book.pages} pages
            </span>
          </div>

          <p className="mt-6 text-lg leading-relaxed font-display">{book.blurb}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{book.description}</p>

          <div className="mt-8 rounded-md border border-border bg-card p-5 shadow-paper">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-display text-3xl font-semibold">{formatPrice(book.price)}</span>
              <div className="flex items-center gap-1 rounded-full border border-border p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="focus-ring flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span aria-live="polite" className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="focus-ring flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={() => {
                add(book.id, quantity);
                toast.success("Added to your bag", {
                  description: `${quantity} × ${book.title}`,
                });
              }}
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              Add to bag
            </Button>

            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4" aria-hidden="true" />
              Free shipping on orders over $50 · wrapped by hand
            </p>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl">If you liked this</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          {related.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
