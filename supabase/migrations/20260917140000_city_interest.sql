-- Cities entered in the "Tell us where you operate" step on /dealer.
-- Holds no personal data: only the city typed, where it was typed, and when.

CREATE TABLE IF NOT EXISTS public.city_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  -- Lower-cased, whitespace-collapsed key so "Siliguri" and " siliguri " group together.
  city_key TEXT GENERATED ALWAYS AS (lower(regexp_replace(btrim(city), '\s+', ' ', 'g'))) STORED,
  source TEXT NOT NULL DEFAULT 'dealer_city_step',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT city_interest_city_len CHECK (char_length(btrim(city)) BETWEEN 2 AND 60),
  CONSTRAINT city_interest_source_len CHECK (char_length(source) BETWEEN 1 AND 60)
);

ALTER TABLE public.city_interest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can record city interest" ON public.city_interest;
CREATE POLICY "Anyone can record city interest" ON public.city_interest
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(city)) BETWEEN 2 AND 60
    AND char_length(source) BETWEEN 1 AND 60
  );

DROP POLICY IF EXISTS "Admins can view city interest" ON public.city_interest;
CREATE POLICY "Admins can view city interest" ON public.city_interest
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete city interest" ON public.city_interest;
CREATE POLICY "Admins can delete city interest" ON public.city_interest
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_city_interest_created ON public.city_interest (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_city_interest_key ON public.city_interest (city_key);
