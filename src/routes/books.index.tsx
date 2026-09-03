import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { books, genres } from "@/lib/books";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "title";

type BookSearch = {
  q?: string | undefined;
  genre?: string | undefined;
  sort?: SortOption | undefined;
  under?: number | undefined;
};

const sorts = [
  { value: "featured", label: "Our picks" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "title", label: "Title A–Z" },
] as const;

const priceBands = [15, 20, 25, 35] as const;

export const Route = createFileRoute("/books/")({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    const sort = String(search["sort"] ?? "");
    const under = Number(search["under"]);
    return {
      q: search["q"] ? String(search["q"]) : undefined,
      genre: genres.includes(String(search["genre"])) ? String(search["genre"]) : undefined,
      sort: sorts.some((s) => s.value === sort) ? (sort as SortOption) : undefined,
      under: Number.isFinite(under) && under > 0 ? under : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop All Books — Leaf & Lore Bookstore" },
      {
        name: "description",
        content:
          "Search and filter 24 hand-picked titles by genre, price and rating — fiction, poetry, mystery, nature writing, cookbooks and children's books.",
      },
      { property: "og:title", content: "Shop All Books — Leaf & Lore Bookstore" },
      {
        property: "og:description",
        content: "Search and filter 24 hand-picked titles by genre, price and rating.",
      },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { q = "", genre, sort = "featured", under } = Route.useSearch();
  const navigate = useNavigate({ from: "/books/" });

  const update = (patch: BookSearch) =>
    navigate({
      search: (prev: BookSearch) => ({ ...prev, ...patch }),
      resetScroll: false,
    });

  const query = q.trim().toLowerCase();
  let results = books.filter((book) => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.blurb.toLowerCase().includes(query);
    const matchesGenre = !genre || book.genre === genre;
    const matchesPrice = !under || book.price <= under;
    return matchesQuery && matchesGenre && matchesPrice;
  });

  results = [...results].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating;
    }
  });

  const filtered = !!query || !!genre || !!under;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header>
        <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">
          The shelves
        </p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] leading-tight font-semibold">
          Every book we stock
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Twenty-four titles, each one read by a bookseller here. Search, filter, or simply browse.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-card p-5 shadow-paper">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
              Refine
            </div>

            <div className="mt-5">
              <label htmlFor="book-search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative mt-2">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="book-search"
                  type="search"
                  value={q}
                  placeholder="Title, author, theme…"
                  className="pl-9"
                  onChange={(e) => update({ q: e.target.value || undefined })}
                />
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium">Genre</legend>
              <ul className="mt-2 space-y-1">
                {genres.map((g) => {
                  const active = genre === g;
                  return (
                    <li key={g}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => update({ genre: active ? undefined : g })}
                        className={`focus-ring w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {g}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium">Price</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {priceBands.map((band) => {
                  const active = under === band;
                  return (
                    <button
                      key={band}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ under: active ? undefined : band })}
                      className={`focus-ring rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      Under ${band}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {filtered && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-6 w-full"
                onClick={() => navigate({ search: {}, resetScroll: false })}
              >
                <X className="size-4" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "book" : "books"}
              {genre ? ` in ${genre}` : ""}
              {query ? ` matching “${q}”` : ""}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => update({ sort: e.target.value as SortOption })}
                className="focus-ring rounded-sm border border-input bg-card px-3 py-1.5 text-sm"
              >
                {sorts.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="mt-16 rounded-md border border-dashed border-border py-16 text-center">
              <h2 className="text-xl">No books on that shelf</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search, or browse everything.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/books" search={{}}>
                  Show all books
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
