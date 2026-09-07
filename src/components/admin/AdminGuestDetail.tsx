"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { AdminActionSheet } from "@/components/admin/AdminActionSheet";
import {
  disableAdminInvitation,
  generateAdminInviteQr,
  prepareAdminWhatsApp,
  revealAdminInviteUrl,
  rotateAdminInviteLink,
  updateAdminInvitation,
} from "@/lib/admin/actions";
import type { GuestDetail } from "@/lib/admin/types";
import {
  formatAdminConfirmedDate,
  formatAdminPartyLine,
} from "@/lib/admin/format";

function statusLabel(status: GuestDetail["status"]) {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "No asistirán";
  return "Pendiente";
}

type BusyAction =
  | "copy"
  | "whatsapp"
  | "qr"
  | "edit"
  | "rotate"
  | "disable"
  | null;

export function AdminGuestDetail({ guest }: { guest: GuestDetail }) {
  const router = useRouter();
  const menuId = useId();
  const [current, setCurrent] = useState(guest);
  const [revealedUrl, setRevealedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(guest.displayName);
  const [maxSeats, setMaxSeats] = useState(guest.maxSeats);
  const [enabled, setEnabled] = useState(guest.enabled);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [isPending, startTransition] = useTransition();

  const partyLine = formatAdminPartyLine(
    current.adultCount,
    current.childCount,
  );
  const confirmedDate =
    current.status === "confirmed" && current.updatedAt
      ? formatAdminConfirmedDate(current.updatedAt)
      : "";

  function run(kind: BusyAction, action: () => Promise<void>) {
    setError(null);
    setBusy(kind);
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo completar la acción.",
        );
      } finally {
        setBusy(null);
      }
    });
  }

  const blocked = isPending || busy !== null;

  return (
    <div data-testid="admin-guest-detail">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            Familia
          </p>
          <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
            {current.displayName}
          </h1>
          <p className="mt-3 font-sans text-[1rem] text-ink-muted">
            {current.maxSeats}{" "}
            {current.maxSeats === 1 ? "lugar invitado" : "lugares invitados"}
            {!current.enabled ? " · Inactiva" : ""}
          </p>
          <p className="mt-1 font-sans text-[0.8125rem] text-ink-subtle">
            {current.slug}
          </p>
        </div>
        <button
          type="button"
          data-testid="admin-more-actions"
          aria-label="Más acciones"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          disabled={blocked}
          onClick={() => setMenuOpen(true)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-taupe/55 font-sans text-[1.25rem] leading-none text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe disabled:opacity-50"
        >
          <span aria-hidden="true">•••</span>
        </button>
      </div>

      <dl className="mt-8 space-y-4 border-t border-taupe/30 pt-6 font-sans text-[1rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Estado</dt>
          <dd data-testid="admin-detail-status">{statusLabel(current.status)}</dd>
        </div>
        {current.status === "confirmed" ? (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Lugares confirmados</dt>
              <dd data-testid="admin-detail-seats">
                {current.confirmedSeats} de {current.maxSeats}
              </dd>
            </div>
            {partyLine ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Desglose</dt>
                <dd data-testid="admin-detail-breakdown">{partyLine}</dd>
              </div>
            ) : (
              <div className="sr-only" data-testid="admin-detail-breakdown">
                {current.adultCount} adultos · {current.childCount} niños
              </div>
            )}
            {confirmedDate ? (
              <p className="font-sans text-[0.875rem] text-ink-subtle">
                {confirmedDate}
              </p>
            ) : null}
          </>
        ) : current.status === "pending" ? (
          <p
            className="font-sans text-[0.9375rem] text-ink-muted"
            data-testid="admin-detail-pending-note"
          >
            Esta familia aún no ha respondido.
          </p>
        ) : null}
        {current.message ? (
          <div className="pt-2">
            <dt className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink-subtle">
              Mensaje
            </dt>
            <dd
              className="mt-2 text-pretty font-display text-[1.15rem] leading-snug text-ink"
              data-testid="admin-detail-message"
            >
              “{current.message}”
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Activa</dt>
          <dd data-testid="admin-detail-enabled">
            {current.enabled ? "Sí" : "No"}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-col gap-3">
        <PrimaryButton
          testId="admin-copy-invite"
          label={copied ? "Enlace copiado" : "Copiar invitación"}
          disabled={blocked}
          busy={busy === "copy"}
          onClick={() =>
            run("copy", async () => {
              const result = await revealAdminInviteUrl(current.id);
              if (!result.ok) throw new Error(result.message);
              await navigator.clipboard.writeText(result.data.inviteUrl);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            })
          }
        />
        <PrimaryButton
          testId="admin-prepare-whatsapp"
          label="Enviar por WhatsApp"
          variant="secondary"
          disabled={blocked}
          busy={busy === "whatsapp"}
          onClick={() =>
            run("whatsapp", async () => {
              const result = await prepareAdminWhatsApp(current.id);
              if (!result.ok) throw new Error(result.message);
              setWhatsapp(result.data.message);
              setWhatsappHref(result.data.shareHref);
            })
          }
        />
      </div>

      <AdminActionSheet
        open={menuOpen}
        title="Más acciones"
        onClose={() => setMenuOpen(false)}
        testId="admin-action-sheet"
      >
        <div id={menuId} className="flex flex-col gap-2">
          <SheetButton
            testId="admin-show-qr"
            label="Ver QR"
            disabled={blocked}
            busy={busy === "qr"}
            onClick={() => {
              setMenuOpen(false);
              run("qr", async () => {
                const result = await generateAdminInviteQr(current.id);
                if (!result.ok) throw new Error(result.message);
                setQrDataUrl(result.data.pngDataUrl);
                setQrOpen(true);
              });
            }}
          />
          <SheetButton
            testId="admin-edit-toggle"
            label={editing ? "Cerrar edición" : "Editar"}
            disabled={blocked}
            onClick={() => {
              setMenuOpen(false);
              setEditing((value) => !value);
            }}
          />
          <SheetButton
            testId="admin-rotate-link"
            label="Rotar enlace"
            tone="caution"
            disabled={blocked}
            busy={busy === "rotate"}
            onClick={() => {
              setMenuOpen(false);
              run("rotate", async () => {
                const confirmed = window.confirm(
                  "Esto invalida el enlace anterior de inmediato. ¿Continuar?",
                );
                if (!confirmed) return;
                const result = await rotateAdminInviteLink(current.id);
                if (!result.ok) throw new Error(result.message);
                setRevealedUrl(result.data.inviteUrl);
                setQrDataUrl(null);
                setQrOpen(false);
                setWhatsapp(null);
                setWhatsappHref(null);
              });
            }}
          />
          {current.enabled ? (
            <SheetButton
              testId="admin-disable"
              label="Desactivar invitación"
              tone="caution"
              disabled={blocked}
              busy={busy === "disable"}
              onClick={() => {
                setMenuOpen(false);
                run("disable", async () => {
                  const confirmed = window.confirm(
                    "La familia dejará de poder abrir la invitación. ¿Desactivar?",
                  );
                  if (!confirmed) return;
                  const result = await disableAdminInvitation(current.id);
                  if (!result.ok) throw new Error(result.message);
                  setCurrent(result.data);
                  setEnabled(false);
                  router.refresh();
                });
              }}
            />
          ) : null}
        </div>
      </AdminActionSheet>

      {editing ? (
        <form
          className="mt-8 space-y-4 border-t border-taupe/30 pt-6"
          data-testid="admin-edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            run("edit", async () => {
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
              className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3.5 font-sans text-[1rem]"
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
              className="mt-2 w-full border border-taupe/50 bg-warm-white px-4 py-3.5 font-sans text-[1rem]"
            />
          </label>
          <label className="flex min-h-11 items-center gap-3 font-sans text-[0.95rem]">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              data-testid="admin-edit-enabled"
              className="h-5 w-5"
            />
            Invitación activa
          </label>
          <button
            type="submit"
            disabled={blocked}
            aria-busy={busy === "edit"}
            data-testid="admin-edit-save"
            className="inline-flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white disabled:opacity-50 sm:w-auto"
          >
            Guardar cambios
          </button>
        </form>
      ) : null}

      {revealedUrl ? (
        <div className="mt-8" data-testid="admin-revealed-url">
          <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            Nuevo enlace (una vez)
          </p>
          <textarea
            readOnly
            value={revealedUrl}
            className="mt-2 min-h-[4.5rem] w-full border border-taupe/50 bg-warm-white px-3 py-2 font-sans text-[0.8125rem]"
          />
        </div>
      ) : null}

      {qrOpen && qrDataUrl ? (
        <QrSheet
          familyName={current.displayName}
          qrDataUrl={qrDataUrl}
          slug={current.slug}
          onClose={() => setQrOpen(false)}
          onCopyInvite={() =>
            run("copy", async () => {
              const result = await revealAdminInviteUrl(current.id);
              if (!result.ok) throw new Error(result.message);
              await navigator.clipboard.writeText(result.data.inviteUrl);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            })
          }
          copyBusy={busy === "copy"}
          copyLabel={copied ? "Enlace copiado" : "Copiar invitación"}
          blocked={blocked}
        />
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

function PrimaryButton({
  label,
  onClick,
  disabled,
  busy,
  testId,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  testId: string;
  variant?: "primary" | "secondary";
}) {
  const primary = variant === "primary";
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      aria-busy={busy || undefined}
      onClick={onClick}
      className={`inline-flex min-h-12 w-full items-center justify-center px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe disabled:opacity-50 ${
        primary
          ? "border border-ink bg-ink text-warm-white"
          : "border border-taupe/55 bg-transparent text-ink hover:border-taupe hover:bg-beige/40"
      }`}
    >
      {label}
    </button>
  );
}

function SheetButton({
  label,
  onClick,
  disabled,
  busy,
  testId,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  testId: string;
  tone?: "default" | "caution";
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      aria-busy={busy || undefined}
      onClick={onClick}
      className={`inline-flex min-h-12 w-full items-center justify-start border px-4 py-3 text-left font-sans text-[0.8125rem] tracking-[0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe disabled:opacity-50 ${
        tone === "caution"
          ? "border-taupe/40 text-ink-muted"
          : "border-taupe/50 text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function QrSheet({
  familyName,
  qrDataUrl,
  slug,
  onClose,
  onCopyInvite,
  copyBusy,
  copyLabel,
  blocked,
}: {
  familyName: string;
  qrDataUrl: string;
  slug: string;
  onClose: () => void;
  onCopyInvite: () => void;
  copyBusy?: boolean;
  copyLabel: string;
  blocked: boolean;
}) {
  return (
    <AdminActionSheet
      open
      title="Código QR"
      onClose={onClose}
      testId="admin-qr"
    >
      <p className="mb-4 font-display text-[1.25rem] leading-snug text-ink">
        {familyName}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrDataUrl}
        alt={`Código QR de la invitación de ${familyName}`}
        className="mx-auto h-64 w-64 max-w-full border border-taupe/30 bg-warm-white p-3"
      />
      <div className="mt-5 flex flex-col gap-2">
        <PrimaryButton
          testId="admin-qr-copy-invite"
          label={copyLabel}
          disabled={blocked}
          busy={copyBusy}
          onClick={onCopyInvite}
        />
        <a
          href={qrDataUrl}
          download={`${slug}-invitacion.png`}
          className="inline-flex min-h-12 items-center justify-center border border-taupe/60 px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink"
          data-testid="admin-qr-download"
        >
          Descargar PNG
        </a>
      </div>
    </AdminActionSheet>
  );
}
