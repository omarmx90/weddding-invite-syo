-- Silvia & Omar — RSVP adult/child breakdown (BACKWARD COMPATIBLE)
--
-- STOP GATE: NO aplicar en Supabase Production hasta aprobación explícita.
--
-- Qué hace:
--   1) Agrega adult_count / child_count NULLABLE
--   2) Conserva confirmed_seats como total canónico
--   3) Backfill seguro: attending → adult_count = confirmed_seats, child_count = 0
--      declined/pending rows: adult_count = 0, child_count = 0 cuando attending = false
--   4) Constraint: si ambos counts están presentes, suman confirmed_seats
--
-- Qué NO hace:
--   - No borra filas
--   - No cambia attending / message / timestamps
--   - No reduce confirmed_seats
--
-- Idempotente: se puede re-ejecutar.

alter table public.rsvps
  add column if not exists adult_count integer;

alter table public.rsvps
  add column if not exists child_count integer;

-- Asegurar checks de no-negatividad (idempotente vía drop/add)
alter table public.rsvps
  drop constraint if exists rsvps_adult_count_nonneg;

alter table public.rsvps
  add constraint rsvps_adult_count_nonneg
  check (adult_count is null or adult_count >= 0);

alter table public.rsvps
  drop constraint if exists rsvps_child_count_nonneg;

alter table public.rsvps
  add constraint rsvps_child_count_nonneg
  check (child_count is null or child_count >= 0);

-- Backfill solo donde falte desglose
update public.rsvps
set
  adult_count = case
    when attending then confirmed_seats
    else 0
  end,
  child_count = 0
where adult_count is null
   or child_count is null;

alter table public.rsvps
  drop constraint if exists rsvps_seat_breakdown_chk;

alter table public.rsvps
  add constraint rsvps_seat_breakdown_chk
  check (
    adult_count is null
    or child_count is null
    or confirmed_seats = adult_count + child_count
  );

-- Verificación sugerida (solo lectura):
-- select invitation_id, attending, confirmed_seats, adult_count, child_count
-- from public.rsvps
-- order by updated_at desc;
