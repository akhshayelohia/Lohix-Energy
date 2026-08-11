-- Content claim corrections.
--
-- site_content rows override src/cms/defaults.ts, so fixing the code alone
-- leaves the stored hero/product overrides serving the old claims. This patches
-- the stored JSON to match.
--
-- Removes or qualifies claims we cannot evidence:
--   * "3800+ cycles"      -> 3500+ (the figure we can support)
--   * "IP67 Sealed"       -> IP67 design, certification pending
--   * "IP67 Waterproof"   -> IP67 design, certification pending
--   * "Safety Certified"  -> BIS Certified Cells (R-41147877)
-- Only keys that need correcting are touched; everything else is left as edited
-- in the admin studio.

UPDATE public.site_content
SET data = data
  || jsonb_build_object(
       'subline',
       'A smart 51.2V LFP battery engineered for e-rickshaws and EVs across Eastern India. 3500+ cycles. Real BMS protection. Local service.',
       'trustItems',
       jsonb_build_array(
         'Live BMS · 24/7',
         'IP67 design · certification pending',
         '3500+ cycles',
         'Made in India'
       )
     )
WHERE section = 'hero';

UPDATE public.site_content
SET data = data
  || jsonb_build_object(
       'quickStats',
       jsonb_build_array(
         jsonb_build_object('k', '51.2 V', 'v', 'Output'),
         jsonb_build_object('k', '100 Ah', 'v', 'Capacity'),
         jsonb_build_object('k', '3500+', 'v', 'Life cycles'),
         jsonb_build_object('k', 'IP67', 'v', 'Design')
       ),
       'overviewParagraphs',
       jsonb_build_array(
         data -> 'overviewParagraphs' ->> 0,
         'Equipped with advanced Smart BMS protection, fast charging compatibility, and high-temperature resilience, the system is designed for durability, safety, and consistent power management under demanding conditions. Built to an IP67 design standard (certification pending) on BIS-certified Grade A+ cells, LOHIX 48 is maintenance-free and capable of delivering 3500+ life cycles.'
       ),
       'specBadges',
       jsonb_build_array(
         jsonb_build_object('icon', 'Battery', 'label', 'LFP Chemistry'),
         jsonb_build_object('icon', 'Gauge', 'label', 'Smart Monitoring'),
         jsonb_build_object('icon', 'ShieldCheck', 'label', 'BIS Certified Cells')
       ),
       'specGroups',
       jsonb_build_array(
         data -> 'specGroups' -> 0,
         data -> 'specGroups' -> 1,
         jsonb_build_object(
           'title', 'Build & safety',
           'rows', jsonb_build_array(
             jsonb_build_object('label', 'Protection', 'value', 'IP67 design (cert. pending)'),
             jsonb_build_object('label', 'BMS', 'value', 'Smart, multi-layer'),
             jsonb_build_object('label', 'Cell certification', 'value', 'BIS R-41147877'),
             jsonb_build_object('label', 'Operating temp', 'value', '−10° to 60°C'),
             jsonb_build_object('label', 'Origin', 'value', 'Made in India')
           )
         )
       )
     )
  || jsonb_build_object(
       'features',
       (
         SELECT jsonb_agg(
           CASE
             WHEN f ->> 'title' = 'IP67 Waterproof' THEN jsonb_build_object(
               'icon', 'Droplets',
               'title', 'IP67 Design',
               'body', 'Sealed industrial enclosure engineered to an IP67 design standard for rain, dust, and rough roads. Certification pending.'
             )
             ELSE f
           END
           ORDER BY ord
         )
         FROM jsonb_array_elements(data -> 'features') WITH ORDINALITY AS t(f, ord)
       )
     )
WHERE section = 'product';
