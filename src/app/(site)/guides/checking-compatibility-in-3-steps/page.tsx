import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Checking compatibility in 3 steps",
  description: "Make, model, year — the method that stops you ordering the wrong part.",
};

export default function GuideCompatibility3StepsPage() {
  return (
    <div>
      <PageHeader title="Checking compatibility in 3 steps" lead="Make, model, year — the method that stops you ordering the wrong part." />
      <article className="section prose prose-neutral max-w-[820px] py-10">
        <ol>
          <li>
            <h3>1. Identify the basics</h3>
            <p>Get the exact make, model, trim, engine code, and year of manufacture. VIN is best for precision.</p>
          </li>
          <li>
            <h3>2. Match the part number</h3>
            <p>Take the original part number (from the part, invoice, or EPC). Compare against the exact MPN.</p>
          </li>
          <li>
            <h3>3. Verify fitment notes</h3>
            <p>Check specific notes: chassis, options, production dates. If uncertain, ask with VIN + old part number.</p>
          </li>
        </ol>
        <p>
          <Link href="/guides">← Back to guides</Link>
        </p>
      </article>
    </div>
  );
}
