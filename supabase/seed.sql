-- Seed piloto — metadatos públicos (SIN secrets / SIN tokens).
--
-- access_token_hash se establece con el script local:
--   npm run invites:generate
-- que escribe `.private/seed-token-hashes.sql` (gitignored).
--
-- Tras schema.sql:
--   1) Ejecutar este archivo (crea filas con hash placeholder inválido como candado)
--   2) Ejecutar `.private/seed-token-hashes.sql` para poner los hashes reales
--
-- El placeholder NUNCA coincide con un token SHA-256 válido de 64 hex
-- generado por el script (usa un prefijo no-hex a propósito si se deja sin rotar).

insert into public.invitations (slug, display_name, max_seats, access_token_hash, enabled)
values
  (
    'granados-montero',
    'Familia Granados Montero',
    2,
    'unset:granados-montero',
    true
  ),
  (
    'montero-aguilar',
    'Familia Montero Aguilar',
    3,
    'unset:montero-aguilar',
    true
  ),
  (
    'nava-munoz',
    'Familia Nava Muñoz',
    3,
    'unset:nava-munoz',
    true
  )
on conflict (slug) do update
set
  display_name = excluded.display_name,
  max_seats = excluded.max_seats,
  enabled = excluded.enabled;
  -- access_token_hash NO se sobrescribe aquí (lo gestiona el script privado)

-- Consultas útiles (admin manual / SQL Editor):
--
-- Total invitaciones habilitadas:
--   select count(*) from invitations where enabled;
--
-- Total lugares reservados:
--   select coalesce(sum(max_seats), 0) from invitations where enabled;
--
-- Confirmados (asistirán):
--   select count(*) from rsvps where attending = true;
--
-- Lugares confirmados:
--   select coalesce(sum(confirmed_seats), 0) from rsvps where attending = true;
--
-- Rechazados:
--   select count(*) from rsvps where attending = false;
--
-- Pendientes (sin RSVP):
--   select i.slug, i.display_name, i.max_seats
--   from invitations i
--   left join rsvps r on r.invitation_id = i.id
--   where i.enabled and r.id is null;
--
-- Detectar hashes aún no rotados (placeholder):
--   select slug from invitations where access_token_hash like 'unset:%';
