# Guest Manager privado (`/admin`)

## Objetivo

Administrar familias, ligas privadas y confirmaciones RSVP sin abrir Supabase
a mano. Herramienta privada, editorial y fail-closed.

## Auth

1. **Producción:** Supabase Auth magic link (OTP email).
2. Allowlist server-side: `ADMIN_EMAILS=a@x.com,b@y.com`
3. Callback: `/admin/auth/callback`
4. Middleware protege `/admin/*` excepto login/callback.
5. Email fuera de allowlist → rechazo + sign-out.

**E2E / local memory:** `ADMIN_AUTH_MODE=test` + `ADMIN_E2E_SECRET`  
Solo si `RSVP_STORE=memory` y **nunca** en Vercel Production.

## Tokens (estrategia A)

Capability URL: `/i/<slug>?t=<token>`

- DB pública de invitaciones: solo `access_token_hash` (SHA-256)
- Tabla `invitation_secrets`: ciphertext AES-256-GCM
- Clave: `INVITE_TOKEN_ENCRYPTION_KEY` (32 bytes hex/base64), solo servidor
- El admin puede revelar/copiar/QR/WhatsApp tras autenticarse
- Rotar enlace: nuevo token + nuevo hash + nuevo ciphertext; RSVP se conserva

No se puede reconstruir el token desde el hash.

Piloto previo en `.private/invite-links.json`: tras desplegar admin, o bien
regeneras enlace en UI, o ejecutas el script de backfill (ver abajo).

## Tablas

Ver `supabase/admin.sql`:

- `invitation_secrets`
- `admin_audit_events` (`invitation_created|updated|disabled|invite_link_rotated`)

Sin tokens ni URLs con `?t=` en auditoría.

## Variables

| Variable | Uso |
| --- | --- |
| `ADMIN_EMAILS` | Allowlist |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth browser/middleware |
| `NEXT_PUBLIC_SUPABASE_URL` | Opcional; fallback `SUPABASE_URL` |
| `SUPABASE_URL` | Auth + service |
| `SUPABASE_SERVICE_ROLE_KEY` | Store admin (server) |
| `INVITE_TOKEN_ENCRYPTION_KEY` | AES-256-GCM |
| `INVITE_SITE_URL` | Base de ligas |
| `ADMIN_AUTH_MODE=test` | Solo e2e/local |
| `ADMIN_E2E_SECRET` | Solo e2e/local |

## Setup manual (Omar)

1. Aplicar `supabase/admin.sql` en el SQL Editor del proyecto.
2. Auth → providers → Email (magic link) ON.
3. **URL Configuration** → Auth → URL Configuration (Supabase Dashboard)
   - **Site URL:** `https://silvia-y-omar.com` (NUNCA `http://localhost:3000`)
   - **Redirect URLs** (exactas, sin wildcards amplios):
     - `https://silvia-y-omar.com/admin/auth/callback`
     - (opcional local) `http://127.0.0.1:3000/admin/auth/callback`

Si el magic link falla con `localhost:3000/?error=…`, el Site URL de Supabase
sigue apuntando a localhost: corrígelo y solicita un enlace **nuevo**.
4. Vercel Production env: allowlist, anon key, encryption key, `RSVP_STORE=supabase`.
5. **No** poner service role ni encryption key en `NEXT_PUBLIC_*`.
6. Backfill de secretos del piloto (opcional):
   `node scripts/seed-admin-secrets-from-private.mjs`  
   (lee `.private/invite-links.json`; imprime SQL — no loguea tokens).
7. Probar `/admin/login` con un correo allowlisted.

## Seguridad

- `/admin` noindex
- Service role solo server
- QR generado on-demand (data URL), no CDN pública
- Mensajes de error genéricos al cliente no admin
- Preview no debe reutilizar service role de producción para writes admin
