import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, MapPinned, Ruler, Waves, Target, Lightbulb } from "lucide-react";
import type { Course, Hole } from "@/lib/tour";

export function HoleMap({ course }: { course: Course }) {
  const [active, setActive] = useState<Hole | null>(null);

  return (
    <>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
        {course.holes.map((hole) => (
          <button
            key={hole.hole}
            type="button"
            onClick={() => setActive(hole)}
            className="group rounded-lg border border-border/70 bg-secondary/50 py-2 text-center transition-colors hover:border-primary/60 hover:bg-secondary"
          >
            <span className="block font-display text-lg leading-none text-foreground group-hover:text-primary">
              {hole.hole}
            </span>
            <span className="block text-[0.55rem] uppercase tracking-widest text-muted-foreground">
              par {hole.par}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-gold max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-2xl"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={`${course.name} hole ${active.hole}`}
                  loading="lazy"
                  className="h-44 w-full rounded-t-2xl object-cover"
                />
                <div className="night-fade absolute inset-0 rounded-t-2xl" />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setActive(null)}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-border bg-background/70"
                >
                  <X className="size-4" />
                </button>
                <div className="absolute bottom-3 left-4">
                  <p className="eyebrow">{course.name}</p>
                  <p className="font-display text-4xl leading-none text-gilded">Hole {active.hole}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-border/40">
                <Cell label="Par" value={String(active.par)} />
                <Cell label="Yards" value={String(active.yards)} />
                <Cell label="Stroke index" value={String(active.si)} />
              </div>

              <div className="space-y-4 p-5 text-sm">
                <Detail icon={Waves} label="Hazards" text={active.hazards} />
                <Detail icon={Target} label="Green" text={active.green} />
                <Detail icon={Lightbulb} label="Tip" text={active.tip} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/60 px-3 py-3 text-center">
      <p className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-display text-2xl text-primary">{value}</p>
    </div>
  );
}

function Detail({ icon: Icon, label, text }: { icon: typeof Waves; label: string; text: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="text-foreground/90">{text}</p>
      </div>
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  function downloadScorecard() {
    const rows = [
      ["Hole", "Par", "SI", "Yards"],
      ...course.holes.map((h) => [h.hole, h.par, h.si, h.yards]),
      ["Total", course.par, "", course.yardage],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.id}-scorecard.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          loading="lazy"
          width={1920}
          height={1280}
          className="h-56 w-full object-cover"
        />
        <div className="night-fade absolute inset-0" />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="eyebrow">{course.subtitle}</p>
          <h3 className="font-display text-3xl leading-tight text-gilded">{course.name}</h3>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-px bg-border/40">
        <Cell label="Rating" value={course.rating.toFixed(1)} />
        <Cell label="Slope" value={String(course.slope)} />
        <Cell label="Par" value={String(course.par)} />
        <Cell label="Yards" value={course.yardage.toLocaleString()} />
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{course.blurb}</p>

        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
            <MapPinned className="size-3.5 text-primary" /> Interactive hole map — tap a hole
          </p>
          <HoleMap course={course} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadScorecard}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-base tracking-wider text-primary-foreground"
          >
            <Download className="size-4" /> Download scorecard
          </button>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.name + " flyover")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Ruler className="size-4" /> Hole flyovers
          </a>
        </div>
      </div>
    </motion.article>
  );
}
