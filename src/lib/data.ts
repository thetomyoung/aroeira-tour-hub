import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Player, Score } from "./golf";

export type Fixture = {
  id: string;
  round_no: number;
  format: string;
  side_a: string[];
  side_b: string[];
  tee_time: string | null;
  result: string | null;
  sort_order: number;
};

export type TeamRow = { id: string; player_id: string; team: string; is_captain: boolean };
export type Award = {
  id: string;
  kind: string;
  round_no: number;
  player_id: string | null;
  detail: string | null;
  value: number | null;
};
export type Photo = { id: string; url: string; caption: string | null; trip_year: number };

export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase.from("players").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Player[];
    },
  });
}

export function useScores() {
  return useQuery({
    queryKey: ["scores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scores").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as Score[];
    },
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as TeamRow[];
    },
  });
}

export function useFixtures() {
  return useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fixtures").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Fixture[];
    },
  });
}

export function useAwards() {
  return useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("awards").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as Award[];
    },
  });
}

export function usePhotos() {
  return useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Photo[];
    },
  });
}

export function useSetting<T>(key: string, fallback: T) {
  const query = useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data?.value ?? fallback) as T;
    },
  });
  return { ...query, value: (query.data ?? fallback) as T };
}

export function useSaveSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value: value as never }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["settings", v.key] }),
  });
}

/** Keeps scores + players live across every device on the trip. */
export function useLiveSync() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("tour-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, () =>
        qc.invalidateQueries({ queryKey: ["scores"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () =>
        qc.invalidateQueries({ queryKey: ["players"] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}
