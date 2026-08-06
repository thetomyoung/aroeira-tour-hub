import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24", className)}>
      {(eyebrow || title) && (
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 max-w-2xl"
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && (
            <h2 className="mt-3 text-4xl leading-none sm:text-5xl">
              <span className="text-gilded">{title}</span>
            </h2>
          )}
          {intro && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>}
        </motion.header>
      )}
      {children}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="border-b border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-36">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-5xl leading-none sm:text-6xl">
          <span className="text-gilded">{title}</span>
        </h1>
        {intro && <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{intro}</p>}
      </div>
    </div>
  );
}
