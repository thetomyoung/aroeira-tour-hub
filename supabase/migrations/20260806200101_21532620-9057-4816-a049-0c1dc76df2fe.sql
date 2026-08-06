CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  handicap numeric NOT NULL DEFAULT 18,
  handicap_index numeric NOT NULL DEFAULT 18,
  photo_url text,
  driving_distance integer NOT NULL DEFAULT 240,
  previous_wins integer NOT NULL DEFAULT 0,
  ryder_record text NOT NULL DEFAULT '0-0-0',
  favourite_club text NOT NULL DEFAULT '7 Iron',
  current_form text NOT NULL DEFAULT 'Steady',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  round_no integer NOT NULL,
  hole integer NOT NULL,
  gross integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (player_id, round_no, hole)
);

CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  team text NOT NULL,
  is_captain boolean NOT NULL DEFAULT false,
  UNIQUE (player_id)
);

CREATE TABLE public.fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_no integer NOT NULL DEFAULT 1,
  format text NOT NULL DEFAULT 'Fourball',
  side_a text[] NOT NULL DEFAULT '{}',
  side_b text[] NOT NULL DEFAULT '{}',
  tee_time text,
  result text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  round_no integer NOT NULL DEFAULT 1,
  player_id uuid REFERENCES public.players(id) ON DELETE CASCADE,
  detail text,
  value numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text,
  trip_year integer NOT NULL DEFAULT 2027,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scores TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixtures TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.awards TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO anon, authenticated;
GRANT ALL ON public.players, public.scores, public.teams, public.fixtures, public.awards, public.photos, public.settings TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public access players" ON public.players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access scores" ON public.scores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access teams" ON public.teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access fixtures" ON public.fixtures FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access awards" ON public.awards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access photos" ON public.photos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public access settings" ON public.settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

INSERT INTO public.settings (key, value) VALUES
  ('admin', '{"passcode":"aroeira2027"}'::jsonb),
  ('weather', '{"lat":38.5167,"lon":-9.2167,"label":"Aroeira, Portugal"}'::jsonb);

INSERT INTO public.players (name, handicap, handicap_index, driving_distance, previous_wins, ryder_record, favourite_club, current_form, sort_order) VALUES
  ('Percy', 12, 12.4, 262, 2, '5-3-1', 'Driver', 'Red hot', 1),
  ('James', 8, 8.1, 278, 1, '4-4-2', '4 Iron', 'Solid', 2),
  ('Tom', 16, 16.7, 245, 0, '2-6-1', 'Pitching Wedge', 'Improving', 3),
  ('Olly', 21, 21.3, 231, 0, '1-7-0', 'Putter', 'Streaky', 4),
  ('Dan', 14, 14.2, 255, 1, '3-5-1', '3 Wood', 'Steady', 5),
  ('Chris', 6, 6.3, 289, 3, '7-2-0', 'Driver', 'Ominous', 6),
  ('Sam', 18, 18.9, 238, 0, '2-5-2', '9 Iron', 'Erratic', 7),
  ('Alex', 10, 10.5, 268, 1, '4-3-2', '5 Iron', 'Rising', 8);