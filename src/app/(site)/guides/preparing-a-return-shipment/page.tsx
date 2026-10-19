import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Preparing a return shipment",
  description: "Packaging, documents to include and deadlines for a hassle-free return.",
  alternates: { canonical: absoluteUrl("/guides/preparing-a-return-shipment") },
};

export default function GuideReturnsPage() {
  return (
    <div>
      <PageHeader title="Preparing a return shipment" lead="Packaging, documents to include and deadlines for a hassle-free return." />
      <article className="section prose prose-neutral max-w-[820px] py-10">
        <h2>Packaging</h2>
        <ul>
          <li>Use original packaging where possible.</li>
          <li>Protect against damage; avoid loose parts rattling.</li>
          <li>Seal securely with adequate protection.</li>
        </ul>

        <h2>Documents to include</h2>
        <ul>
          <li>Order reference (ARM-XXXXXX).</li>
          <li>Reason for return (brief).</li>
          <li>Any return authorization if requested.</li>
        </ul>

        <h2>Deadlines</h2>
        <p>Respect the return window stated at time of purchase. Return in original condition unless agreed otherwise.</p>
        <p>
          <Link href="/guides">← Back to guides</Link>
        </p>
      </article>
    </div>
  );
}
