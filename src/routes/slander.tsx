import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Send, ShieldOff } from "lucide-react";
import { PageHeader } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/slander")({
  head: () => ({
    meta: [
      { title: "Slander Wall — SBF Golf Tour 2027, Lisbon" },
      {
        name: "description",
        content:
          "Anonymous trash talk for the SBF Golf Tour 2027. Nothing is stored, nothing is logged — posts vanish the moment you leave.",
      },
      { property: "og:title", content: "Slander Wall — SBF Golf Tour 2027" },
      { property: "og:description", content: "Anonymous, unstored trash talk for the Lisbon tour." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SlanderPage,
});

type Shout = { id: string; text: string; at: number; mine: boolean };

const ALIASES = ["Anonymous Hacker", "Shanks McGee", "Bandit Handicap", "Range Rat", "Bunker Dweller", "Three Putt"];

function SlanderPage() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [text, setText] = useState("");
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase.channel("slander-wall", { config: { broadcast: { self: false } } });
    channel
      .on("broadcast", { event: "shout" }, ({ payload }) => {
        const body = String((payload as { text?: string })?.text ?? "").slice(0, 240);
        if (!body) return;
        setShouts((prev) => [{ id: crypto.randomUUID(), text: body, at: Date.now(), mine: false }, ...prev].slice(0, 60));
      })
      .subscribe();
    channelRef.current = channel;
    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim().slice(0, 240);
    if (!body) return;
    void channelRef.current?.send({ type: "broadcast", event: "shout", payload: { text: body } });
    setShouts((prev) => [{ id: crypto.randomUUID(), text: body, at: Date.now(), mine: true }, ...prev].slice(0, 60));
    setText("");
  };

  return (
    <>
      <PageHeader
        eyebrow="No names, no records"
        title="Slander Wall"
        intro="Anonymous trash talk that lives only in this browser session. Nothing is saved to the database, nothing is logged, and everything disappears on refresh."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <div className="glass-gold flex items-start gap-3 rounded-2xl p-4 text-xs text-muted-foreground">
          <ShieldOff className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            Posts are broadcast live to anyone with this page open and are never stored. Keep it funny — the handicaps
            are already punishment enough.
          </p>
        </div>

        <form onSubmit={send} className="glass flex items-center gap-2 rounded-2xl p-3">
          <input
            value={text}
            maxLength={240}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say the unsayable…"
            className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Post anonymously"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
          >
            <Send className="size-4" />
          </button>
        </form>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {shouts.map((s, i) => (
              <motion.article
                key={s.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                  <Flame className="size-3 text-gold" />
                  {s.mine ? "You (anonymous)" : ALIASES[i % ALIASES.length]}
                  <span className="ml-auto normal-case tracking-normal">
                    {new Date(s.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
              </motion.article>
            ))}
          </AnimatePresence>
          {!shouts.length && (
            <p className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
              Wall's empty. Someone has to go first.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
