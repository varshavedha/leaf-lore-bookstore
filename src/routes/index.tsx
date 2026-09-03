import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Leaf, Truck } from "lucide-react";
import heroImage from "@/assets/hero-bookstore.jpg";
import storyImage from "@/assets/story-leaf.jpg";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { books, genres } from "@/lib/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leaf & Lore Bookstore — Hand-Picked Books, Warmly Chosen" },
      {
        name: "description",
        content:
          "Browse hand-picked fiction, poetry, nature writing and cookbooks from Leaf & Lore, an independent bookstore. Free shipping on orders over $50.",
      },
      { property: "og:title", content: "Leaf & Lore Bookstore — Hand-Picked Books" },
      {
        property: "og:description",
        content:
          "An independent bookshop on Wren Street: fiction, poetry, nature writing and cookbooks chosen by hand.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = books.filter((b) => b.featured).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[0.7rem] tracking-[0.2em] text-primary uppercase">
              <Leaf className="size-3.5" aria-hidden="true" />
              Est. 2009 · Wren Street
            </p>
            <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.02] font-semibold text-balance">
              Books chosen the slow way.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Every title on these shelves was read by someone who works here. No algorithms, no
              front-of-store deals — just twenty-four books we would press into your hands in person.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/books">
                  Browse the shelves
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                to="/about"
                className="focus-ring text-sm underline decoration-primary/40 underline-offset-4 hover:text-primary"
              >
                Read our story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 -rotate-1 rounded-md bg-primary/8" aria-hidden="true" />
            <img
              src={heroImage}
              alt="The interior of Leaf & Lore bookstore: walnut shelves, a green velvet chair and a brass reading lamp"
              width={1600}
              height={1104}
              className="relative aspect-[4/3] w-full rounded-md object-cover shadow-lifted"
            />
          </div>
        </div>
      </section>

      <section aria-label="Shop promises" className="border-b border-border/70 bg-secondary/40">
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { icon: BookOpen, title: "Read before shelved", text: "Staff notes on every title." },
            { icon: Truck, title: "Free shipping over $50", text: "Wrapped in recycled paper." },
            { icon: Leaf, title: "Independent since 2009", text: "One shop, no chains." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl">This season's table</h2>
            <p className="mt-2 text-muted-foreground">Eight books we keep recommending out loud.</p>
          </div>
          <Link
            to="/books"
            className="focus-ring group inline-flex items-center gap-2 text-sm text-primary"
          >
            All 24 titles
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/60 paper-grain">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl">Browse by shelf</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {genres.map((genre) => (
              <li key={genre}>
                <Link
                  to="/books"
                  search={{ genre }}
                  className="focus-ring inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  {genre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        <img
          src={storyImage}
          alt="An open book with pressed leaves beside a cup of tea on linen"
          width={1200}
          height={900}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-md object-cover shadow-paper"
        />
        <div>
          <h2 className="text-3xl sm:text-4xl text-balance">
            A reading room that happens to sell books
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Come in for one thing and leave two hours later with three. There is always a pot of tea
            on, the green chair by the poetry section is first-come, and the dog is friendly.
          </p>
          <Button asChild variant="outline" className="mt-7">
            <Link to="/contact">Plan a visit</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
