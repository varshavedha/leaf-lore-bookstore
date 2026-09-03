import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setDone(true);
    setEmail("");
    toast.success("You're on the list", {
      description: "Look out for our monthly Marginalia letter.",
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className={compact ? "" : "max-w-md"}>
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        Join Marginalia, our monthly letter
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          placeholder="reader@example.com"
          autoComplete="email"
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : "newsletter-hint"}
          onChange={(e) => {
            setEmail(e.target.value);
            setDone(false);
          }}
          className="bg-card"
        />
        <Button type="submit" className="shrink-0">
          Subscribe
        </Button>
      </div>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id="newsletter-hint" className="mt-2 text-sm text-muted-foreground">
          {done ? "Thank you — your first letter arrives on the 1st." : "One letter a month. No spam, ever."}
        </p>
      )}
    </form>
  );
}
