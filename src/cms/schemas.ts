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
  collapsed?: boolean; // list: items start folded
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

const showcaseImageField: Field = {
  key: "showcaseImage",
  label: "Showcase image (full-bleed first screen)",
  type: "image",
  dimensions: "1920 × 1080 px",
  help: "Landscape photo, 16:9, JPG/WebP ≤600 KB (export PNG photos as JPG/WebP). On desktop it fills the whole first screen edge to edge; wide screens trim a little from the top and bottom, so keep about 15% free space above and below the product. Phones show the whole photo. Blank shows the illustrated stage.",
};

const showcaseImageMobileField: Field = {
  key: "showcaseImageMobile",
  label: "Showcase image · phones (optional)",
  type: "image",
  dimensions: "1080 × 1350 px",
  help: "Portrait 4:5 or 9:16 version of the same shot, JPG/WebP ≤400 KB. Strongly recommended: without it, phones show the landscape photo small in the middle of the screen.",
};

const showcaseVideoField: Field = {
  key: "showcaseVideo",
  label: "Showcase video (optional)",
  type: "video",
  dimensions: "1920 × 1080 px",
  help: "16:9 MP4 (H.264), muted loop, ≤15 MB. Plays instead of the image, which becomes its poster frame.",
};

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
      help: "Absolute URL of this page (e.g. https://lohixenergy.com/about).",
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
      help: "16:9 MP4 (H.264), muted loop, 8–12 s. Keep it under 6 MB — every visitor downloads it. Leave blank to use the built-in, web-compressed footage (3.7 MB desktop, 1.7 MB phone portrait cut).",
    },
    {
      key: "videoUrlMobile",
      label: "Background video · phones (recommended)",
      type: "video",
      dimensions: "720 × 1280 px",
      help: "Portrait 9:16 (or 720p 16:9) MP4, ≤2.5 MB. Played on screens under 768px wide so phones on mobile data don't download the full-size file. Blank uses the video above — or, if that is blank too, the built-in phone cut.",
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

  trust: [
    { key: "eyebrow", label: "Eyebrow (small caps line above the strip)", type: "text" },
    {
      key: "items",
      label: "Certification claims",
      type: "list",
      itemType: "text",
      itemLabel: "Claim",
      help: "Public product claims. Only add a line once you hold the certificate or test report for it — remove anything that lapses.",
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

  stats: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "headingPrefix", label: "Heading · prefix", type: "text" },
    {
      key: "headingHighlight",
      label: "Heading · highlighted",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    {
      key: "items",
      label: "Counters",
      type: "list",
      itemType: "group",
      itemLabel: "Counter",
      fields: [
        {
          key: "value",
          label: "Value",
          type: "text",
          help: "Number first, then the unit — e.g. '3500+', '5.12kWh', '51.2V'. The number animates up on scroll; the unit stays put.",
        },
        { key: "label", label: "Label", type: "text" },
        { key: "sub", label: "Sub-label (optional)", type: "text" },
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

  warranty: [
    { key: "eyebrow", label: "Eyebrow (small caps line above the heading)", type: "text" },
    { key: "headingPrefix", label: "Heading · prefix", type: "text" },
    {
      key: "headingHighlight",
      label: "Heading · highlighted",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    { key: "headingSuffix", label: "Heading · suffix", type: "text" },
    { key: "body", label: "Intro copy", type: "textarea", rows: 3 },
    {
      key: "bullets",
      label: "Coverage checklist",
      type: "list",
      itemType: "text",
      itemLabel: "Point",
      help: "What the warranty actually covers. Keep standard and GPS variants distinct.",
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
    ctaGroup("dealerButton", "Button under the tagline"),
    {
      key: "exploreHeading",
      label: "Explore column · heading",
      type: "text",
      help: "Product columns are built automatically from the product catalogue.",
    },
    {
      key: "productLinks",
      label: "Explore column · links",
      type: "list",
      itemType: "group",
      itemLabel: "Link",
      help: "Shown after 'All products'. Links to individual product pages are skipped — they already have their own column.",
      fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "href", label: "Link", type: "url" },
      ],
    },
    { key: "contactHeading", label: "Contact column · heading", type: "text" },
    {
      key: "contactLines",
      label: "Contact lines",
      type: "list",
      itemType: "text",
      itemLabel: "Line",
      help: "Phone numbers and emails become tap-to-call / tap-to-email links. Phone numbers also appear in the Where to buy pop-up.",
    },
    { key: "copyright", label: "Copyright", type: "text" },
    { key: "slogan", label: "Slogan", type: "text" },
  ],

  buy_dialog: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Intro copy", type: "textarea", rows: 2 },
    { key: "callLabel", label: "Phone row label", type: "text" },
    { key: "emailLabel", label: "Email row label", type: "text" },
    {
      key: "emailSubject",
      label: "Email subject line",
      type: "text",
      help: "Pre-filled when a visitor taps the email row. The address comes from Global settings.",
    },
    { key: "dealerPrompt", label: "Footer prompt", type: "text" },
    ctaGroup("dealerLink", "Footer link"),
  ],

  emails: [
    {
      key: "warrantySubject",
      label: "Warranty · subject line",
      type: "text",
      help: "Sent to the customer right after they register. {serial} becomes their battery serial.",
    },
    {
      key: "warrantyHeading",
      label: "Warranty · heading",
      type: "text",
      help: "{name} becomes their first name.",
    },
    {
      key: "warrantyBody",
      label: "Warranty · message",
      type: "textarea",
      rows: 5,
      help: "A blank line starts a new paragraph. A summary of what they registered is added below automatically.",
    },
    {
      key: "dealerSubject",
      label: "Dealer · subject line",
      type: "text",
      help: "Sent to the applicant right after they apply on /dealer.",
    },
    {
      key: "dealerHeading",
      label: "Dealer · heading",
      type: "text",
      help: "{name} becomes their first name.",
    },
    {
      key: "dealerBody",
      label: "Dealer · message",
      type: "textarea",
      rows: 5,
      help: "{city} becomes the city they entered. Only promise a response time the team can keep.",
    },
    { key: "signOff", label: "Sign-off", type: "text" },
    {
      key: "footer",
      label: "Footer line",
      type: "text",
      help: "Company name and address shown at the bottom of every email.",
    },
  ],

  range: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    {
      key: "highlight",
      label: "Heading · second line",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    { key: "body", label: "Body copy", type: "textarea", rows: 3 },
    {
      key: "linkPrefix",
      label: "Card link prefix",
      type: "text",
      help: "Followed by the category name, e.g. 'Explore 2W Batteries'. Cards, names and figures come from the product sections.",
    },
    ctaGroup("comingSoonLink", "Coming soon card · link"),
  ],

  products_page: [
    seoGroup,
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitle", label: "Hero title", type: "text" },
    {
      key: "heroAccent",
      label: "Hero title · second line",
      type: "text",
      help: "Rendered in the accent colour.",
    },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },
    {
      key: "estimatorChip",
      label: "Hero · estimator chip",
      type: "group",
      help: "The third chip on the hero image; it jumps to the range estimator.",
      fields: [
        { key: "k", label: "Title", type: "text" },
        { key: "v", label: "Sub-label", type: "text" },
      ],
    },

    { key: "erickshawLabel", label: "E-rickshaw category · name", type: "text" },
    { key: "erickshawHeading", label: "E-rickshaw category · heading", type: "text" },
    {
      key: "compareHeading",
      label: "2W comparison · heading",
      type: "text",
      help: "The 2W category name and cards are edited under '2W batteries'.",
    },
    { key: "compareNote", label: "2W comparison · note", type: "text" },

    { key: "estimatorEyebrow", label: "Estimator · eyebrow", type: "text" },
    { key: "estimatorHeading", label: "Estimator · heading", type: "text" },
    { key: "estimatorBody", label: "Estimator · intro", type: "textarea", rows: 3 },

    { key: "ctaEyebrow", label: "Bottom CTA · eyebrow", type: "text" },
    { key: "ctaHeading", label: "Bottom CTA · heading", type: "text" },
    { key: "ctaHighlight", label: "Bottom CTA · highlight", type: "text" },
    { key: "ctaBody", label: "Bottom CTA · body", type: "textarea", rows: 3 },
    ctaGroup("ctaPrimary", "Bottom CTA · primary"),
    ctaGroup("ctaSecondary", "Bottom CTA · secondary"),

    {
      key: "overviewEyebrow",
      label: "Product pages · overview eyebrow",
      type: "text",
      help: "This and the fields below apply to /product and every 2W model page.",
    },
    { key: "featuresEyebrow", label: "Product pages · features eyebrow", type: "text" },
    { key: "builtForLabel", label: "Product pages · use-case label", type: "text" },
    { key: "galleryEyebrow", label: "Product pages · gallery eyebrow", type: "text" },
    { key: "galleryHeading", label: "Product pages · gallery heading", type: "text" },
    { key: "specsEyebrow", label: "Product pages · specs eyebrow", type: "text" },
    { key: "datasheetHeading", label: "Product pages · datasheet card title", type: "text" },
    {
      key: "datasheetDownloadLabel",
      label: "Product pages · download button",
      type: "text",
      help: "Shown when the model has a datasheet PDF link.",
    },
    {
      key: "datasheetRequestLabel",
      label: "Product pages · request button",
      type: "text",
      help: "Shown when there is no PDF yet — opens an email to the global contact address.",
    },
    {
      key: "productEstimatorHeading",
      label: "Product pages · estimator heading",
      type: "text",
    },
    {
      key: "productEstimatorBody",
      label: "Product pages · estimator intro",
      type: "textarea",
      rows: 2,
    },
    { key: "rangeEyebrow", label: "Product pages · related range eyebrow", type: "text" },
    { key: "viewAllLabel", label: "Product pages · 'view all' button", type: "text" },
    {
      key: "stickyBuyLabel",
      label: "Product pages · phone buy bar button",
      type: "text",
      help: "The bar that slides up on phones once the product intro scrolls away. It always opens the Where to buy pop-up.",
    },
    {
      key: "comingSoon",
      label: "Coming soon band",
      type: "group",
      help: "The announcement band on /products for packs that are not on sale yet. Clear the heading to hide the whole band.",
      fields: [
        { key: "label", label: "Chip", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "body", label: "Body copy", type: "textarea", rows: 3 },
        {
          key: "packs",
          label: "Packs",
          type: "list",
          itemType: "group",
          itemLabel: "Pack",
          fields: [
            { key: "voltage", label: "Voltage", type: "text", placeholder: "60V" },
            {
              key: "capacities",
              label: "Capacities",
              type: "text",
              placeholder: "125 · 150 · 200 Ah",
            },
          ],
        },
        { key: "note", label: "Small print", type: "text" },
        ctaGroup("cta", "Button"),
      ],
    },
  ],

  product: [
    showcaseImageField,
    showcaseImageMobileField,
    showcaseVideoField,
    {
      key: "heroImage",
      label: "Product cut-out (cards & menus)",
      type: "image",
      dimensions: "1600 × 1200 px",
      help: "4:3, transparent PNG, ≤2 MB. Used on product cards and menus, and on the showcase stage when no showcase image is set.",
    },
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
    {
      key: "datasheetUrl",
      label: "Full datasheet PDF link (optional)",
      type: "url",
      help: "Shows a 'Download full datasheet' button when set.",
    },
  ],

  products_2w: [
    { key: "categoryLabel", label: "Category name", type: "text" },
    { key: "categoryEyebrow", label: "Category eyebrow", type: "text" },
    { key: "categoryHeading", label: "Category heading (products page)", type: "text" },
    { key: "categoryBody", label: "Category intro", type: "textarea", rows: 3 },
    { key: "useCases", label: "Use cases", type: "list", itemType: "text", itemLabel: "Use case" },
    { key: "featuresHeading", label: "Features heading", type: "text" },
    { key: "featuresBody", label: "Features body", type: "textarea", rows: 3 },
    {
      key: "features",
      label: "Feature cards (shared by all models)",
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
    { key: "datasheetNote", label: "Datasheet note", type: "textarea", rows: 2 },
    { key: "ctaEyebrow", label: "Bottom CTA · eyebrow", type: "text" },
    { key: "ctaHeading", label: "Bottom CTA · heading", type: "text" },
    { key: "ctaHighlight", label: "Bottom CTA · highlight", type: "text" },
    { key: "ctaBody", label: "Bottom CTA · body", type: "textarea", rows: 3 },
    ctaGroup("ctaPrimary", "Bottom CTA · primary"),
    ctaGroup("ctaSecondary", "Bottom CTA · secondary"),
    {
      key: "skus",
      label: "Models",
      type: "list",
      itemType: "group",
      itemLabel: "Model",
      collapsed: true,
      help: "One entry per model page (/products/<slug>). Open a model to upload its own showcase photo, phone photo, cut-out and gallery. The name is built from voltage + capacity — never add internal cell configuration.",
      fields: [
        {
          key: "slug",
          label: "URL slug",
          type: "text",
          help: "Page lives at /products/<slug>. Changing it changes the address.",
        },
        { key: "voltage", label: "Nominal voltage (e.g. 60.8V)", type: "text" },
        { key: "capacity", label: "Capacity (e.g. 30Ah)", type: "text" },
        { key: "overview", label: "Overview line", type: "textarea", rows: 2 },
        {
          key: "badges",
          label: "Quick badges",
          type: "list",
          itemType: "text",
          itemLabel: "Badge",
        },
        {
          key: "keyFigures",
          label: "Key figures (hero spec rail)",
          type: "list",
          itemType: "group",
          itemLabel: "Figure",
          fields: [
            { key: "k", label: "Value", type: "text" },
            { key: "v", label: "Label", type: "text" },
          ],
        },
        showcaseImageField,
        showcaseImageMobileField,
        showcaseVideoField,
        {
          key: "heroImage",
          label: "Product cut-out (cards & menus)",
          type: "image",
          dimensions: "2000 × 1500 px",
          help: "4:3, transparent PNG cut-out, product centred at ~70% width. Blank shows the illustrated pack.",
        },
        {
          key: "gallery",
          label: "Gallery",
          type: "list",
          itemType: "group",
          itemLabel: "Image",
          fields: [
            {
              key: "src",
              label: "Image",
              type: "image",
              dimensions: "2000 × 1500 px",
              help: "4:3 landscape, JPG/WebP, ≤500 KB.",
            },
            { key: "alt", label: "Alt text", type: "text" },
          ],
        },
        {
          key: "datasheetUrl",
          label: "Full datasheet PDF link",
          type: "url",
          help: "Shows 'Download full datasheet' when set; otherwise a request-by-email link.",
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
      ],
    },
  ],

  about: [
    seoGroup,
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
    ctaGroup("heroCtaPrimary", "Hero · primary CTA"),
    ctaGroup("heroCtaSecondary", "Hero · secondary CTA"),

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
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitlePrefix", label: "Hero title · prefix", type: "text" },
    { key: "heroTitleHighlight", label: "Hero title · highlighted", type: "text" },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },
    ctaGroup("ctaPrimary", "Hero · primary CTA"),
    {
      key: "showPhoneCta",
      label: "Hero · show phone button",
      type: "select",
      options: ["true", "false"],
      help: "Shows the global contact phone next to the CTA once a real number is set.",
    },

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

    {
      key: "stepsEyebrow",
      label: "Steps · eyebrow",
      type: "text",
      help: "On desktop the steps play in the hero, headed by this eyebrow; on phones they get their own section.",
    },
    { key: "stepsHeading", label: "Steps · heading (phones)", type: "text" },
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

    { key: "cityEyebrow", label: "City step · eyebrow", type: "text" },
    { key: "cityHeading", label: "City step · heading", type: "text" },
    { key: "cityBody", label: "City step · intro", type: "textarea", rows: 2 },
    { key: "cityQuestion", label: "City step · question", type: "text" },
    { key: "cityHint", label: "City step · hint", type: "text" },
    { key: "cityPlaceholder", label: "City step · input placeholder", type: "text" },
    {
      key: "cityButton",
      label: "City step · button prefix",
      type: "text",
      help: "Followed by the city the visitor typed, e.g. 'Apply for Siliguri'.",
    },

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
    { key: "heroEyebrow", label: "Hero · eyebrow", type: "text" },
    { key: "heroTitlePrefix", label: "Hero title · prefix", type: "text" },
    { key: "heroTitleHighlight", label: "Hero title · highlighted", type: "text" },
    { key: "heroTitleSuffix", label: "Hero title · suffix", type: "text" },
    { key: "heroBody", label: "Hero · body copy", type: "textarea", rows: 3 },
    { key: "explorerHint", label: "Explorer hint (small top-right text)", type: "text" },

    { key: "datasheetEyebrow", label: "Datasheet · eyebrow", type: "text" },
    { key: "datasheetHeading", label: "Datasheet · heading", type: "text" },
    { key: "datasheetBody", label: "Datasheet · intro", type: "textarea", rows: 2 },
    { key: "datasheetDownloadLabel", label: "Download button label", type: "text" },
    {
      key: "datasheetDownloadHref",
      label: "LOHIX 48 · datasheet PDF link",
      type: "url",
      help: "2W models use the PDF link set on each model in '2W batteries'. Models without a PDF show a request-by-email button.",
    },
    { key: "datasheetViewLabel", label: "Product link prefix (e.g. 'View')", type: "text" },
    { key: "twoWheelerCtaLabel", label: "Hero · 2W button label", type: "text" },

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
