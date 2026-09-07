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

      <div className="mt-10 border-b border-taupe/30 pb-10">
        <p
          className="font-display text-[clamp(3rem,12vw,4rem)] leading-none tracking-[-0.03em]"
          data-testid="stat-confirmed-seats"
        >
          {stats.confirmedSeats}
        </p>
        <p className="mt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          Lugares confirmados
        </p>
        <p className="mt-3 font-sans text-[1.05rem] text-ink-muted">
          <span data-testid="stat-confirmed-adults">
            {stats.confirmedAdults}
          </span>{" "}
          {stats.confirmedAdults === 1 ? "adulto" : "adultos"}
          {stats.confirmedChildren > 0 ? (
            <>
              {" · "}
              <span data-testid="stat-confirmed-children">
                {stats.confirmedChildren}
              </span>{" "}
              {stats.confirmedChildren === 1 ? "niño" : "niños"}
            </>
          ) : (
            <span data-testid="stat-confirmed-children" className="sr-only">
              {stats.confirmedChildren}
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
        <StatBlock
          testId="stat-families"
          primary={`${stats.totalFamilies}`}
          label={
            stats.totalFamilies === 1 ? "Invitación" : "Invitaciones"
          }
        />
        <StatBlock
          testId="stat-reserved"
          primary={`${stats.totalReservedSeats}`}
          label={
            stats.totalReservedSeats === 1
              ? "Lugar invitado"
              : "Lugares invitados"
          }
        />
      </div>

      <dl className="mt-10 space-y-3 border-t border-taupe/30 pt-8 font-sans text-[1rem] text-ink">
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
      </dl>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/guests"
          className="inline-flex min-h-12 items-center justify-center border border-ink/80 bg-ink px-6 py-3 text-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-warm-white"
        >
          Ver invitaciones
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
      <p className="font-display text-[clamp(2rem,7vw,2.75rem)] leading-none tracking-[-0.02em]">
        {primary}
      </p>
      <p className="mt-2 font-sans text-[0.8125rem] text-ink-muted">{label}</p>
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
      <dd className="font-display text-[1.25rem] tracking-[-0.01em]">{value}</dd>
    </div>
  );
}
