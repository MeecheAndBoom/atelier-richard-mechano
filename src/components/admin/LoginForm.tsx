"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <form action={formAction} className="flex w-full max-w-[380px] flex-col gap-5">
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="field"
          placeholder="admin@atelier-richard-mechano.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
          placeholder="••••••••"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-box bg-[#fdeeee] px-4 py-3 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? (
          <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-right-to-bracket text-[12px]" aria-hidden="true" />
        )}
        <span>{pending ? "…" : "Sign in"}</span>
      </button>
    </form>
  );
}
