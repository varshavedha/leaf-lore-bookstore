import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Shop" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, hydrated } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20">
        <Link to="/" className="focus-ring flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-4.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight">Leaf &amp; Lore</span>
            <span className="text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              Bookstore
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative rounded-sm px-3 py-2 text-sm transition-colors after:absolute after:bottom-1 after:left-3 after:h-px after:bg-primary after:transition-all after:duration-300 hover:text-primary ${
                  active
                    ? "text-primary after:w-[calc(100%-1.5rem)]"
                    : "text-foreground/80 after:w-0 hover:after:w-[calc(100%-1.5rem)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="focus-ring relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors hover:bg-secondary"
            aria-label={`Shopping bag, ${hydrated ? count : 0} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">Bag</span>
            {hydrated && count > 0 && (
              <span className="absolute -top-0.5 right-1 flex size-5 items-center justify-center rounded-full bg-accent text-[0.65rem] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="focus-ring inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu className="size-5 hidden" /> : null}
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border/70 bg-card md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="focus-ring block border-b border-border/50 py-3 text-sm last:border-0 hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
