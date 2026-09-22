-- LOHIX: everything pending, in order. Paste the whole thing into the Supabase SQL Editor and run once.
-- Runs as a single transaction: if anything fails, nothing is changed. Safe to run more than once.

BEGIN;

-- ======================================================================
-- 20260917120000_content_redesign_sync.sql
-- ======================================================================
-- Aligns stored CMS content with the redesigned site.
-- 1. Product page secondary CTA opens the "Where to buy" pop-up instead of the removed /#dealer anchor.
-- 2. Drops the unevidenced "Safety Certified" spec badge.
-- 3. Tidies the IP67 quick-stat label.
-- 4. Removes keys the site no longer reads (breadcrumb, cities marquee).

UPDATE public.site_content
SET data = data || jsonb_build_object(
  'ctaSecondary', jsonb_build_object('label', 'Where to buy', 'href', '#buy')
)
WHERE section = 'product'
  AND data->'ctaSecondary'->>'href' = '/#dealer';

UPDATE public.site_content
SET data = jsonb_set(
  data,
  '{specBadges}',
  COALESCE(
    (SELECT jsonb_agg(b) FROM jsonb_array_elements(data->'specBadges') b
     WHERE b->>'label' <> 'Safety Certified'),
    '[]'::jsonb
  )
)
WHERE section = 'product'
  AND jsonb_typeof(data->'specBadges') = 'array';

UPDATE public.site_content
SET data = jsonb_set(
  data,
  '{quickStats}',
  (SELECT jsonb_agg(
     CASE WHEN s->>'v' LIKE '%( Certification Pending)%'
          THEN jsonb_set(s, '{v}', to_jsonb(replace(s->>'v', '( Certification Pending)', '(certification pending)')))
          ELSE s END)
   FROM jsonb_array_elements(data->'quickStats') s)
)
WHERE section = 'product'
  AND jsonb_typeof(data->'quickStats') = 'array'
  AND jsonb_array_length(data->'quickStats') > 0;

UPDATE public.site_content
SET data = data - 'breadcrumb' - 'citiesLabel' - 'cities'
WHERE section IN ('product', 'about', 'dealer', 'specs');

-- 5. Dealer copy: no network or territory-protection claims.
UPDATE public.site_content
SET data = data || jsonb_build_object('heroEyebrow', 'Dealer partnership')
WHERE section = 'dealer'
  AND data->>'heroEyebrow' = 'Distributor network · Eastern India';

UPDATE public.site_content
SET data = jsonb_set(
  data,
  '{faqs}',
  (SELECT jsonb_agg(
     CASE WHEN f->>'q' = 'Are territories protected?'
          THEN jsonb_build_object(
            'q', 'How are territories handled?',
            'a', 'We agree the area you''ll serve with you during onboarding, so both sides are clear before you go live.')
          ELSE f END)
   FROM jsonb_array_elements(data->'faqs') f)
)
WHERE section = 'dealer'
  AND jsonb_typeof(data->'faqs') = 'array'
  AND jsonb_array_length(data->'faqs') > 0;

UPDATE public.site_content
SET data = data || jsonb_build_object(
  'body', 'Partner with LOHIX to sell smart LFP batteries in your city. Training, healthy margins, and on-ground support — built in.'
)
WHERE section = 'dealer_cta'
  AND data->>'body' LIKE '%distributor network%';

UPDATE public.site_content
SET data = jsonb_set(data, '{seo,title}', to_jsonb('Become a LOHIX Dealer — Partner Program'::text))
WHERE section = 'dealer'
  AND data->'seo'->>'title' = 'Become a LOHIX Dealer — Distributor Network';

-- 6. Production domain: point stored SEO canonicals and links at lohixenergy.com.
UPDATE public.site_content
SET data = replace(data::text, 'https://lohix.lovable.app', 'https://lohixenergy.com')::jsonb
WHERE data::text LIKE '%lohix.lovable.app%';

-- ======================================================================
-- 20260917140000_city_interest.sql
-- ======================================================================
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

-- Explicit table privileges (row-level security above still decides who can do what).
-- Visitors may only add rows; only signed-in admins can read or delete them.
GRANT INSERT ON public.city_interest TO anon, authenticated;
GRANT SELECT, DELETE ON public.city_interest TO authenticated;

CREATE INDEX IF NOT EXISTS idx_city_interest_created ON public.city_interest (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_city_interest_key ON public.city_interest (city_key);

-- ======================================================================
-- 20260920090000_landing_whole_range.sql
-- ======================================================================
-- Landing page speaks for the whole LOHIX range (e-rickshaw + 2W), not just the LOHIX 48.
-- Only the hero and engineered-specs sections are stored in the database; every other
-- landing section already follows the code defaults.

-- 1. Hero: subline, chip and secondary CTA cover both platforms.
UPDATE public.site_content
SET data = data || jsonb_build_object(
  'chipText', 'Register your LOHIX warranty',
  'subline', 'Smart LiFePO4 packs built in India — 51.2V for e-rickshaws, 60.8V and 64V for electric two-wheelers. Real BMS protection. Local service.',
  'ctaSecondary', jsonb_build_object('label', 'Explore the range', 'href', '/products'),
  'trustItems', jsonb_build_array(
    'Live BMS · 24/7',
    'Sealed design · certification pending',
    '5 models',
    'Made in India'
  )
)
WHERE section = 'hero';

-- 2. Engineered specs: nine tiles describing the range instead of a single pack.
--    Tile values stay short so they never overflow the tile on a small phone;
--    the spread across the range lives in the unit and body copy.
UPDATE public.site_content
SET data = data || jsonb_build_object(
  'headingHighlight', 'every LOHIX pack',
  'body', 'Nine engineering decisions shared across the range — from the 51.2V e-rickshaw pack to the 60.8V and 64V two-wheeler packs.',
  'items', jsonb_build_array(
    jsonb_build_object(
      'id', 'voltage', 'label', 'Voltage', 'value', '64', 'unit', 'V · from 51.2V',
      'title', 'A platform for every drivetrain',
      'body', '51.2V for e-rickshaw drive systems, 60.8V and 64V for electric two-wheelers.',
      'icon', 'Zap', 'category', 'Power'
    ),
    jsonb_build_object(
      'id', 'capacity', 'label', 'Capacity', 'value', '100', 'unit', 'Ah · from 30Ah',
      'title', 'Commuter to full shift',
      'body', '30Ah and 45Ah packs for two-wheelers, 100Ah for a full e-rickshaw shift.',
      'icon', 'Battery', 'category', 'Power'
    ),
    jsonb_build_object(
      'id', 'energy', 'label', 'Energy', 'value', '5.12', 'unit', 'kWh · from 1.8kWh',
      'title', 'Dense, efficient packs',
      'body', 'From 1824Wh in the compact 2W pack to 5.12kWh on the LOHIX 48.',
      'icon', 'Activity', 'category', 'Power'
    ),
    jsonb_build_object(
      'id', 'models', 'label', 'Range', 'value', '5', 'unit', 'models',
      'title', 'One range, two vehicle classes',
      'body', 'The LOHIX 48 for e-rickshaws, plus 60.8V and 64V packs in 30Ah and 45Ah for two-wheelers.',
      'icon', 'TrendingUp', 'category', 'Power'
    ),
    jsonb_build_object(
      'id', 'cycles', 'label', 'Cycles', 'value', '2500+', 'unit', 'every pack',
      'title', 'Years of daily duty',
      'body', '2500+ cycles across the 2W range, 3500+ on the LOHIX 48 — lead-acid manages about 500.',
      'icon', 'RefreshCw', 'category', 'Lifecycle'
    ),
    jsonb_build_object(
      'id', 'maintenance', 'label', 'Upkeep', 'value', 'Zero', 'unit', 'maintenance',
      'title', 'Nothing to top up',
      'body', 'Sealed LFP packs across the range — no watering, no acid checks, no seasonal servicing.',
      'icon', 'BadgeCheck', 'category', 'Lifecycle'
    ),
    jsonb_build_object(
      'id', 'ip', 'label', 'Ingress', 'value', 'Sealed', 'unit', 'design',
      'title', 'Built for monsoon roads',
      'body', 'An IP67 design standard on the LOHIX 48, dust- and splash-resistant enclosures across the 2W range. Third-party certification is pending.',
      'icon', 'Shield', 'category', 'Safety'
    ),
    jsonb_build_object(
      'id', 'bms', 'label', 'BMS', 'value', 'Smart', 'unit', 'multi-layer',
      'title', 'Real-time protection, every pack',
      'body', 'Multi-layer BMS on all five models: cell balancing, thermal cutoff, and fault telemetry — live.',
      'icon', 'Cpu', 'category', 'Safety'
    ),
    jsonb_build_object(
      'id', 'origin', 'label', 'Origin', 'value', 'Made', 'unit', 'in India',
      'title', 'Engineered in Kolkata',
      'body', 'Every pack assembled in West Bengal and serviced by a team that knows the routes it runs on.',
      'icon', 'MapPin', 'category', 'Origin'
    )
  )
)
WHERE section = 'features';

-- ======================================================================
-- 20260920100000_about_quality_principle.sql
-- ======================================================================
-- About page, "What we believe": the first principle now says we never compromise on quality
-- (and don't believe in compromise), replacing "Safety, never compromised".
-- Only that one card is touched; the other three principles and any edits to them are kept.

UPDATE public.site_content
SET data = jsonb_set(
  data,
  '{values}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN v->>'title' = 'Safety, never compromised'
        THEN jsonb_build_object(
          'icon', COALESCE(v->>'icon', 'ShieldCheck'),
          'title', 'We never compromise on quality',
          'body', 'Compromise isn''t something we believe in. LFP chemistry, a multi-layer BMS and a sealed enclosure design are engineered defaults, not upsells.'
        )
        ELSE v
      END
      ORDER BY ord
    )
    FROM jsonb_array_elements(data->'values') WITH ORDINALITY AS t(v, ord)
  )
)
WHERE section = 'about'
  AND jsonb_typeof(data->'values') = 'array'
  AND jsonb_array_length(data->'values') > 0;

-- ======================================================================
-- 20260922090000_dealer_enquiry_email.sql
-- ======================================================================
-- Dealer applications now collect an email address so the applicant can get an
-- automatic confirmation. Nullable, so enquiries received before this change stay valid.

ALTER TABLE public.dealer_enquiries
  ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.dealer_enquiries
  DROP CONSTRAINT IF EXISTS dealer_email_fmt;
ALTER TABLE public.dealer_enquiries
  ADD CONSTRAINT dealer_email_fmt CHECK (
    email IS NULL
    OR (char_length(email) BETWEEN 5 AND 160 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  );

COMMIT;
