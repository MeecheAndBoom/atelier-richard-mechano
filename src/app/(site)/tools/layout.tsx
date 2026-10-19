import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Workshop tools",
    template: "%s — Workshop tools — Atelier Richard Méchano",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
