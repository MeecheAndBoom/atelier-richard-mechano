import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Reading a manufacturer reference",
  description: "How to decode suffixes, versions and batch codes on a part number.",
};

export default function GuideReadingReferencePage() {
  return (
    <div>
      <PageHeader title="Reading a manufacturer reference" lead="How to decode suffixes, versions and batch codes on a part number." />
      <article className="section prose prose-neutral max-w-[820px] py-10">
        <p>Manufacturer part numbers (MPNs) are often compact. Small suffixes can mean a revision, a coating, a packaging change, or a different supplier code.</p>

        <h2>What to look for</h2>
        <ul>
          <li><strong>Base number</strong>: The core reference shared across compatible applications.</li>
          <li><strong>Suffixes</strong>: Often at the end (e.g. A, B, /12, -V) indicating a version.</li>
          <li><strong>Prefixes</strong>: Can denote brand families, lines, or plant codes.</li>
          <li><strong>Batch codes</strong>: Usually separate (print/label) and rarely part of the MPN.</li>
        </ul>

        <h2>Practical tips</h2>
        <ol>
          <li>Match the <em>exact</em> MPN to your vehicle (year/model/engine).</li>
          <li>When in doubt, compare both old and new numbers side by side.</li>
          <li>Supersessions happen — if a number changed, the new one usually replaces the old one.</li>
        </ol>

        <p>
          <Link href="/guides">← Back to guides</Link>
        </p>
      </article>
    </div>
  );
}
