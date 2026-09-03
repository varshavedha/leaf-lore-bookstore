import { Link } from "@tanstack/react-router";
import { Star, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { BookCover } from "./BookCover";
import { Button } from "@/components/ui/button";
import { formatPrice, type Book } from "@/lib/books";
import { useCart } from "@/lib/cart";

export function BookCard({ book }: { book: Book }) {
  const { add } = useCart();

  return (
    <article className="group relative flex flex-col">
      <Link
        to="/books/$bookId"
        params={{ bookId: book.id }}
        className="focus-ring block rounded-sm"
        aria-label={`View details for ${book.title}`}
      >
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-0.6deg] group-hover:shadow-lifted">
          <BookCover book={book} />
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
          {book.genre}
        </p>
        <h3 className="mt-1.5 text-base leading-snug">
          <Link
            to="/books/$bookId"
            params={{ bookId: book.id }}
            className="focus-ring decoration-primary/40 underline-offset-4 hover:underline"
          >
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="font-display text-lg font-semibold">{formatPrice(book.price)}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Star className="size-3.5 fill-gilt text-gilt" aria-hidden="true" />
            <span className="sr-only">Rating</span>
            {book.rating.toFixed(1)}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => {
            add(book.id);
            toast.success("Added to your bag", { description: book.title });
          }}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Add to bag
        </Button>
      </div>
    </article>
  );
}
