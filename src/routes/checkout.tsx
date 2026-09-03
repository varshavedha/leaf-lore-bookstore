import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/books";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Leaf & Lore Bookstore" },
      {
        name: "description",
        content: "Enter your delivery and payment details to complete your Leaf & Lore book order.",
      },
      { property: "og:title", content: "Checkout — Leaf & Lore Bookstore" },
      { property: "og:description", content: "Complete your book order at Leaf & Lore." },
    ],
  }),
  component: CheckoutPage,
});

type Fields = {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  card: string;
  expiry: string;
  cvc: string;
};

const empty: Fields = {
  name: "",
  email: "",
  address: "",
  city: "",
  postcode: "",
  card: "",
  expiry: "",
  cvc: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.address.trim().length < 5) errors.address = "Please enter your street address.";
  if (values.city.trim().length < 2) errors.city = "Please enter your city.";
  if (!/^[a-z0-9][a-z0-9\s-]{2,9}$/i.test(values.postcode.trim()))
    errors.postcode = "Please enter a valid postal code.";
  if (values.card.replace(/\s/g, "").length < 15 || !/^\d+$/.test(values.card.replace(/\s/g, "")))
    errors.card = "Enter a 16-digit card number.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry.trim()))
    errors.expiry = "Use MM/YY format.";
  if (!/^\d{3,4}$/.test(values.cvc.trim())) errors.cvc = "3 or 4 digits.";
  return errors;
}

function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, count, clear, hydrated } = useCart();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [order, setOrder] = useState<{ id: string; total: number; items: number; email: string } | null>(
    null,
  );

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0] ?? "")?.focus();
      return;
    }
    setOrder({
      id: `LL-${Math.floor(100000 + Math.random() * 899999)}`,
      total,
      items: count,
      email: values.email.trim(),
    });
    clear();
    setValues(empty);
  }

  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold">
          Thank you — your books are on their way
        </h1>
        <p className="mt-4 text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.id}</span> for{" "}
          {order.items} {order.items === 1 ? "book" : "books"}, totalling{" "}
          <span className="font-medium text-foreground">{formatPrice(order.total)}</span>. A
          confirmation is on its way to {order.email}.
        </p>
        <div className="mt-8 rounded-md border border-border bg-card p-6 text-left shadow-paper">
          <h2 className="text-lg">What happens next</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. We wrap your order by hand in recycled paper.</li>
            <li>2. It ships within two working days from Wren Street.</li>
            <li>3. A hand-written note goes in the parcel — no extra charge.</li>
          </ol>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/books" search={{}}>
              Keep browsing
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">Add a book to your bag and come back.</p>
        <Button asChild className="mt-6">
          <Link to="/books" search={{}}>
            Browse the shelves
          </Link>
        </Button>
      </div>
    );
  }

  const field = (
    key: keyof Fields,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className="mt-1.5 bg-card"
        {...props}
      />
      {errors[key] && (
        <p id={`${key}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold">Checkout</h1>
      <p className="mt-3 text-muted-foreground">
        This is a demonstration store — no payment is taken and no card details are stored.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} noValidate className="space-y-10">
          <fieldset>
            <legend className="font-display text-xl font-semibold">Delivery details</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {field("name", "Full name", { autoComplete: "name", placeholder: "Ada Wren" })}
              </div>
              <div className="sm:col-span-2">
                {field("email", "Email address", {
                  type: "email",
                  autoComplete: "email",
                  placeholder: "reader@example.com",
                })}
              </div>
              <div className="sm:col-span-2">
                {field("address", "Street address", {
                  autoComplete: "street-address",
                  placeholder: "14 Wren Street",
                })}
              </div>
              {field("city", "City", { autoComplete: "address-level2", placeholder: "Norwich" })}
              {field("postcode", "Postal code", {
                autoComplete: "postal-code",
                placeholder: "NR2 1AB",
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl font-semibold">Payment</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {field("card", "Card number", {
                  inputMode: "numeric",
                  autoComplete: "cc-number",
                  placeholder: "4242 4242 4242 4242",
                })}
              </div>
              {field("expiry", "Expiry (MM/YY)", {
                autoComplete: "cc-exp",
                placeholder: "04/29",
              })}
              {field("cvc", "CVC", { inputMode: "numeric", autoComplete: "cc-csc", placeholder: "123" })}
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <Lock className="size-4" aria-hidden="true" />
            Place order · {formatPrice(total)}
          </Button>
        </form>

        <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-card p-6 shadow-paper">
            <h2 className="text-xl">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map(({ book, quantity, lineTotal }) => (
                <li key={book.id} className="flex justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate">{book.title}</span>
                    <span className="text-muted-foreground">× {quantity}</span>
                  </span>
                  <span className="shrink-0">{formatPrice(lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
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
            <Link
              to="/cart"
              className="focus-ring mt-5 inline-block text-sm text-muted-foreground hover:text-primary"
            >
              Edit your bag
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
