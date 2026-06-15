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
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTADock } from "@/components/StickyCTADock";
import { useRouterState } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // NOTE: We intentionally do NOT prefetch site_content here. SSR would warm
  // the server cache while the client boots with an empty cache, producing a
  // hydration mismatch on any CMS-overridden text. Letting useContent() start
  // from DEFAULTS on both sides keeps the first paint identical; the live
  // values arrive via React Query right after hydration.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LOHIX BATTERIES" },
      {
        name: "description",
        content:
          "LOHIX Energy Core is a Next.js 14 application showcasing advanced battery technology.",
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "LOHIX BATTERIES" },
      {
        property: "og:description",
        content:
          "LOHIX Energy Core is a Next.js 14 application showcasing advanced battery technology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "LOHIX BATTERIES" },
      {
        name: "twitter:description",
        content:
          "LOHIX Energy Core is a Next.js 14 application showcasing advanced battery technology.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64d9153c-d013-4cdb-9411-18ea7d4467a0/id-preview-fe031222--b7b881d0-83ee-4930-855e-37a0cefa7896.lovable.app-1779084437094.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64d9153c-d013-4cdb-9411-18ea7d4467a0/id-preview-fe031222--b7b881d0-83ee-4930-855e-37a0cefa7896.lovable.app-1779084437094.png",
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
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LOHIX Energy",
          url: "https://lohix.lovable.app",
          logo: "https://lohix.lovable.app/logo_lohix.png",
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
      {!isAdmin && <ScrollProgress />}
      <Outlet />
      {!isAdmin && <StickyCTADock />}
    </QueryClientProvider>
  );
}
