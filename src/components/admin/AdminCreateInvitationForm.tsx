"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createAdminInvitation } from "@/lib/admin/actions";

export function AdminCreateInvitationForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [maxSeats, setMaxSeats] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createAdminInvitation({
        displayName,
        maxSeats,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setInviteUrl(result.data.inviteUrl);
    });
  }

  if (inviteUrl) {
    return (
      <div data-testid="admin-invite-created">
        <p className="font-display text-[clamp(1.4rem,4vw,1.8rem)] leading-snug">
          Invitación lista
        </p>
        <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
          Guarda este enlace ahora. Es privado y no se vuelve a mostrar a menos
          que lo copies o regeneres desde el detalle.
        </p>
        <label className="mt-6 block">
          <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            Enlace privado
          </span>
          <textarea
            readOnly
            value={inviteUrl}
            data-testid="admin-created-invite-url"
            className="mt-2 min-h-[5.5rem] w-full border border-taupe/50 bg-warm-white px-3 py-2 font-sans text-[0.875rem] text-ink"
          />
        </label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            data-testid="admin-copy-created-url"
            className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white"
            onClick={async () => {
              await navigator.clipboard.writeText(inviteUrl);
            }}
          >
            Copiar enlace
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center border border-taupe/60 px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink"
            onClick={() => router.push("/admin/guests")}
          >
            Ir a invitados
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md" data-testid="admin-create-form">
      <label className="block">
        <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          Nombre de familia
        </span>
        <input
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Familia Pérez López"
          data-testid="admin-create-name"
          className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3 font-sans text-[1rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
        />
      </label>
      <label className="mt-6 block">
        <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          Lugares
        </span>
        <input
          type="number"
          required
          min={1}
          max={20}
          value={maxSeats}
          onChange={(event) => setMaxSeats(Number(event.target.value))}
          data-testid="admin-create-seats"
          className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3 font-sans text-[1rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
        />
      </label>
      {error ? (
        <p className="mt-4 font-sans text-[0.9375rem] text-ink-muted" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        data-testid="admin-create-submit"
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-6 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-warm-white disabled:opacity-50"
      >
        {isPending ? "Guardando…" : "Crear invitación"}
      </button>
    </form>
  );
}
