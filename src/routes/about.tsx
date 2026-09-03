import { createFileRoute, Link } from "@tanstack/react-router";
import storyImage from "@/assets/story-leaf.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Leaf & Lore Bookstore" },
      {
        name: "description",
        content:
          "How Leaf & Lore grew from a market stall into an independent bookshop on Wren Street, and how we choose every book we sell.",
      },
      { property: "og:title", content: "Our Story — Leaf & Lore Bookstore" },
      {
        property: "og:description",
        content: "From a market stall to a bookshop on Wren Street — how we choose our books.",
      },
    ],
  }),
  component: AboutPage,
});

const milestones = [
  { year: "2009", text: "A trestle table at the Saturday market, forty second-hand paperbacks." },
  { year: "2013", text: "The Wren Street shop opens, with one shelf and a great deal of optimism." },
  { year: "2018", text: "The reading room and the green chair arrive. Nobody has left since." },
  { year: "2024", text: "Our monthly letter, Marginalia, passes four thousand readers." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">Our story</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] leading-tight font-semibold text-balance">
          Fifteen years of pressing books into people's hands
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Leaf &amp; Lore began as a market stall and never quite lost the habit: talk to the reader,
          find the book, wrap it carefully, and hope they come back to tell you about it.
        </p>
      </header>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
        <img
          src={storyImage}
          alt="An open book with pressed leaves beside a cup of tea on linen"
          width={1200}
          height={900}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-md object-cover shadow-paper"
        />
        <div>
          <h2 className="text-2xl">How a book gets on our shelves</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Someone here reads it. That is the whole rule. If nobody on the team can finish it, it
            does not get stocked — which is why we carry twenty-four titles rather than twenty-four
            thousand, and why the staff cards under each book are handwritten.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We buy from small presses wherever we can, print our own bookmarks on offcuts, and post
            everything in recycled paper. Nothing here is sponsored placement.
          </p>
          <Button asChild className="mt-7">
            <Link to="/books" search={{}}>
              See what we're stocking
            </Link>
          </Button>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl">A short timeline</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <li
              key={m.year}
              className="rounded-md border border-border bg-card p-5 shadow-paper transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-display text-2xl font-semibold text-primary">{m.year}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
