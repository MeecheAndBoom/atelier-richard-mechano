"use client";

import { useTransition } from "react";
import {
  deleteEnquiryAction,
  deleteReviewAction,
  setEnquiryHandledAction,
  setReviewPublishedAction,
} from "@/actions/admin";
import { ConfirmAction } from "@/components/admin/DeleteButton";

/** Publish / unpublish + delete for a customer review. */
export function ReviewActions({
  date,
  published,
}: {
  date: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setReviewPublishedAction(date, !published);
          })
        }
        className="btn btn-ghost btn-sm"
      >
        <i
          className={`fa-solid ${pending ? "fa-circle-notch animate-spin" : published ? "fa-eye-slash" : "fa-eye"} text-[12px]`}
          aria-hidden="true"
        />
        <span>{published ? "Unpublish" : "Publish"}</span>
      </button>
      <ConfirmAction
        onConfirm={() => deleteReviewAction(date)}
        label="Delete"
        confirmLabel="Confirm delete"
      />
    </div>
  );
}

/** Mark handled/unhandled + delete for an enquiry. */
export function EnquiryActions({
  id,
  handled,
}: {
  id: string;
  handled: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setEnquiryHandledAction(id, !handled);
          })
        }
        className="btn btn-ghost btn-sm"
      >
        <i
          className={`fa-solid ${pending ? "fa-circle-notch animate-spin" : handled ? "fa-rotate-left" : "fa-check"} text-[12px]`}
          aria-hidden="true"
        />
        <span>{handled ? "Reopen" : "Mark handled"}</span>
      </button>
      <ConfirmAction
        onConfirm={() => deleteEnquiryAction(id)}
        label="Delete"
        confirmLabel="Confirm delete"
      />
    </div>
  );
}
