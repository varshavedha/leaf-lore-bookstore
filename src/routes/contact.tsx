import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Visit or Contact Us — Leaf & Lore Bookstore" },
      {
        name: "description",
        content:
          "Opening hours, address and a message form for Leaf & Lore Bookstore on Wren Street — book searches, events and reading recommendations.",
      },
      { property: "og:title", content: "Visit or Contact Us — Leaf & Lore Bookstore" },
      {
        property: "og:description",
        content: "Find our opening hours, address and send us a message.",
      },
    ],
  }),
  component: ContactPage,
});

type Fields = { name: string; email: string; subject: string; message: string };

function ContactPage() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);

  const set =
    (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Record<keyof Fields, string>> = {};
    if (values.name.trim().length < 2) found.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(values.email.trim()))
      found.email = "Please enter a valid email address.";
    if (values.subject.trim().length < 3) found.subject = "Please add a short subject.";
    if (values.message.trim().length < 10)
      found.message = "A little more detail helps — at least 10 characters.";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setSent(true);
    setValues({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent", { description: "We reply within one working day." });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">Say hello</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] leading-tight font-semibold">
          Come in, or write to us
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Looking for a book we don't stock? Planning an event? Want a recommendation for someone
          impossible to buy for? Ask away.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} noValidate className="max-w-xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={values.name}
                onChange={set("name")}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="mt-1.5 bg-card"
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={set("email")}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-1.5 bg-card"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={values.subject}
                onChange={set("subject")}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                className="mt-1.5 bg-card"
              />
              {errors.subject && (
                <p id="subject-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.subject}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={values.message}
                onChange={set("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-1.5 bg-card"
              />
              {errors.message && (
                <p id="message-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg">
              <Send className="size-4" aria-hidden="true" />
              Send message
            </Button>
            {sent && (
              <p role="status" className="text-sm text-primary">
                Thank you — we'll reply within one working day.
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-8">
          <div className="rounded-md border border-border bg-card p-6 shadow-paper">
            <h2 className="text-lg">The shop</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  14 Wren Street
                  <br />
                  Norwich NR2 1AB
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  Mon–Sat 9am – 6pm
                  <br />
                  Sunday 11am – 4pm
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="tel:+441603000000" className="focus-ring hover:text-primary">
                  +44 1603 000 000
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="mailto:hello@leafandlore.example" className="focus-ring hover:text-primary">
                  hello@leafandlore.example
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-secondary/50 p-6">
            <NewsletterForm compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
