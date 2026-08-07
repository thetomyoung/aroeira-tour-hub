import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Trophy } from "lucide-react";
import { HERO_SLIDES, TOUR } from "@/lib/tour";
import { Logo } from "@/components/logo";


function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass-gold rounded-xl px-2 py-3 text-center sm:px-5 sm:py-4">
      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={value}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-display text-3xl leading-none tabular-nums text-gilded sm:text-5xl"
          >
            {String(value).padStart(2, "0")}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-[0.55rem] uppercase tracking-[0.24em] text-muted-foreground sm:text-[0.65rem]">
        {label}
      </p>
    </div>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const { days, hours, minutes, seconds } = useCountdown(TOUR.startISO);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={HERO_SLIDES[index]!.src}
          alt={HERO_SLIDES[index]!.label}
          width={1920}
          height={1280}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-background/45" />
      <div className="night-fade absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo className="size-20 sm:size-28" />
          <p className="eyebrow mt-4">{TOUR.dates}</p>
          <h1 className="mt-4 text-[3rem] leading-[0.88] sm:text-8xl lg:text-[8rem]">
            <span className="text-gilded">SBF Golf Tour 2027</span>
          </h1>
          <p className="mt-3 max-w-xl text-base uppercase tracking-[0.22em] text-foreground/85 sm:text-lg">
            Aroeira, Lisbon, Portugal
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 grid max-w-md grid-cols-4 gap-2 sm:gap-3"
        >
          <Unit value={days} label="Days" />
          <Unit value={hours} label="Hours" />
          <Unit value={minutes} label="Mins" />
          <Unit value={seconds} label="Secs" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/leaderboard"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display text-lg tracking-wider text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Trophy className="size-4" />
            View Leaderboard
          </Link>
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {HERO_SLIDES[index]!.label}
          </span>
        </motion.div>
      </div>

      <div className="mx-auto mb-6 flex w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-label={s.label}
            onClick={() => setIndex(i)}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              i === index ? "bg-primary" : "bg-foreground/25"
            }`}
          />
        ))}
      </div>

      <ChevronDown className="mx-auto mb-6 size-5 animate-bounce text-muted-foreground" />
    </section>
  );
}
