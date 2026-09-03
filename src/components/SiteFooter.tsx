import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold">Leaf &amp; Lore</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            An independent bookshop on Wren Street — reading recommendations, slow afternoons, and
            strong coffee since 2009.
          </p>
          <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/books" className="focus-ring hover:text-primary">
              Shop all books
            </Link>
            <Link to="/about" className="focus-ring hover:text-primary">
              Our story
            </Link>
            <Link to="/contact" className="focus-ring hover:text-primary">
              Visit us
            </Link>
            <Link to="/cart" className="focus-ring hover:text-primary">
              Your bag
            </Link>
          </nav>
        </div>
        <div>
          <NewsletterForm compact />
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Leaf &amp; Lore Bookstore. A demonstration storefront.
      </div>
    </footer>
  );
}
