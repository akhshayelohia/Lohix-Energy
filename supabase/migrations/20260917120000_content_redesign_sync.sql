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
