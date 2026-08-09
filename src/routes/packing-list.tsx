import { createFileRoute } from "@tanstack/react-router";
import { Backpack, Check } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader, Reveal } from "@/components/section";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PACKING_ITEMS = [
  { label: "Golf tops", qty: "x3" },
  { label: "Golf shorts", qty: "x3" },
  { label: "Golf socks", qty: "x3" },
  { label: "Caps" },
  { label: "Boxers" },
  { label: "Golf shoes" },
  { label: "Dildo", nsfw: true },
  { label: "Trainers" },
  { label: "T-shirts" },
  { label: "Shorts" },
  { label: "Jeans / chinos", detail: "if desired" },
  { label: "Lube", nsfw: true },
  { label: "Flip flops" },
  { label: "Swimming shorts" },
  { label: "Vests", detail: "if you’re hench" },
  { label: "Sunglasses" },
  { label: "Golf watch" },
  { label: "Phone battery pack" },
  { label: "Speaker" },
  { label: "Chargers for everything" },
  { label: "Golf clubs" },
  { label: "Balls" },
  { label: "Range finder" },
  { label: "Glove" },
  { label: "Another dildo", nsfw: true },
  { label: "Usual toiletries", detail: "🧴" },
];

export const Route = createFileRoute("/packing-list")({
  head: () => ({
    meta: [
      { title: "Packing List | SBF Golf Tour 2027" },
      {
        name: "description",
        content: "The official packing list for the SBF Golf Tour 2027 in Aroeira, Lisbon. Don't forget your clubs, balls and chargers.",
      },
      { property: "og:title", content: "Packing List — SBF Golf Tour 2027" },
      { property: "og:description", content: "Everything you need to pack for Aroeira, Lisbon, Portugal." },
    ],
  }),
  component: PackingListPage,
});

function PackingListPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const progress = Math.round((checked.size / PACKING_ITEMS.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Travel Essentials"
        title="Packing List"
        intro="Tick items off as you throw them in the bag. Everything you need for four days in Portugal."
      />

      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Reveal>
          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <Backpack className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-2xl leading-none tracking-wide">{progress}% packed</p>
                  <p className="text-xs text-muted-foreground">
                    {checked.size} of {PACKING_ITEMS.length} items checked
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChecked(new Set())}
                className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-3">
          {PACKING_ITEMS.map((item, i) => {
            const isChecked = checked.has(item.label);
            return (
              <Reveal key={item.label} delay={i * 0.04}>
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  className={cn(
                    "glass flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all",
                    isChecked && "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                      isChecked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent"
                    )}
                  >
                    {isChecked && <Check className="size-3.5" strokeWidth={2.5} />}
                  </span>
                  <span className="flex-1">
                    <span className={cn("font-display text-lg tracking-wide", isChecked && "line-through")}>
                      {item.label}
                    </span>
                    {item.qty && <span className="ml-2 text-sm text-muted-foreground">{item.qty}</span>}
                    {item.detail && !item.qty && (
                      <span className="ml-2 text-sm text-muted-foreground">{item.detail}</span>
                    )}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
