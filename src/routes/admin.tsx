import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, LogOut, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/section";
import { useAdmin } from "@/lib/admin";
import { usePlayers, useFixtures, usePhotos, useSetting, useSaveSetting, useRoundTotals, useSaveRoundTotal } from "@/lib/data";
import { ROUNDS } from "@/lib/tour";
import type { Player } from "@/lib/golf";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Organiser Admin — SBF Golf Tour 2027, Aroeira" },
      {
        name: "description",
        content: "Passcode-protected organiser tools for the SBF Golf Tour 2027: manage players, handicaps, tee times, fixtures, photos and the weather location.",
      },
      { property: "og:title", content: "Organiser Admin — SBF Golf Tour 2027" },
      { property: "og:description", content: "Tournament management tools for the trip organisers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, signIn, signOut } = useAdmin();
  const [code, setCode] = useState("");

  if (!isAdmin) {
    return (
      <>
        <PageHeader eyebrow="Organisers only" title="Admin" intro="Enter the organiser passcode to continue." />
        <div className="mx-auto max-w-md px-4 py-12">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await signIn(code);
              if (!ok) toast.error("Incorrect passcode");
            }}
            className="glass rounded-2xl p-6"
          >
            <Lock className="size-5 text-primary" />
            <label className="mt-4 block text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
              Passcode
            </label>
            <input
              type="password"
              value={code}
              maxLength={64}
              onChange={(e) => setCode(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-input/40 px-4 py-3 outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-primary px-6 py-3 font-display text-lg tracking-wider text-primary-foreground"
            >
              Unlock
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Organisers" title="Tournament Admin" intro="Everything the captains need to run the week." />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground"
        >
          <LogOut className="size-3.5" /> Lock admin
        </button>
        <RoundTotalsAdmin />
        <PlayersAdmin />
        <FixturesAdmin />
        <PhotosAdmin />
        <WeatherAdmin />
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const input =
  "w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary";

function RoundTotalsAdmin() {
  const { data: players = [] } = usePlayers();
  const { data: totals = [] } = useRoundTotals();
  const save = useSaveRoundTotal();
  const [round, setRound] = useState(ROUNDS[0]!.no);

  return (
    <Card title="Daily Stableford totals (Golf GameBook)">
      <p className="mb-4 text-xs text-muted-foreground">
        Enter one number per player after each round. The leaderboard, podium and all tournament stats update
        automatically.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {ROUNDS.map((r) => (
          <button
            key={r.no}
            type="button"
            onClick={() => setRound(r.no)}
            className={`rounded-full px-4 py-2 font-display text-base tracking-wider transition-colors ${
              round === r.no ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {players.map((p) => (
          <TotalRow
            key={p.id}
            name={p.name}
            value={totals.find((t) => t.player_id === p.id && t.round_no === round)?.points ?? null}
            onSave={(points) =>
              save.mutate(
                { player_id: p.id, round_no: round, points },
                { onSuccess: () => toast.success(`${p.name}: ${points} pts saved`) },
              )
            }
          />
        ))}
        {!players.length && <p className="text-sm text-muted-foreground">Add players first.</p>}
      </div>
    </Card>
  );
}

function TotalRow({
  name,
  value,
  onSave,
}: {
  name: string;
  value: number | null;
  onSave: (points: number) => void;
}) {
  const [draft, setDraft] = useState(value == null ? "" : String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value == null ? "" : String(value));
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={99}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-20 rounded-lg border border-border bg-input/40 px-3 py-2 text-right text-sm outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={() => onSave(Math.max(0, Math.min(99, Number(draft) || 0)))}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
        aria-label={`Save total for ${name}`}
      >
        <Save className="size-4" />
      </button>
    </div>
  );
}

function PlayersAdmin() {
  const qc = useQueryClient();
  const { data: players = [] } = usePlayers();
  const [draft, setDraft] = useState("");

  const save = useMutation({
    mutationFn: async (p: Player) => {
      const { error } = await supabase
        .from("players")
        .update({
          name: p.name,
          handicap: p.handicap,
          handicap_index: p.handicap_index,
          photo_url: p.photo_url,
          driving_distance: p.driving_distance,
          previous_wins: p.previous_wins,
          ryder_record: p.ryder_record,
          favourite_club: p.favourite_club,
          current_form: p.current_form,
        })
        .eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player updated");
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!draft.trim()) throw new Error("Name required");
      const { error } = await supabase
        .from("players")
        .insert({ name: draft.trim().slice(0, 40), sort_order: players.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["players"] });
      setDraft("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("players").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["players"] }),
  });

  return (
    <Card title="Players, handicaps & profiles">
      <div className="mb-4 flex gap-2">
        <input
          value={draft}
          maxLength={40}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New player name"
          className={input}
        />
        <button
          type="button"
          onClick={() => add.mutate()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {players.map((p) => (
          <PlayerRow key={p.id} player={p} onSave={(x) => save.mutate(x)} onDelete={() => remove.mutate(p.id)} />
        ))}
      </div>
    </Card>
  );
}

function PlayerRow({
  player,
  onSave,
  onDelete,
}: {
  player: Player;
  onSave: (p: Player) => void;
  onDelete: () => void;
}) {
  const [p, setP] = useState(player);
  const set = <K extends keyof Player>(k: K, v: Player[K]) => setP((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="grid gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 sm:grid-cols-4">
      <input className={input} value={p.name} maxLength={40} onChange={(e) => set("name", e.target.value)} />
      <input
        className={input}
        type="number"
        step="0.1"
        value={p.handicap}
        onChange={(e) => set("handicap", Number(e.target.value))}
        placeholder="Handicap"
      />
      <input
        className={input}
        type="number"
        step="0.1"
        value={p.handicap_index}
        onChange={(e) => set("handicap_index", Number(e.target.value))}
        placeholder="Index"
      />
      <input
        className={input}
        type="number"
        value={p.driving_distance}
        onChange={(e) => set("driving_distance", Number(e.target.value))}
        placeholder="Drive (yd)"
      />
      <input
        className={input}
        value={p.photo_url ?? ""}
        maxLength={500}
        onChange={(e) => set("photo_url", e.target.value || null)}
        placeholder="Photo URL"
      />
      <input
        className={input}
        value={p.ryder_record}
        maxLength={20}
        onChange={(e) => set("ryder_record", e.target.value)}
        placeholder="Ryder record"
      />
      <input
        className={input}
        value={p.favourite_club}
        maxLength={30}
        onChange={(e) => set("favourite_club", e.target.value)}
        placeholder="Favourite club"
      />
      <div className="flex gap-2">
        <input
          className={input}
          value={p.current_form}
          maxLength={30}
          onChange={(e) => set("current_form", e.target.value)}
          placeholder="Form"
        />
        <button
          type="button"
          onClick={() => onSave(p)}
          aria-label="Save player"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
        >
          <Save className="size-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete player"
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function FixturesAdmin() {
  const qc = useQueryClient();
  const { data: fixtures = [] } = useFixtures();

  const update = useMutation({
    mutationFn: async ({ id, tee_time, result }: { id: string; tee_time: string; result: string }) => {
      const { error } = await supabase
        .from("fixtures")
        .update({ tee_time, result: result || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fixtures"] });
      toast.success("Fixture updated");
    },
  });

  if (!fixtures.length) {
    return <Card title="Tee times & fixtures">Generate fixtures on Draw Night first.</Card>;
  }

  return (
    <Card title="Tee times & fixtures">
      <div className="space-y-2">
        {fixtures.map((f) => (
          <FixtureRow key={f.id} fixture={f} onSave={(tee, res) => update.mutate({ id: f.id, tee_time: tee, result: res })} />
        ))}
      </div>
    </Card>
  );
}

function FixtureRow({
  fixture,
  onSave,
}: {
  fixture: { id: string; round_no: number; side_a: string[]; side_b: string[]; tee_time: string | null; result: string | null };
  onSave: (tee: string, result: string) => void;
}) {
  const [tee, setTee] = useState(fixture.tee_time ?? "");
  const [result, setResult] = useState(fixture.result ?? "");
  return (
    <div className="grid items-center gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 sm:grid-cols-[minmax(0,1.6fr)_auto_auto_auto]">
      <p className="truncate text-sm">
        R{fixture.round_no}: {fixture.side_a.join(" & ")} v {fixture.side_b.join(" & ")}
      </p>
      <input className={input} value={tee} maxLength={5} onChange={(e) => setTee(e.target.value)} placeholder="Tee" />
      <input
        className={input}
        value={result}
        maxLength={20}
        onChange={(e) => setResult(e.target.value)}
        placeholder="Result e.g. 3&2"
      />
      <button
        type="button"
        onClick={() => onSave(tee, result)}
        className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Save
      </button>
    </div>
  );
}

function PhotosAdmin() {
  const qc = useQueryClient();
  const { data: photos = [] } = usePhotos();
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });

  return (
    <Card title="Uploaded photos">
      {photos.length ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.url} alt={p.caption ?? "Photo"} loading="lazy" className="h-20 w-full rounded-lg object-cover" />
              <button
                type="button"
                aria-label="Delete photo"
                onClick={() => remove.mutate(p.id)}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80 text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No uploads yet — add them from the Gallery page.</p>
      )}
    </Card>
  );
}

function WeatherAdmin() {
  const { value } = useSetting("weather", { lat: 38.5167, lon: -9.2167, label: "Aroeira, Portugal" });
  const saveSetting = useSaveSetting();
  const [form, setForm] = useState(value);

  return (
    <Card title="Weather location">
      <div className="grid gap-2 sm:grid-cols-4">
        <input
          className={input}
          value={form.label}
          maxLength={60}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Label"
        />
        <input
          className={input}
          type="number"
          step="0.0001"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
          placeholder="Latitude"
        />
        <input
          className={input}
          type="number"
          step="0.0001"
          value={form.lon}
          onChange={(e) => setForm({ ...form, lon: Number(e.target.value) })}
          placeholder="Longitude"
        />
        <button
          type="button"
          onClick={() =>
            saveSetting.mutate(
              { key: "weather", value: form },
              { onSuccess: () => toast.success("Weather location saved") },
            )
          }
          className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Save
        </button>
      </div>
    </Card>
  );
}
