import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminGuestFilters } from "@/components/admin/AdminGuestFilters";
import { getAuthorizedAdminSession } from "@/lib/admin/session";
import { getAdminGuestStore, isAdminPersistenceReady } from "@/lib/admin/repository";
import { guestMatchesAdminQuery } from "@/lib/admin/search";
import type { GuestRsvpStatus } from "@/lib/admin/types";
import { formatAdminPartyLine } from "@/lib/admin/format";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

function statusLabel(status: GuestRsvpStatus): string {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "No asistirán";
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
  const status: GuestRsvpStatus | "all" | "inactive" =
    statusParam === "confirmed" ||
    statusParam === "declined" ||
    statusParam === "pending" ||
    statusParam === "inactive"
      ? statusParam
      : "all";

  let guests = await getAdminGuestStore().listGuests();
  if (status === "inactive") {
    guests = guests.filter((guest) => !guest.enabled);
  } else if (status !== "all") {
    guests = guests.filter(
      (guest) => guest.enabled && guest.status === status,
    );
  }
  if (query) {
    guests = guests.filter((guest) => guestMatchesAdminQuery(guest, query));
  }

  return (
    <div data-testid="admin-guests">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
            Invitaciones
          </p>
          <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
            Familias
          </h1>
        </div>
        <Link
          href="/admin/guests/new"
          className="inline-flex min-h-12 items-center justify-center border border-ink/80 bg-ink px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-warm-white"
          data-testid="admin-create-guest"
        >
          Nueva invitación
        </Link>
      </div>

      <AdminGuestFilters query={query} status={status} />

      <ul className="mt-6 divide-y divide-taupe/25" data-testid="admin-guest-list">
        {guests.map((guest) => {
          const party = formatAdminPartyLine(guest.adultCount, guest.childCount);
          return (
            <li key={guest.id} className="py-5">
              <Link
                href={`/admin/guests/${guest.id}`}
                className="block min-h-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
                data-testid={`admin-guest-${guest.slug}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-[1.2rem] leading-snug">
                      {guest.displayName}
                    </p>
                    <p className="mt-1 font-sans text-[0.875rem] text-ink-muted">
                      {guest.maxSeats}{" "}
                      {guest.maxSeats === 1 ? "lugar" : "lugares"}
                      {!guest.enabled ? " · Inactiva" : ""}
                    </p>
                  </div>
                  <p className="shrink-0 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                    {statusLabel(guest.status)}
                  </p>
                </div>
                {guest.status === "confirmed" ? (
                  <p className="mt-2 font-sans text-[0.875rem] text-ink-muted">
                    {party || `${guest.confirmedSeats} confirmados`}
                  </p>
                ) : guest.status === "pending" ? (
                  <p className="mt-2 font-sans text-[0.875rem] text-ink-subtle">
                    Esta familia aún no ha respondido.
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {guests.length === 0 ? (
        <p
          className="mt-8 font-sans text-ink-muted"
          data-testid="admin-guests-empty"
        >
          No encontramos familias con ese filtro.
        </p>
      ) : null}
    </div>
  );
}
