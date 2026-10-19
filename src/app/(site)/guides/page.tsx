import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Practical guides",
  description: "Buying guides, fitment, returns and workshop basics to get it right the first time.",
};

export default function GuidesHubPage() {
  const guides = [
    {
      href: "/guides/reading-a-manufacturer-reference",
      title: "Reading a manufacturer reference",
      description: "How to decode suffixes, versions and batch codes on a part number.",
      icon: "fa-list-ol",
    },
    {
      href: "/guides/checking-compatibility-in-3-steps",
      title: "Checking compatibility in 3 steps",
      description: "Make, model, year — the method that stops you ordering the wrong part.",
      icon: "fa-check-double",
    },
    {
      href: "/guides/preparing-a-return-shipment",
      title: "Preparing a return shipment",
      description: "Packaging, documents to include and deadlines for a hassle-free return.",
      icon: "fa-box-open",
    },
  ];

  const tools = [
    {
      href: "/tools/torque-calculator",
      title: "Torque calculator",
      description: "Common tightening torques for engine and brake fasteners.",
      icon: "fa-wrench",
    },
    {
      href: "/tools/maintenance-calendar",
      title: "Maintenance calendar",
      description: "Wear intervals worth knowing, system by system.",
      icon: "fa-calendar-check",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Practical guides"
        lead="Buying guides, maintenance and workshop notes to help you get it right the first time."
      />
      <section className="section section-pad">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Guides</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.href} href={g.href} className="card-flat flex gap-4 p-5 transition-colors hover:border-accent">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky text-[14px] text-accent">
                <i className={`fa-solid ${g.icon}`} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold">{g.title}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{g.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-[22px] font-semibold tracking-[-0.02em]">Workshop tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="card-flat flex gap-4 p-5 transition-colors hover:border-accent">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-alt text-[14px] text-ink-soft">
                <i className={`fa-solid ${t.icon}`} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold">{t.title}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
