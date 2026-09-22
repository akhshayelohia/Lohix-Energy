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
