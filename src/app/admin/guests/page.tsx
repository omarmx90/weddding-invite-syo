import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminGuestFilters } from "@/components/admin/AdminGuestFilters";
import { getAuthorizedAdminSession } from "@/lib/admin/session";
import { getAdminGuestStore, isAdminPersistenceReady } from "@/lib/admin/repository";
import type { GuestRsvpStatus } from "@/lib/admin/types";
import { formatAdminDateTime } from "@/lib/admin/format";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

function statusLabel(status: GuestRsvpStatus): string {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "No asistirá";
  return "Pendiente";
}

export default async function AdminGuestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAuthorizedAdminSession();
  if (!session) redirect("/admin/login");
  if (!isAdminPersistenceReady()) {
    return <p data-testid="admin-unavailable">Admin no disponible.</p>;
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const statusParam = params.status;
  const status: GuestRsvpStatus | "all" =
    statusParam === "confirmed" ||
    statusParam === "declined" ||
    statusParam === "pending"
      ? statusParam
      : "all";

  let guests = await getAdminGuestStore().listGuests();
  if (status !== "all") {
    guests = guests.filter((guest) => guest.status === status);
  }
  if (query) {
    const q = query.toLowerCase();
    guests = guests.filter((guest) =>
      guest.displayName.toLowerCase().includes(q),
    );
  }

  return (
    <div data-testid="admin-guests">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            Invitados
          </p>
          <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
            Familias
          </h1>
        </div>
        <Link
          href="/admin/guests/new"
          className="inline-flex min-h-11 items-center justify-center border border-ink/80 bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white"
          data-testid="admin-create-guest"
        >
          Nueva invitación
        </Link>
      </div>

      <AdminGuestFilters query={query} status={status} />

      <ul className="mt-8 divide-y divide-taupe/25" data-testid="admin-guest-list">
        {guests.map((guest) => (
          <li key={guest.id} className="py-5">
            <Link
              href={`/admin/guests/${guest.id}`}
              className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
              data-testid={`admin-guest-${guest.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-[1.2rem] leading-snug">
                    {guest.displayName}
                  </p>
                  <p className="mt-1 font-sans text-[0.875rem] text-ink-muted">
                    {guest.maxSeats}{" "}
                    {guest.maxSeats === 1 ? "lugar" : "lugares"}
                    {!guest.enabled ? " · Desactivada" : ""}
                  </p>
                </div>
                <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                  {statusLabel(guest.status)}
                </p>
              </div>
              <p className="mt-2 font-sans text-[0.875rem] text-ink-muted">
                {guest.status === "confirmed"
                  ? `${guest.confirmedSeats} de ${guest.maxSeats} confirmados`
                  : guest.status === "declined"
                    ? "No asistirán"
                    : "Sin respuesta"}
                {guest.updatedAt
                  ? ` · ${formatAdminDateTime(guest.updatedAt)}`
                  : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {guests.length === 0 ? (
        <p className="mt-8 font-sans text-ink-muted" data-testid="admin-guests-empty">
          No hay familias con ese filtro.
        </p>
      ) : null}
    </div>
  );
}
