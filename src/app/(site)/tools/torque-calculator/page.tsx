import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Torque calculator",
  description: "Common tightening torques for engine and brake fasteners.",
};

const DATA = [
  { fastener: "Spark plugs (aluminum head)", nm: 20, lbf: 15, note: "Cold" },
  { fastener: "Spark plugs (cast iron head)", nm: 25, lbf: 18, note: "Cold" },
  { fastener: "Wheel lug nuts (steel wheel)", nm: 110, lbf: 81, note: "Check vehicle spec" },
  { fastener: "Wheel lug nuts (alloy wheel)", nm: 120, lbf: 89, note: "Check vehicle spec" },
  { fastener: "Caliper bracket bolts", nm: 110, lbf: 81, note: "Often stretch/torque+angle" },
  { fastener: "Caliper guide pins", nm: 30, lbf: 22, note: "Greased per spec" },
  { fastener: "Oil drain plug (steel pan)", nm: 30, lbf: 22, note: "New gasket/crush washer" },
  { fastener: "Oil filter housing", nm: 25, lbf: 18, note: "Hand-tight + torque" },
];

export default function TorqueCalcPage() {
  return (
    <div>
      <PageHeader title="Torque calculator" lead="Common tightening torques for engine and brake fasteners." />
      <section className="section max-w-[900px] py-10">
        <div className="rounded-card border border-line-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-alt">
                  <th className="px-5 py-3 text-left font-medium">Fastener</th>
                  <th className="px-5 py-3 text-right font-medium">Nm</th>
                  <th className="px-5 py-3 text-right font-medium">lbf·ft</th>
                  <th className="px-5 py-3 text-left font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((d, i) => (
                  <tr key={i} className={i % 2 ? "" : "bg-white"}>
                    <td className="px-5 py-3 border-t border-line-soft">{d.fastener}</td>
                    <td className="px-5 py-3 border-t border-line-soft text-right tabular-nums">{d.nm}</td>
                    <td className="px-5 py-3 border-t border-line-soft text-right tabular-nums">{d.lbf}</td>
                    <td className="px-5 py-3 border-t border-line-soft text-muted">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">Values are general references. Always follow the vehicle/part manufacturer specification.</p>
        <p className="mt-6">
          <Link href="/tools">← Back to workshop tools</Link>
        </p>
      </section>
    </div>
  );
}
