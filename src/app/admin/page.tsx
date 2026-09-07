import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthorizedAdminSession } from "@/lib/admin/session";
import { getAdminGuestStore, isAdminPersistenceReady } from "@/lib/admin/repository";

export default async function AdminDashboardPage() {
  const session = await getAuthorizedAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (!isAdminPersistenceReady()) {
    return (
      <p className="font-sans text-ink-muted" data-testid="admin-unavailable">
        Persistencia admin no disponible en este entorno.
      </p>
    );
  }

  const store = getAdminGuestStore();
  const stats = await store.getStats();

  return (
    <div data-testid="admin-dashboard">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
        Resumen
      </p>
      <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
        Confirmaciones
      </h1>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <StatBlock
          testId="stat-families"
          primary={`${stats.totalFamilies}`}
          label={stats.totalFamilies === 1 ? "familia" : "familias"}
        />
        <StatBlock
          testId="stat-reserved"
          primary={`${stats.totalReservedSeats}`}
          label={stats.totalReservedSeats === 1 ? "lugar reservado" : "lugares reservados"}
        />
      </div>

      <dl className="mt-12 space-y-4 border-t border-taupe/30 pt-8 font-sans text-[1.05rem] text-ink">
        <Row
          testId="stat-confirmed-families"
          label="Confirmadas"
          value={String(stats.confirmedFamilies)}
        />
        <Row
          testId="stat-pending-families"
          label="Pendientes"
          value={String(stats.pendingFamilies)}
        />
        <Row
          testId="stat-declined-families"
          label="No asistirán"
          value={String(stats.declinedFamilies)}
        />
        <Row
          testId="stat-confirmed-seats"
          label="Lugares confirmados"
          value={String(stats.confirmedSeats)}
        />
      </dl>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/guests"
          className="inline-flex min-h-12 items-center justify-center border border-ink/80 bg-ink px-6 py-3 text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-warm-white"
        >
          Ver invitados
        </Link>
        <Link
          href="/admin/guests/new"
          className="inline-flex min-h-12 items-center justify-center border border-taupe/60 bg-transparent px-6 py-3 text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink"
          data-testid="admin-new-invite-cta"
        >
          Nueva invitación
        </Link>
      </div>
    </div>
  );
}

function StatBlock({
  primary,
  label,
  testId,
}: {
  primary: string;
  label: string;
  testId: string;
}) {
  return (
    <div data-testid={testId}>
      <p className="font-display text-[clamp(2.4rem,8vw,3.2rem)] leading-none tracking-[-0.02em]">
        {primary}
      </p>
      <p className="mt-2 font-sans text-[0.9rem] text-ink-muted">{label}</p>
    </div>
  );
}

function Row({
  label,
  value,
  testId,
}: {
  label: string;
  value: string;
  testId: string;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4"
      data-testid={testId}
    >
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-display text-[1.35rem] tracking-[-0.01em]">{value}</dd>
    </div>
  );
}
