CREATE TABLE public.round_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  round_no integer NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (player_id, round_no)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.round_totals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.round_totals TO authenticated;
GRANT ALL ON public.round_totals TO service_role;
ALTER TABLE public.round_totals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public access round_totals" ON public.round_totals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.round_totals;