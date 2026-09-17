import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { BrandColor } from "@/cms/BrandColor";
import { BuyDialog } from "@/components/BuyDialog";
import { StageBackdrop } from "@/components/system/StageBackdrop";
import { loadSiteContent } from "@/cms/useContent";
import { useRouterState } from "@tanstack/react-router";

function StatusScreen({
  code,
  title,
  body,
  children,
}: {
  code: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen items-center overflow-hidden bg-night text-white">
      <StageBackdrop glow="top" />
      <div className="container-x relative py-24">
        <div className="t-label text-white/45">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lohix-lime align-middle" />
          LOHIX Energy
        </div>
        <div className="t-display tnum mt-6 text-[clamp(96px,18vw,220px)] text-lohix-lime">
          {code}
        </div>
        <h1 className="t-h2 mt-4 text-white">{title}</h1>
        <p className="t-lead mt-4 max-w-md text-white/55">{body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">{children}</div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <StatusScreen
      code="404"
      title="This page ran out of charge."
      body="The page you're looking for doesn't exist or has been moved."
    >
      <Link to="/" className="btn btn-lime">
        Back home
      </Link>
      <a href="/products" className="btn btn-ghost-dark">
        View products
      </a>
    </StatusScreen>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <StatusScreen
      code="500"
      title="This page didn't load."
      body="Something went wrong on our end. Try again, or head back home."
    >
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="btn btn-lime"
      >
        Try again
      </button>
      <a href="/" className="btn btn-ghost-dark">
        Back home
      </a>
    </StatusScreen>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Live CMS content is loaded before render and serialised with the page, so
  // server HTML and client hydration use the same values (see useContent).
  loader: () => loadSiteContent(),
  staleTime: 60_000,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LOHIX Energy — Smart LFP Batteries" },
      {
        name: "description",
        content:
          "Smart LiFePO4 batteries engineered in India for e-rickshaws and electric two-wheelers — smart BMS, long cycle life, local service.",
      },
      { name: "theme-color", content: "#05070a" },
      { property: "og:title", content: "LOHIX Energy — Smart LFP Batteries" },
      {
        property: "og:description",
        content:
          "Smart LiFePO4 batteries engineered in India for e-rickshaws and electric two-wheelers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LOHIX Energy — Smart LFP Batteries" },
      {
        name: "twitter:description",
        content:
          "Smart LiFePO4 batteries engineered in India for e-rickshaws and electric two-wheelers.",
      },
      {
        property: "og:image",
        content: "https://lohixenergy.com/og-image.jpg",
      },
      {
        name: "twitter:image",
        content: "https://lohixenergy.com/og-image.jpg",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo_lohix.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LOHIX Energy",
          url: "https://lohixenergy.com",
          logo: "https://lohixenergy.com/logo_lohix.png",
          sameAs: [],
          description: "Smart LFP batteries engineered in India for e-rickshaws and EVs.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <BrandColor />
      <Outlet />
      {!isAdmin && <BuyDialog />}
    </QueryClientProvider>
  );
}
