import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: { src: string; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  return (
    <AnimatePresence>
      {index !== null && images[index] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background/95 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.img
            key={index}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={images[index]!.src}
            alt={images[index]!.caption ?? "Trip photo"}
            className="max-h-[80svh] w-auto max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images[index]!.caption && (
            <p className="mt-4 text-sm text-muted-foreground">{images[index]!.caption}</p>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 grid size-11 place-items-center rounded-full border border-border bg-card/70"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-3 grid size-11 place-items-center rounded-full border border-border bg-card/70"
          >
            <ChevronRight className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null);
  return { index, open: setIndex, close: () => setIndex(null), navigate: setIndex };
}
