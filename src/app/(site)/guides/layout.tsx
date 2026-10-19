import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Practical guides",
    template: "%s — Practical guides — Atelier Richard Méchano",
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
