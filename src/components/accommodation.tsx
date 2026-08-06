import { motion } from "motion/react";
import {
  Bed,
  Waves,
  Utensils,
  Martini,
  Flower,
  Dumbbell,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { HOTEL, TOUR } from "@/lib/tour";
import { Lightbox, useLightbox } from "./lightbox";

const ICONS: Record<string, typeof Bed> = {
  bed: Bed,
  waves: Waves,
  utensils: Utensils,
  martini: Martini,
  flower: Flower,
  dumbbell: Dumbbell,
};

export function Accommodation() {
  const lb = useLightbox();
  const images = HOTEL.images.map((src) => ({ src, caption: HOTEL.name }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="glass overflow-hidden rounded-2xl"
      >
        <button type="button" onClick={() => lb.open(0)} className="relative block w-full">
          <img
            src={HOTEL.images[0]!}
            alt={HOTEL.name}
            loading="lazy"
            width={1920}
            height={1280}
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="night-fade absolute inset-0" />
          <div className="absolute bottom-4 left-5 right-5 text-left">
            <p className="eyebrow">Base camp</p>
            <h3 className="font-display text-4xl leading-tight text-gilded">{HOTEL.name}</h3>
          </div>
        </button>

        <div className="p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">{HOTEL.blurb}</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {HOTEL.images.map((src, i) => (
              <button key={src} type="button" onClick={() => lb.open(i)}>
                <img
                  src={src}
                  alt={`${HOTEL.name} gallery ${i + 1}`}
                  loading="lazy"
                  className="h-16 w-full rounded-lg object-cover transition-opacity hover:opacity-80 sm:h-20"
                />
              </button>
            ))}
          </div>
          <a
            href={TOUR.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display text-base tracking-wider text-primary-foreground"
          >
            <MapPin className="size-4" /> Open in Google Maps <ExternalLink className="size-3.5" />
          </a>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {HOTEL.facilities.map((f, i) => {
          const Icon = ICONS[f.icon] ?? Bed;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-4"
            >
              <Icon className="size-5 text-primary" strokeWidth={1.5} />
              <p className="mt-3 font-display text-xl tracking-wide">{f.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.detail}</p>
            </motion.div>
          );
        })}
        <div className="glass overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <iframe
            title="Aroeira Lisbon Hotel map"
            loading="lazy"
            className="h-52 w-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-9.26%2C38.49%2C-9.17%2C38.54&layer=mapnik&marker=38.5167%2C-9.2167"
          />
        </div>
      </div>

      <Lightbox images={images} index={lb.index} onClose={lb.close} onNavigate={lb.navigate} />
    </div>
  );
}
