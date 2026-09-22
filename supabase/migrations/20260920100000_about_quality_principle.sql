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
