import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Plane,
  Bus,
  Hotel,
  Flag,
  Beer,
  Utensils,
  Moon,
  Coffee,
  Car,
  Search,
  Sun,
  Luggage,
  Martini,
  MapPin,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { AGENDA, KAILUA_IMAGES, type AgendaItem } from "@/lib/tour";

const ICONS: Record<string, typeof Plane> = {
  plane: Plane,
  bus: Bus,
  hotel: Hotel,
  flag: Flag,
  beer: Beer,
  utensils: Utensils,
  moon: Moon,
  coffee: Coffee,
  car: Car,
  search: Search,
  sun: Sun,
  luggage: Luggage,
  martini: Martini,
};

function KailuaItem({ item }: { item: AgendaItem }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-secondary/40">
      <div className="grid grid-cols-3 gap-1 p-1">
        {KAILUA_IMAGES.map((img, i) => (
          <motion.img
            key={img.src}
            src={img.src}
            alt={`Kailua Fonte da Telha — ${img.label}`}
            loading="lazy"
            width={1280}
            height={864}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`h-24 w-full rounded-xl object-cover sm:h-32 ${i === 0 ? "col-span-3 h-40 sm:h-56" : ""}`}
          />
        ))}
      </div>
      {item.detail && <p className="px-3 pb-2 text-xs text-muted-foreground">{item.detail}</p>}
      <a
        href="https://www.google.com/maps/search/?api=1&query=Kailua+Fonte+da+Telha+Portugal"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-3 pb-3 text-xs uppercase tracking-[0.2em] text-primary"
      >
        <MapPin className="size-3.5" />
        Open in Maps
      </a>
    </div>
  );
}


function BidetItem({ item }: { item: AgendaItem }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="mt-2 rounded-xl border border-dashed border-primary/40 bg-secondary/40 p-3">
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"
      >
        {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {shown ? "Hide the evidence" : "Reveal the evidence"}
      </button>
      <AnimatePresence>
        {shown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ scale: 0.4, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 12 }}
              className="pt-3 text-5xl"
              aria-label="A suspicious discovery"
            >
              💩
            </motion.p>
            <p className="pt-1 text-xs italic text-muted-foreground">{item.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgendaTimeline() {
  const [open, setOpen] = useState<string | null>(AGENDA[0]!.id);

  return (
    <div className="grid gap-4">
      {AGENDA.map((day, dayIndex) => {
        const isOpen = open === day.id;
        return (
          <motion.article
            key={day.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: dayIndex * 0.06 }}
            className="glass overflow-hidden rounded-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : day.id)}
              className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 text-left"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/40 font-display text-xl text-primary">
                {dayIndex + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-2xl tracking-wide">{day.title}</span>
                <span className="block truncate text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {day.date}
                </span>
              </span>
              <ChevronDown
                className={`size-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <ol className="border-t border-border/60 px-5 py-4">
                    {day.items.map((item, i) => {
                      const Icon = ICONS[item.icon] ?? Flag;
                      return (
                        <motion.li
                          key={item.title}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-5 last:pb-1"
                        >
                          <span className="relative flex flex-col items-center">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                              <Icon className="size-4" />
                            </span>
                            {i < day.items.length - 1 && (
                              <span className="mt-1 w-px flex-1 bg-border" />
                            )}
                          </span>
                          <span className="min-w-0 pt-1.5">
                            {item.time && (
                              <span className="mr-2 font-display text-lg text-primary">{item.time}</span>
                            )}
                            <span className="text-sm text-foreground/90">{item.title}</span>
                            {item.special === "bidet" && <BidetItem item={item} />}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
