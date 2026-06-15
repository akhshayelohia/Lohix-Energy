// Field schemas for the admin form renderer. One schema per section.
// Field types: text | textarea | url | color | image | video | icon | select | group | list

import type { SectionKey } from "./defaults";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "color"
  | "image"
  | "video"
  | "icon"
  | "select"
  | "group"
  | "list";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  dimensions?: string; // for image/video — shown as a chip beside the uploader
  options?: string[]; // for select
  placeholder?: string;
  rows?: number; // textarea
  fields?: Field[]; // for group / list-of-group
  itemType?: "text" | "group"; // for list
  itemLabel?: string; // for list (singular)
};

const ctaGroup = (key: string, label: string): Field => ({
  key,
  label,
  type: "group",
  fields: [
    { key: "label", label: "Button label", type: "text" },
    { key: "href", label: "Link", type: "url" },
  ],
});

const seoGroup: Field = {
  key: "seo",
  label: "SEO & social",
  type: "group",
  help: "Controls the browser tab title, search-result snippet, and link-preview card.",
  fields: [
    {
      key: "title",
      label: "Page title (<title>)",
      type: "text",
      help: "Aim for under 60 characters.",
    },
    {
      key: "description",
      label: "Meta description",
      type: "textarea",
      rows: 2,
      help: "Aim for under 160 characters.",
    },
    {
      key: "ogImage",
      label: "Social share image (OG image)",
      type: "image",
      dimensions: "1200 × 630 px",
      help: "1.91:1, JPG or PNG, ≤1 MB. Used when the page is shared on social media.",
    },
    {
      key: "canonical",
      label: "Canonical URL",
      type: "url",
      help: "Absolute URL of this page (e.g. https://lohix.lovable.app/about).",
    },
  ],
};

export const SCHEMAS: Record<SectionKey, Field[]> = {
  global: [
    {
      key: "logoUrl",
      label: "Logo",
      type: "image",
      dimensions: "512 × 512 px",
      help: "Square, transparent PNG. Used in the navbar and footer.",
    },
    { key: "brandName", label: "Brand name", type: "text" },
    {
      key: "primaryColor",
      label: "Primary accent colour",
      type: "color",
      help: "The single accent green used across the site.",
    },
    { key: "contactEmail", label: "Contact email", type: "text" },
    { key: "contactPhone", label: "Contact phone", type: "text" },
  ],

  hero: [
    {
      key: "videoUrl",
      label: "Background video",
      type: "video",
      dimensions: "1920 × 1080 px",
      help: "16:9, MP4 H.264, muted loop, ≤15 MB. Leave blank to keep the bundled default.",
    },
    { key: "chipBadge", label: "Chip badge (small green pill)", type: "text" },
    { key: "chipText", label: "Chip text", type: "text" },
    { key: "headlineLine1", label: "Headline · line 1", type: "text" },
    {
      key: "headlineHighlight",
      label: "Headline · highlighted word",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    { key: "headlineLine2", label: "Headline · line 2 (after highlight)", type: "text" },
    { key: "subline", label: "Subline", type: "textarea", rows: 3 },
    ctaGroup("ctaPrimary", "Primary CTA"),
    ctaGroup("ctaSecondary", "Secondary CTA"),
    {
      key: "trustItems",
      label: "Trust strip items",
      type: "list",
      itemType: "text",
      itemLabel: "Item",
    },
  ],

  features: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "headingPrefix", label: "Heading · prefix", type: "text" },
    { key: "headingHighlight", label: "Heading · highlighted", type: "text" },
    { key: "headingSuffix", label: "Heading · suffix", type: "text" },
    { key: "body", label: "Body copy", type: "textarea", rows: 3 },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaHref", label: "CTA link", type: "url" },
    {
      key: "items",
      label: "Spec tiles",
      type: "list",
      itemType: "group",
      itemLabel: "Spec",
      fields: [
        { key: "id", label: "ID (unique, lowercase)", type: "text" },
        { key: "label", label: "Label", type: "text" },
        { key: "value", label: "Value", type: "text" },
        { key: "unit", label: "Unit (optional)", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
        { key: "icon", label: "Icon", type: "icon" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: ["Power", "Lifecycle", "Safety", "Origin"],
        },
      ],
    },
  ],

  why_lohix: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "headingPrefix", label: "Heading · prefix", type: "text" },
    { key: "headingHighlight", label: "Heading · highlighted", type: "text" },
    { key: "headingSuffix", label: "Heading · suffix", type: "text" },
    { key: "body", label: "Body copy", type: "textarea", rows: 3 },
    {
      key: "cards",
      label: "Value cards",
      type: "list",
      itemType: "group",
      itemLabel: "Card",
      fields: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
      ],
    },
  ],

  dealer_cta: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "headingPrefix", label: "Heading · prefix", type: "text" },
    { key: "headingHighlight", label: "Heading · highlighted", type: "text" },
    { key: "body", label: "Body copy", type: "textarea", rows: 3 },
    {
      key: "benefits",
      label: "Benefits (checklist)",
      type: "list",
      itemType: "text",
      itemLabel: "Benefit",
    },
    { key: "buttonLabel", label: "Button label", type: "text" },
    { key: "footnote", label: "Footnote", type: "text" },
  ],

  footer: [
    { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
    { key: "slogan", label: "Slogan", type: "text" },
    { key: "copyright", label: "Copyright", type: "text" },
    {
      key: "productLinks",
      label: "Product links",
      type: "list",
      itemType: "group",
      itemLabel: "Link",
      fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "href", label: "Link", type: "url" },
      ],
    },
    {
      key: "contactLines",
      label: "Contact lines",
      type: "list",
      itemType: "text",
      itemLabel: "Line",
    },
  ],

  product: [
    {
      key: "heroImage",
      label: "Hero product image",
      type: "image",
      dimensions: "1600 × 1200 px",
      help: "4:3 landscape, transparent PNG, ≤2 MB. Fills the hero placeholder edge-to-edge.",
    },
    { key: "breadcrumb", label: "Breadcrumb label", type: "text" },
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "titleMain", label: "Title · main", type: "text" },
    { key: "titleAccent", label: "Title · accent", type: "text" },
    { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
    {
      key: "quickStats",
      label: "Quick stats",
      type: "list",
      itemType: "group",
      itemLabel: "Stat",
      fields: [
        { key: "k", label: "Value", type: "text" },
        { key: "v", label: "Label", type: "text" },
      ],
    },
    ctaGroup("ctaPrimary", "Primary CTA"),
    ctaGroup("ctaSecondary", "Secondary CTA"),
    { key: "overviewHeading", label: "Overview heading", type: "text" },
    {
      key: "overviewParagraphs",
      label: "Overview paragraphs",
      type: "list",
      itemType: "text",
      itemLabel: "Paragraph",
    },
    { key: "useCases", label: "Use cases", type: "list", itemType: "text", itemLabel: "Use case" },
    { key: "featuresHeading", label: "Features heading", type: "text" },
    { key: "featuresBody", label: "Features body", type: "textarea", rows: 3 },
    {
      key: "features",
      label: "Feature cards",
      type: "list",
      itemType: "group",
      itemLabel: "Feature",
      fields: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
      ],
    },
    { key: "specsHeading", label: "Specs heading", type: "text" },
    {
      key: "specBadges",
      label: "Spec badges",
      type: "list",
      itemType: "group",
      itemLabel: "Badge",
      fields: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "label", label: "Label", type: "text" },
      ],
    },
    {
      key: "specGroups",
      label: "Spec groups",
      type: "list",
      itemType: "group",
      itemLabel: "Group",
      fields: [
        { key: "title", label: "Group title", type: "text" },
        {
          key: "rows",
          label: "Rows",
          type: "list",
          itemType: "group",
          itemLabel: "Row",
          fields: [
            { key: "label", label: "Label", type: "text" },
            { key: "value", label: "Value", type: "text" },
          ],
        },
      ],
    },
    { key: "ctaEyebrow", label: "Bottom CTA · eyebrow", type: "text" },
    { key: "ctaHeading", label: "Bottom CTA · heading", type: "text" },
    { key: "ctaHighlight", label: "Bottom CTA · highlight", type: "text" },
    { key: "ctaBody", label: "Bottom CTA · body", type: "textarea", rows: 3 },
  ],

  about: [
    seoGroup,
    { key: "breadcrumb", label: "Breadcrumb label", type: "text" },
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitlePrefix", label: "Hero title · prefix", type: "text" },
    {
      key: "heroTitleHighlight",
      label: "Hero title · highlighted",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    { key: "heroTitleSuffix", label: "Hero title · suffix", type: "text" },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },

    { key: "missionEyebrow", label: "Mission · eyebrow", type: "text" },
    { key: "missionHeadingPrefix", label: "Mission heading · prefix", type: "text" },
    { key: "missionHeadingHighlight", label: "Mission heading · highlighted", type: "text" },
    {
      key: "missionParagraphs",
      label: "Mission paragraphs",
      type: "list",
      itemType: "text",
      itemLabel: "Paragraph",
    },
    {
      key: "stats",
      label: "Mission stats",
      type: "list",
      itemType: "group",
      itemLabel: "Stat",
      fields: [
        { key: "k", label: "Value", type: "text" },
        { key: "v", label: "Label", type: "text" },
      ],
    },

    { key: "timelineEyebrow", label: "Timeline · eyebrow", type: "text" },
    { key: "timelineHeading", label: "Timeline · heading", type: "text" },
    {
      key: "timeline",
      label: "Timeline entries",
      type: "list",
      itemType: "group",
      itemLabel: "Milestone",
      fields: [
        { key: "year", label: "Year", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
      ],
    },

    { key: "valuesEyebrow", label: "Values · eyebrow", type: "text" },
    { key: "valuesHeading", label: "Values · heading", type: "text" },
    {
      key: "values",
      label: "Value cards",
      type: "list",
      itemType: "group",
      itemLabel: "Value",
      fields: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
      ],
    },

    { key: "facilityEyebrow", label: "Facility · eyebrow", type: "text" },
    { key: "facilityHeading", label: "Facility · heading", type: "text" },
    { key: "facilityBody", label: "Facility · body copy", type: "textarea", rows: 3 },
    {
      key: "facilityImage",
      label: "Facility image (optional)",
      type: "image",
      dimensions: "1600 × 1200 px",
      help: "4:3 landscape, JPG, ≤2 MB. If provided, replaces the gradient mesh card on the right.",
    },
    { key: "facilityCity", label: "Facility city (e.g. 'Kolkata,')", type: "text" },
    { key: "facilityRegion", label: "Facility region (highlighted)", type: "text" },
    { key: "facilityCoordinates", label: "Coordinates label", type: "text" },
    { key: "facilityCompany", label: "Company line", type: "text" },
    ctaGroup("facilityCtaPrimary", "Facility · primary CTA"),
    ctaGroup("facilityCtaSecondary", "Facility · secondary CTA"),
  ],

  dealer: [
    seoGroup,
    { key: "breadcrumb", label: "Breadcrumb label", type: "text" },
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitlePrefix", label: "Hero title · prefix", type: "text" },
    { key: "heroTitleHighlight", label: "Hero title · highlighted", type: "text" },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },
    ctaGroup("ctaPrimary", "Hero · primary CTA"),

    { key: "benefitsEyebrow", label: "Benefits · eyebrow", type: "text" },
    { key: "benefitsHeading", label: "Benefits · heading", type: "text" },
    { key: "benefitsSubtext", label: "Benefits · subtext", type: "textarea", rows: 2 },
    {
      key: "benefits",
      label: "Benefit cards",
      type: "list",
      itemType: "group",
      itemLabel: "Benefit",
      fields: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "title", label: "Title", type: "text" },
        { key: "body", label: "Body", type: "textarea", rows: 2 },
      ],
    },

    { key: "stepsEyebrow", label: "Steps · eyebrow", type: "text" },
    { key: "stepsHeading", label: "Steps · heading", type: "text" },
    {
      key: "steps",
      label: "Onboarding steps",
      type: "list",
      itemType: "group",
      itemLabel: "Step",
      fields: [
        { key: "n", label: "Number (e.g. 01)", type: "text" },
        { key: "t", label: "Title", type: "text" },
        { key: "b", label: "Body", type: "textarea", rows: 2 },
      ],
    },

    { key: "citiesLabel", label: "Cities marquee · label", type: "text" },
    { key: "cities", label: "Cities", type: "list", itemType: "text", itemLabel: "City" },

    { key: "faqEyebrow", label: "FAQ · eyebrow", type: "text" },
    { key: "faqHeading", label: "FAQ · heading", type: "text" },
    {
      key: "faqs",
      label: "FAQ entries",
      type: "list",
      itemType: "group",
      itemLabel: "FAQ",
      fields: [
        { key: "q", label: "Question", type: "text" },
        { key: "a", label: "Answer", type: "textarea", rows: 3 },
      ],
    },
  ],

  specs: [
    seoGroup,
    { key: "breadcrumb", label: "Breadcrumb label", type: "text" },
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitlePrefix", label: "Hero title · prefix", type: "text" },
    { key: "heroTitleHighlight", label: "Hero title · highlighted", type: "text" },
    { key: "heroTitleSuffix", label: "Hero title · suffix", type: "text" },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },
    { key: "explorerHint", label: "Explorer hint (small top-right text)", type: "text" },

    { key: "datasheetEyebrow", label: "Datasheet · eyebrow", type: "text" },
    { key: "datasheetHeading", label: "Datasheet · heading", type: "text" },
    { key: "datasheetDownloadLabel", label: "Download button label", type: "text" },
    { key: "datasheetDownloadHref", label: "Download button link", type: "url" },

    { key: "comparisonEyebrow", label: "Comparison · eyebrow", type: "text" },
    { key: "comparisonHeading", label: "Comparison · heading", type: "text" },
    { key: "comparisonColA", label: "Comparison · column A header", type: "text" },
    { key: "comparisonColB", label: "Comparison · column B header", type: "text" },
    {
      key: "comparisonRows",
      label: "Comparison rows",
      type: "list",
      itemType: "group",
      itemLabel: "Row",
      fields: [
        { key: "k", label: "Parameter", type: "text" },
        { key: "a", label: "Column A value", type: "text" },
        { key: "b", label: "Column B value", type: "text" },
      ],
    },

    { key: "ctaEyebrow", label: "Bottom CTA · eyebrow", type: "text" },
    { key: "ctaHeading", label: "Bottom CTA · heading", type: "text" },
    ctaGroup("ctaPrimary", "Bottom CTA · primary"),
    ctaGroup("ctaSecondary", "Bottom CTA · secondary"),
  ],
};

export const ICON_OPTIONS = [
  "Zap",
  "Battery",
  "Activity",
  "RefreshCw",
  "Shield",
  "Cpu",
  "TrendingUp",
  "BadgeCheck",
  "MapPin",
  "Flag",
  "Repeat",
  "Thermometer",
  "Droplets",
  "Factory",
  "Gauge",
  "ShieldCheck",
  "Compass",
  "Leaf",
  "Users",
  "HandCoins",
  "LineChart",
  "Sparkles",
  "Phone",
];
