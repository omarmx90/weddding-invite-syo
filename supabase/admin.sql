-- Guest Manager V1 — tablas admin (reproducible)
-- Ejecutar DESPUÉS de schema.sql en el proyecto Supabase.
--
-- Seguridad:
-- - invitation_secrets: ciphertext AES-256-GCM del capability token (server-only).
-- - Nunca plaintext; nunca reconstruible desde access_token_hash.
-- - admin_audit_events: sin tokens ni URLs con ?t=
-- - RLS ON; sin policies públicas; solo service_role.

create table if not exists public.invitation_secrets (
  invitation_id uuid primary key references public.invitations (id) on delete cascade,
  token_ciphertext text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null check (
    action in (
      'invitation_created',
      'invitation_updated',
      'invitation_disabled',
      'invite_link_rotated'
    )
  ),
  invitation_id uuid references public.invitations (id) on delete set null,
  admin_email text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists admin_audit_events_created_at_idx
  on public.admin_audit_events (created_at desc);

create index if not exists admin_audit_events_invitation_id_idx
  on public.admin_audit_events (invitation_id);

drop trigger if exists invitation_secrets_set_updated_at on public.invitation_secrets;
create trigger invitation_secrets_set_updated_at
before update on public.invitation_secrets
for each row
execute function public.set_updated_at();

alter table public.invitation_secrets enable row level security;
alter table public.admin_audit_events enable row level security;

revoke all on table public.invitation_secrets from anon, authenticated;
revoke all on table public.admin_audit_events from anon, authenticated;
