-- Silvia & Omar — esquema RSVP piloto (tokens hasheados)
-- Orden:
--   1) schema.sql
--   2) seed.sql          (metadatos, sin secrets)
--   3) .private/seed-token-hashes.sql  (generado localmente; NO en git)
--
-- Seguridad:
-- - Se almacena access_token_hash (SHA-256 hex), nunca el token en claro.
-- - RLS ON; sin policies públicas.
-- - Acceso solo con service_role desde Next.js (servidor).

create extension if not exists pgcrypto;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  max_seats integer not null check (max_seats > 0),
  access_token_hash text not null unique,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null unique references public.invitations (id) on delete cascade,
  attending boolean not null,
  confirmed_seats integer not null check (confirmed_seats >= 0),
  -- Desglose opcional (nullable = RSVP legado / sin breakdown)
  adult_count integer check (adult_count is null or adult_count >= 0),
  child_count integer check (child_count is null or child_count >= 0),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rsvps_attending_seats_chk check (
    (attending = false and confirmed_seats = 0)
    or (attending = true and confirmed_seats >= 1)
  ),
  constraint rsvps_seat_breakdown_chk check (
    adult_count is null
    or child_count is null
    or confirmed_seats = adult_count + child_count
  )
);

create index if not exists invitations_slug_idx on public.invitations (slug);
create unique index if not exists invitations_access_token_hash_uidx
  on public.invitations (access_token_hash);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rsvps_set_updated_at on public.rsvps;
create trigger rsvps_set_updated_at
before update on public.rsvps
for each row
execute function public.set_updated_at();

alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

-- Sin policies para anon/authenticated → denegado por defecto.
-- service_role bypassa RLS (solo server-side).

revoke all on table public.invitations from anon, authenticated;
revoke all on table public.rsvps from anon, authenticated;
