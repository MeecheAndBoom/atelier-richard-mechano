import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { PageFade } from "@/components/site/PageFade";
import { RouteProgress } from "@/components/site/RouteProgress";
import { ToastProvider } from "@/components/ui/Toast";

/** Public chrome — top bar, veils/progress, cart panel, footer. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <Nav />
      <CartDrawer />
      <PageFade />
      <RouteProgress />
      <main id="main" className="min-h-[70vh] pt-[52px]">
        {children}
      </main>
      <Footer />
    </ToastProvider>
  );
}
