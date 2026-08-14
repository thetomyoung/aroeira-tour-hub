import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/section";
import { Lightbox, useLightbox } from "@/components/lightbox";
import { usePhotos } from "@/lib/data";
import { uploadPhoto } from "@/lib/upload";
import { GALLERY_IMAGES } from "@/lib/tour";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — SBF Golf Tour 2027, Aroeira" },
      {
        name: "description",
        content:
          "Photos from the SBF Golf Tour 2027 at Aroeira and previous trips. Add your own shots from the course and the night out.",
      },
      { property: "og:title", content: "Photo Gallery — SBF Golf Tour 2027" },
      {
        property: "og:description",
        content: "The trip in pictures — courses, clubhouse, terrace and everything after dark.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const qc = useQueryClient();
  const { data: photos = [] } = usePhotos();
  const [tab, setTab] = useState<2027 | 2026>(2027);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const lb = useLightbox();

  const add = useMutation({
    mutationFn: async (file: File) => {
      const publicUrl = await uploadPhoto(file);
      const { error } = await supabase
        .from("photos")
        .insert({ url: publicUrl, caption: caption.trim().slice(0, 120) || null, trip_year: tab });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos"] });
      setCaption("");
      toast.success("Photo added");
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setUploading(false),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    add.mutate(file);
  };

  const uploaded = photos
    .filter((p) => p.trip_year === tab)
    .map((p) => ({ src: p.url, caption: p.caption ?? undefined }));
  const seeds = tab === 2027 ? GALLERY_IMAGES.map((g) => ({ src: g.src, caption: g.label })) : [];
  const images = [...uploaded, ...seeds];

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The Trip In Pictures"
        intro="Tap any image to open the lightbox."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {[2027, 2026].map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setTab(year as 2027 | 2026)}
              className={`rounded-full px-5 py-2 font-display tracking-wider ${
                tab === year
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {year === 2027 ? "2027 Trip" : "Previous Trips"}
            </button>
          ))}
        </div>

        <div className="glass mb-8 grid gap-3 rounded-2xl p-5 sm:grid-cols-[1fr_auto]">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={120}
            placeholder="Caption (optional)"
            className="rounded-xl border border-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display tracking-wider text-primary-foreground disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Uploading…" : "Add photo"}
          </button>
        </div>

        <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
          {images.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => lb.open(i)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl"
            >
              <img
                src={img.src}
                alt={img.caption ?? "Trip photo"}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
        {!images.length && (
          <p className="text-sm text-muted-foreground">No photos yet for this trip.</p>
        )}
      </div>

      <Lightbox images={images} index={lb.index} onClose={lb.close} onNavigate={lb.navigate} />
    </>
  );
}
