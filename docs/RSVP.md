# RSVP piloto seguro — Silvia & Omar

## Resumen

Confirmación en `/i/[slug]?t=<secret>` con persistencia Supabase (Production)
o store en memoria (local / Preview / Playwright).

Relación **1:1** `invitations` → `rsvps`.

**El secreto nunca se guarda en claro en Git ni en Supabase.**
Solo se almacena `access_token_hash` (SHA-256 hex).

## Flujo de autorización

1. Invitado abre URL con `?t=`
2. Servidor carga invitación por `slug`
3. Calcula `SHA-256(token)` y compara con `access_token_hash` (timing-safe)
4. Solo si coincide: muestra personalización + permite RSVP

Sin token / token incorrecto:
- No se revelan nombre de familia, lugares ni RSVP
- Vista `InvitationAccessDenied`

## Hashing

- Algoritmo: **SHA-256** → digest hex (64 chars)
- Tokens: `crypto.randomBytes(32).toString("base64url")`
- Sin pepper (los tokens ya son de alta entropía; evita env extra)
- Comparación: `timingSafeEqual` sobre digests de longitud fija

## Logging (obligatorio)

Nunca registrar:

- el token en claro
- URLs completas con `t=`
- query strings de `/i/*`

Errores de persistencia: mensaje genérico al invitado.

## Generación privada

```bash
npm run invites:token      # un token
npm run invites:generate   # piloto completo → .private/
```

Salida gitignored:

- `.private/invite-links.json` — URLs privadas
- `.private/seed-token-hashes.sql` — `UPDATE` de hashes

## Seed Supabase

1. `supabase/schema.sql`
2. `supabase/seed.sql` (metadatos; placeholders `unset:…`)
3. `.private/seed-token-hashes.sql` (hashes reales)

## Variables

| Entorno | `RSVP_STORE` | Supabase |
| --- | --- | --- |
| Production | `supabase` | URL + service role de **producción** |
| Preview | `memory` | no reutilizar service role de prod |
| Development | `memory` | opcional proyecto aparte más adelante |

Fail-closed: `RSVP_STORE=supabase` sin credenciales → `unavailable` (nunca memory silencioso en Production).

## RLS

ON. Sin policies públicas. Solo service role server-side.

## Tests

Playwright usa `RSVP_STORE=memory` y obtiene tokens efímeros vía
`GET /api/test/rsvp-reset?slug=…` (solo memory).

Los tokens piloto débiles de la primera implementación fueron rotados y
no deben reaparecer en archivos trackeados (ver tests de seguridad).
