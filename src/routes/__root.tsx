import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NotFound } from "@/components/not-found";
import { Preloader, PRELOADER_BOOT } from "@/components/motion/preloader";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/motion/cursor";
import { PageTransition } from "@/components/motion/page-transition";
import { MotionDirector } from "@/components/motion/director";
import { JourneyRail } from "@/components/motion/journey-rail";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { NetlifyIdentity } from "@/components/motion/netlify-identity";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

import { site } from "@/data/site";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: site.name },
      {
        name: "description",
        content: site.description,
      },
      { name: "theme-color", content: "#0c0c0b" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [
      {
        children: `(function(){var h=location.hash||"";if(/(recovery_token|invite_token|confirmation_token)=/.test(h)&&location.pathname.indexOf("/admin")!==0){location.replace("/admin/"+h);}})();`,
      },
      { children: PRELOADER_BOOT },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <Preloader />
        <PageTransition />
        <SmoothScroll />
        <MotionDirector />
        <Cursor />
        <ScrollProgress />
        <JourneyRail />
        <NetlifyIdentity />
        <div className="grain" aria-hidden />
        <AuthProvider>
          <SiteHeader />
          <Outlet />
          <SiteFooter />
        </AuthProvider>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "color-mix(in oklab, #141412 72%, transparent)",
              backdropFilter: "blur(16px)",
              border: "1px solid color-mix(in oklab, #ebe6dc 14%, transparent)",
              color: "#ebe6dc",
            },
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
