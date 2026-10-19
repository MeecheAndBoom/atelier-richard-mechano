import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Workshop tools",
  description: "Torque calculator and maintenance calendar for common jobs.",
  alternates: { canonical: absoluteUrl("/tools") },
};

export default function ToolsHubPage() {
  return (
    <div>
      <PageHeader title="Workshop tools" lead="Pragmatic references for common workshop jobs." />
      <section className="section section-pad">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/tools/torque-calculator" className="card-flat p-5 transition-colors hover:border-accent">
            <h3 className="text-[16px] font-semibold">Torque calculator</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-muted">Common tightening torques for engine and brake fasteners.</p>
          </Link>
          <Link href="/tools/maintenance-calendar" className="card-flat p-5 transition-colors hover:border-accent">
            <h3 className="text-[16px] font-semibold">Maintenance calendar</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-muted">Wear intervals worth knowing, system by system.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
