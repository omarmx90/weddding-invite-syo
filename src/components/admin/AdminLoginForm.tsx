"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseAuthBrowserClient } from "@/lib/supabase/auth-browser";

export function AdminLoginForm({
  authConfigured,
  e2eHint,
}: {
  authConfigured: boolean;
  e2eHint: boolean;
}) {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const errorText = useMemo(() => {
    if (errorCode === "unauthorized") {
      return "Este correo no está autorizado para administrar la boda.";
    }
    if (errorCode === "auth") {
      return "No se pudo completar el acceso. Intenta de nuevo.";
    }
    return null;
  }, [errorCode]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (!authConfigured) {
      setStatus("error");
      setMessage(
        e2eHint
          ? "Modo prueba activo: usa el flujo e2e de login."
          : "La autenticación admin aún no está configurada en este entorno.",
      );
      return;
    }

    setStatus("sending");
    try {
      const supabase = createSupabaseAuthBrowserClient();
      const redirectTo = `${window.location.origin}/admin/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });
      if (error) {
        setStatus("error");
        setMessage("No pudimos enviar el enlace. Revisa el correo e intenta otra vez.");
        return;
      }
      setStatus("sent");
      setMessage(
        "Te enviamos un enlace de acceso. Ábrelo desde este dispositivo.",
      );
    } catch {
      setStatus("error");
      setMessage("No pudimos iniciar el acceso en este momento.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md text-center" data-testid="admin-login">
      <hr className="invite-rule mx-auto" aria-hidden="true" />
      <p className="mt-8 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
        Acceso privado
      </p>
      <h1 className="font-display mt-3 text-[clamp(1.7rem,6vw,2.2rem)] leading-snug">
        Administración
      </h1>
      <p className="mt-4 font-sans text-[1rem] leading-relaxed text-ink-muted text-pretty">
        Solo correos autorizados. Te enviaremos un enlace mágico; no usamos
        contraseñas.
      </p>

      <form onSubmit={onSubmit} className="mt-8 text-left">
        <label className="block">
          <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            Correo
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            data-testid="admin-login-email"
            className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3 font-sans text-[1rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          data-testid="admin-login-submit"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center border border-ink/80 bg-ink px-6 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-warm-white disabled:opacity-50"
        >
          {status === "sending" ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>

      {errorText ? (
        <p className="mt-6 font-sans text-[0.9375rem] text-ink-muted" role="alert">
          {errorText}
        </p>
      ) : null}
      {message ? (
        <p
          className="mt-6 font-sans text-[0.9375rem] text-ink-muted"
          data-testid="admin-login-message"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
