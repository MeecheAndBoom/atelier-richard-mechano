import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { SITE } from "@/lib/constants";

export const styles = {
  body: {
    backgroundColor: "#f5f5f7",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    margin: 0,
    padding: "32px 16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "560px",
    padding: "36px 32px",
  },
  h1: {
    color: "#111111",
    fontSize: "24px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    margin: "0 0 8px",
  },
  text: {
    color: "#3a3a3c",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 14px",
  },
  muted: { color: "#6e6e73", fontSize: "13px", lineHeight: "1.5" },
  code: {
    backgroundColor: "#f5f5f7",
    borderRadius: "10px",
    color: "#111111",
    display: "block",
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    margin: "16px 0",
    padding: "14px 18px",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#0071e3",
    borderRadius: "980px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 500,
    margin: "8px 0 20px",
    padding: "12px 26px",
    textDecoration: "none",
  },
  table: {
    width: "100%" as const,
    borderCollapse: "collapse" as const,
    margin: "8px 0 16px",
  },
  row: { padding: "8px 0", borderBottom: "1px solid #ececf0" },
  cell: {
    color: "#111111",
    fontSize: "14px",
    padding: "6px 0",
    verticalAlign: "top" as const,
  },
  cellRight: {
    color: "#111111",
    fontSize: "14px",
    padding: "6px 0",
    textAlign: "right" as const,
    verticalAlign: "top" as const,
  },
  total: { fontWeight: 600, fontSize: "16px" },
};

export type EmailShellProps = {
  lang: "fr" | "en";
  preview: string;
  heading: string;
  children: React.ReactNode;
  cta?: { label: string; href: string };
  reference?: string;
};

/**
 * Shared shell for every transactional email — same typography and pill CTA
 * as the storefront so the brand reads consistently in inbox and browser.
 */
export function EmailShell({
  lang,
  preview,
  heading,
  children,
  cta,
  reference,
}: EmailShellProps) {
  const footer =
    lang === "fr"
      ? `© ${new Date().getFullYear()} ${SITE.name} — ${SITE.address}`
      : `© ${new Date().getFullYear()} ${SITE.name} — ${SITE.address}`;

  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.card}>
          <Heading style={styles.h1}>{heading}</Heading>
          {reference ? (
            <div style={styles.code}>{reference}</div>
          ) : null}
          <Section>{children}</Section>
          {cta ? (
            <Button href={cta.href} style={styles.button}>
              {cta.label}
            </Button>
          ) : null}
          <Hr style={{ borderColor: "#ececf0", margin: "20px 0 16px" }} />
          <Text style={styles.muted}>{footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

/** Two-column label/value rows for order summaries. */
export function SummaryRows({
  rows,
  totalRow,
}: {
  rows: { label: string; value: string }[];
  totalRow?: { label: string; value: string };
}) {
  return (
    <table style={styles.table}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} style={styles.row}>
            <td style={styles.cell}>{row.label}</td>
            <td style={styles.cellRight}>{row.value}</td>
          </tr>
        ))}
        {totalRow ? (
          <tr>
            <td style={{ ...styles.cell, ...styles.total }}>
              {totalRow.label}
            </td>
            <td style={{ ...styles.cellRight, ...styles.total }}>
              {totalRow.value}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
