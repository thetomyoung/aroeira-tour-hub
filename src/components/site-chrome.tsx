import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

const LINKS = [
  { to: "/", label: "Hub" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/scores", label: "Enter Scores" },
  { to: "/scorecards", label: "Scorecards" },
  { to: "/draw", label: "Draw Night" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Gallery" },
  { to: "/slander", label: "Slander Wall" },
  { to: "/admin", label: "Admin" },
] as const;


export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Logo className="size-10" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-wide">
              SBF Golf Tour 2027
            </span>
            <span className="block truncate text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
              Lisbon
            </span>
          </span>
        </Link>


        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid size-10 shrink-0 place-items-center rounded-full border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border/60 px-4 pb-4 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 text-center">
      <div className="rule-gold mx-auto mb-6 max-w-xs" />
      <Logo className="mx-auto size-16" />
      <p className="mt-4 font-display text-2xl tracking-wide text-gilded">SBF Golf Tour 2027</p>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Aroeira · Lisbon · Portugal
      </p>
    </footer>
  );
}

