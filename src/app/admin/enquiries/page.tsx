import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listEnquiries } from "@/lib/enquiries";
import { dateTime } from "@/lib/format";
import { AdminHead, ResponsiveList, Pill } from "@/components/admin/AdminUi";
import { EnquiryActions } from "@/components/admin/ModerationButtons";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

const KIND_TONE = {
  contact: "accent",
  quote: "warning",
  affiliate: "neutral",
  review: "neutral",
  part: "accent",
} as const;

export default async function AdminEnquiriesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const enquiries = await listEnquiries();
  const open = enquiries.filter((e) => !e.handled).length;

  return (
    <>
      <AdminHead
        title="Enquiries"
        subtitle={`${enquiries.length} messages · ${open} still open.`}
      />

      <ResponsiveList
        rows={enquiries}
        getKey={(enquiry) => enquiry.id}
        empty="Inbox is empty — contact, quote and affiliate forms land here."
        columns={[
          {
            key: "id",
            header: "ID",
            render: (enquiry) => (
              <span className="font-mono text-[13px] text-muted">{enquiry.id}</span>
            ),
          },
          {
            key: "kind",
            header: "Kind",
            render: (enquiry) => <Pill tone={KIND_TONE[enquiry.kind]}>{enquiry.kind}</Pill>,
          },
          {
            key: "from",
            header: "From",
            render: (enquiry) => (
              <span className="flex flex-col">
                <span className="font-medium">{enquiry.name}</span>
                <span className="text-[12.5px] text-muted">{enquiry.email}</span>
                {enquiry.phone ? (
                  <span className="text-[12.5px] text-muted tabular-nums">{enquiry.phone}</span>
                ) : null}
              </span>
            ),
          },
          {
            key: "message",
            header: "Message",
            render: (enquiry) => (
              <span className="flex max-w-[420px] flex-col">
                {enquiry.subject ? (
                  <span className="text-[14px] font-medium">{enquiry.subject}</span>
                ) : null}
                <span className="text-[13.5px] text-muted line-clamp-2">
                  {enquiry.message ?? "—"}
                </span>
              </span>
            ),
          },
          {
            key: "received",
            header: "Received",
            render: (enquiry) => (
              <span className="text-muted tabular-nums">
                {enquiry.createdAt ? dateTime(enquiry.createdAt) : "—"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (enquiry) => (
              <Pill tone={enquiry.handled ? "success" : "warning"}>
                {enquiry.handled ? "handled" : "open"}
              </Pill>
            ),
          },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (enquiry) => (
              <EnquiryActions id={enquiry.id} handled={enquiry.handled} />
            ),
          },
        ]}
        tile={(enquiry) => (
          <div className="rounded-card bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-medium">{enquiry.name}</span>
              <Pill tone={enquiry.handled ? "success" : "warning"}>
                {enquiry.handled ? "handled" : "open"}
              </Pill>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Pill tone={KIND_TONE[enquiry.kind]}>{enquiry.kind}</Pill>
              <span className="text-[13px] text-muted">{enquiry.email}</span>
            </div>
            {enquiry.message ? (
              <p className="mt-2 text-[14px] leading-relaxed text-muted line-clamp-4">
                {enquiry.message}
              </p>
            ) : null}
            <p className="mt-2 text-[12.5px] text-muted-light tabular-nums">
              {enquiry.createdAt ? dateTime(enquiry.createdAt) : ""}
            </p>
            <div className="mt-3 flex justify-end border-t border-line-soft pt-3">
              <EnquiryActions id={enquiry.id} handled={enquiry.handled} />
            </div>
          </div>
        )}
      />
    </>
  );
}
