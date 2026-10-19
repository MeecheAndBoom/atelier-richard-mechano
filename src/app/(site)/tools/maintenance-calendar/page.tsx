import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Maintenance calendar",
  description: "Wear intervals worth knowing, system by system.",
  alternates: { canonical: absoluteUrl("/tools/maintenance-calendar") },
};

const ITEMS = [
  { system: "Engine oil & filter", interval: "5,000–10,000 km / 6–12 months", note: "Use spec oil" },
  { system: "Air filter", interval: "15,000–30,000 km", note: "Sooner in dusty conditions" },
  { system: "Fuel filter", interval: "30,000–60,000 km", note: "Varies by diesel/petrol" },
  { system: "Spark plugs", interval: "30,000–100,000 km", note: "Check type" },
  { system: "Brake pads", interval: "Inspect every 10,000 km", note: "Thickness-based" },
  { system: "Brake discs", interval: "Inspect every 20,000 km", note: "Measure wear" },
  { system: "Timing belt/chain", interval: "60,000–120,000 km", note: "Critical — follow spec" },
  { system: "Coolant", interval: "40,000–100,000 km / 2–5 years", note: "Use correct mix" },
  { system: "Transmission fluid", interval: "30,000–80,000 km", note: "ATF/DCT varies" },
  { system: "Suspension/bushings", interval: "Inspect annually", note: "Noise/wear check" },
];

export default function MaintenanceCalendarPage() {
  return (
    <div>
      <PageHeader title="Maintenance calendar" lead="Wear intervals worth knowing, system by system." />
      <section className="section max-w-[900px] py-10">
        <div className="rounded-card border border-line-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-alt">
                  <th className="px-5 py-3 text-left font-medium">System</th>
                  <th className="px-5 py-3 text-left font-medium">Interval</th>
                  <th className="px-5 py-3 text-left font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map((d, i) => (
                  <tr key={i} className={i % 2 ? "" : "bg-white"}>
                    <td className="px-5 py-3 border-t border-line-soft">{d.system}</td>
                    <td className="px-5 py-3 border-t border-line-soft">{d.interval}</td>
                    <td className="px-5 py-3 border-t border-line-soft text-muted">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">These are indicative intervals. Always refer to your vehicle’s service schedule.</p>
        <p className="mt-6">
          <Link href="/tools">← Back to workshop tools</Link>
        </p>
      </section>
    </div>
  );
}
