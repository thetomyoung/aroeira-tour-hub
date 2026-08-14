import { supabase } from "@/integrations/supabase/client";

const MAX_BYTES = 15 * 1024 * 1024; // 15MB, generous for an iPhone photo
const BUCKET = "trip-photos";

/** Uploads an image file (e.g. from an iPhone camera roll or camera) and returns its public URL. */
export async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That image is too large (15MB max)");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
