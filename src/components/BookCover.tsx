import { cn } from "@/lib/utils";
import type { Book } from "@/lib/books";

export function BookCover({ book, className }: { book: Book; className?: string }) {
  const { spine, face, ink } = book.palette;

  return (
    <div
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author}`}
      className={cn(
        "relative isolate flex aspect-[2/3] w-full overflow-hidden rounded-sm shadow-paper",
        className,
      )}
      style={{ backgroundColor: face }}
    >
      <div className="h-full w-[9%] shrink-0" style={{ backgroundColor: spine }} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 15% 0%, rgba(255,255,255,0.22), transparent 60%)",
        }}
      />
      <div className="relative flex min-w-0 flex-1 flex-col justify-between p-[7%]">
        <div
          className="text-[0.5rem] font-semibold tracking-[0.28em] uppercase opacity-70 sm:text-[0.6rem]"
          style={{ color: ink }}
        >
          Leaf &amp; Lore
        </div>
        <div>
          <div
            className="font-display line-clamp-4 text-[clamp(0.8rem,1.5vw,1.35rem)] leading-[1.15] font-semibold break-words hyphens-auto text-balance"
            style={{ color: ink }}
          >
            {book.title}
          </div>
          <div
            className="mt-[6%] h-px w-8 opacity-60"
            style={{ backgroundColor: ink }}
            aria-hidden="true"
          />
          <div
            className="mt-[6%] line-clamp-2 text-[0.6rem] tracking-[0.14em] uppercase opacity-80 sm:text-[0.68rem]"
            style={{ color: ink }}
          >
            {book.author}
          </div>
        </div>
        <div
          className="truncate text-[0.55rem] tracking-[0.2em] uppercase opacity-60"
          style={{ color: ink }}
        >
          {book.genre}
        </div>
      </div>
    </div>
  );
}
