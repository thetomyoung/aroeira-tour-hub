import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Image, Loader2, Send, ShieldOff, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import { uploadPhoto } from "@/lib/upload";

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
      {
        property: "og:description",
        content: "Anonymous, unstored trash talk for the Lisbon tour.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SlanderPage,
});

type Shout = { id: string; text: string; image: string | null; at: number; mine: boolean };

const ALIASES = [
  "Anonymous Hacker",
  "Shanks McGee",
  "Bandit Handicap",
  "Range Rat",
  "Bunker Dweller",
  "Three Putt",
];

function SlanderPage() {
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const channel = supabase.channel("slander-wall", { config: { broadcast: { self: false } } });
    channel
      .on("broadcast", { event: "shout" }, ({ payload }) => {
        const body = String((payload as { text?: string })?.text ?? "").slice(0, 240);
        const img = String((payload as { image?: string })?.image ?? "").slice(0, 500);
        if (!body && !img) return;
        setShouts((prev) =>
          [
            {
              id: crypto.randomUUID(),
              text: body,
              image: img || null,
              at: Date.now(),
              mine: false,
            },
            ...prev,
          ].slice(0, 60),
        );
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
    const img = image.trim();
    if (!body && !img) return;
    void channelRef.current?.send({
      type: "broadcast",
      event: "shout",
      payload: { text: body, image: img || null },
    });
    setShouts((prev) =>
      [
        { id: crypto.randomUUID(), text: body, image: img || null, at: Date.now(), mine: true },
        ...prev,
      ].slice(0, 60),
    );
    setText("");
    setImage("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadPhoto(file);
      setImage(publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
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
            Posts are broadcast live to anyone with this page open and are never stored. Keep it
            funny — the handicaps are already punishment enough.
          </p>
        </div>

        <form onSubmit={send} className="glass space-y-2 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <input
              value={text}
              maxLength={240}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say the unsayable…"
              className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              aria-label="Add photo"
              className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-60 ${
                image ? "border-primary text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Image className="size-4" />
              )}
            </button>
            <button
              type="submit"
              aria-label="Post anonymously"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
              <Send className="size-4" />
            </button>
          </div>
          {image && (
            <div className="flex items-center gap-2">
              <img
                src={image}
                alt="Attachment preview"
                className="h-14 w-14 rounded-lg object-cover"
              />
              <span className="text-xs text-muted-foreground">Photo attached</span>
              <button
                type="button"
                onClick={() => setImage("")}
                aria-label="Remove photo"
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
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
                {s.text && <p className="mt-2 text-sm leading-relaxed">{s.text}</p>}
                {s.image && (
                  <img
                    src={s.image}
                    alt="Slander wall attachment"
                    loading="lazy"
                    className="mt-2 max-h-72 w-full rounded-xl object-cover"
                  />
                )}
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
