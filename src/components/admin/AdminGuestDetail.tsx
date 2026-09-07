"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  disableAdminInvitation,
  generateAdminInviteQr,
  prepareAdminWhatsApp,
  revealAdminInviteUrl,
  rotateAdminInviteLink,
  updateAdminInvitation,
} from "@/lib/admin/actions";
import type { GuestDetail } from "@/lib/admin/types";
import { formatAdminDateTime } from "@/lib/admin/format";

function statusLabel(status: GuestDetail["status"]) {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "No asistirá";
  return "Pendiente";
}

export function AdminGuestDetail({ guest }: { guest: GuestDetail }) {
  const router = useRouter();
  const [current, setCurrent] = useState(guest);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(guest.displayName);
  const [maxSeats, setMaxSeats] = useState(guest.maxSeats);
  const [enabled, setEnabled] = useState(guest.enabled);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo completar la acción.",
        );
      }
    });
  }

  return (
    <div data-testid="admin-guest-detail">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
        Familia
      </p>
      <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
        {current.displayName}
      </h1>
      <p className="mt-3 font-sans text-[1rem] text-ink-muted">
        {current.maxSeats}{" "}
        {current.maxSeats === 1 ? "lugar reservado" : "lugares reservados"}
      </p>

      <dl className="mt-8 space-y-3 border-t border-taupe/30 pt-6 font-sans text-[1rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Estado</dt>
          <dd data-testid="admin-detail-status">{statusLabel(current.status)}</dd>
        </div>
        {current.status === "confirmed" ? (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Confirmados</dt>
              <dd data-testid="admin-detail-seats">
                {current.confirmedSeats} de {current.maxSeats}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Desglose</dt>
              <dd data-testid="admin-detail-breakdown">
                {current.adultCount}{" "}
                {current.adultCount === 1 ? "adulto" : "adultos"} ·{" "}
                {current.childCount}{" "}
                {current.childCount === 1 ? "niño" : "niños"}
              </dd>
            </div>
          </>
        ) : null}
        {current.message ? (
          <div>
            <dt className="text-ink-muted">Mensaje</dt>
            <dd className="mt-1 text-pretty" data-testid="admin-detail-message">
              {current.message}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Actualización</dt>
          <dd>
            {current.updatedAt
              ? formatAdminDateTime(current.updatedAt)
              : "Sin respuesta"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Activa</dt>
          <dd data-testid="admin-detail-enabled">
            {current.enabled ? "Sí" : "No"}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-col gap-3">
        <ActionButton
          testId="admin-copy-invite"
          label={copied ? "Enlace copiado" : "Copiar invitación"}
          disabled={isPending}
          onClick={() =>
            run(async () => {
              const result = await revealAdminInviteUrl(current.id);
              if (!result.ok) throw new Error(result.message);
              setInviteUrl(result.data.inviteUrl);
              await navigator.clipboard.writeText(result.data.inviteUrl);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            })
          }
        />
        <ActionButton
          testId="admin-show-qr"
          label="Ver QR"
          disabled={isPending}
          onClick={() =>
            run(async () => {
              const result = await generateAdminInviteQr(current.id);
              if (!result.ok) throw new Error(result.message);
              setQrDataUrl(result.data.pngDataUrl);
            })
          }
        />
        <ActionButton
          testId="admin-prepare-whatsapp"
          label="Preparar WhatsApp"
          disabled={isPending}
          onClick={() =>
            run(async () => {
              const result = await prepareAdminWhatsApp(current.id);
              if (!result.ok) throw new Error(result.message);
              setWhatsapp(result.data.message);
              setWhatsappHref(result.data.shareHref);
              setInviteUrl(result.data.inviteUrl);
            })
          }
        />
        <ActionButton
          testId="admin-rotate-link"
          label="Regenerar enlace"
          disabled={isPending}
          onClick={() =>
            run(async () => {
              const confirmed = window.confirm(
                "Esto invalida el enlace anterior de inmediato. ¿Continuar?",
              );
              if (!confirmed) return;
              const result = await rotateAdminInviteLink(current.id);
              if (!result.ok) throw new Error(result.message);
              setInviteUrl(result.data.inviteUrl);
              setQrDataUrl(null);
              setWhatsapp(null);
            })
          }
        />
        <ActionButton
          testId="admin-edit-toggle"
          label={editing ? "Cerrar edición" : "Editar"}
          disabled={isPending}
          onClick={() => setEditing((value) => !value)}
        />
        {current.enabled ? (
          <ActionButton
            testId="admin-disable"
            label="Desactivar invitación"
            disabled={isPending}
            onClick={() =>
              run(async () => {
                const confirmed = window.confirm(
                  "La familia dejará de poder abrir la invitación. ¿Desactivar?",
                );
                if (!confirmed) return;
                const result = await disableAdminInvitation(current.id);
                if (!result.ok) throw new Error(result.message);
                setCurrent(result.data);
                setEnabled(false);
                router.refresh();
              })
            }
          />
        ) : null}
      </div>

      {editing ? (
        <form
          className="mt-8 space-y-4 border-t border-taupe/30 pt-6"
          data-testid="admin-edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              const result = await updateAdminInvitation({
                invitationId: current.id,
                displayName,
                maxSeats,
                enabled,
              });
              if (!result.ok) throw new Error(result.message);
              setCurrent(result.data);
              setEditing(false);
              router.refresh();
            });
          }}
        >
          <label className="block">
            <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              Nombre
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              data-testid="admin-edit-name"
              className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3 font-sans text-[1rem]"
            />
          </label>
          <label className="block">
            <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              Lugares
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={maxSeats}
              onChange={(event) => setMaxSeats(Number(event.target.value))}
              data-testid="admin-edit-seats"
              className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3 font-sans text-[1rem]"
            />
          </label>
          <label className="flex items-center gap-3 font-sans text-[0.95rem]">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              data-testid="admin-edit-enabled"
            />
            Invitación activa
          </label>
          <button
            type="submit"
            disabled={isPending}
            data-testid="admin-edit-save"
            className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white disabled:opacity-50"
          >
            Guardar cambios
          </button>
        </form>
      ) : null}

      {inviteUrl ? (
        <div className="mt-8" data-testid="admin-revealed-url">
          <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            Enlace privado
          </p>
          <textarea
            readOnly
            value={inviteUrl}
            className="mt-2 min-h-[4.5rem] w-full border border-taupe/50 bg-warm-white px-3 py-2 font-sans text-[0.8125rem]"
          />
        </div>
      ) : null}

      {qrDataUrl ? (
        <div className="mt-8 text-center" data-testid="admin-qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Código QR de la invitación privada"
            className="mx-auto h-56 w-56 border border-taupe/30 bg-warm-white p-3"
          />
          <a
            href={qrDataUrl}
            download={`${current.slug}-invitacion.png`}
            className="mt-4 inline-flex min-h-11 items-center justify-center border border-taupe/60 px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink"
            data-testid="admin-qr-download"
          >
            Descargar PNG
          </a>
        </div>
      ) : null}

      {whatsapp ? (
        <div className="mt-8" data-testid="admin-whatsapp">
          <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            Mensaje WhatsApp
          </p>
          <textarea
            readOnly
            value={whatsapp}
            className="mt-2 min-h-[12rem] w-full border border-taupe/50 bg-warm-white px-3 py-2 font-sans text-[0.875rem] leading-relaxed"
            data-testid="admin-whatsapp-message"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white"
              onClick={async () => {
                await navigator.clipboard.writeText(whatsapp);
              }}
            >
              Copiar mensaje
            </button>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center border border-taupe/60 px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink"
                data-testid="admin-whatsapp-open"
              >
                Abrir WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 font-sans text-[0.9375rem] text-ink-muted" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  testId,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 w-full items-center justify-center border border-taupe/55 bg-transparent px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:border-taupe hover:bg-beige/40 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
