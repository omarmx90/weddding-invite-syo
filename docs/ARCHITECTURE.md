# Arquitectura — Invitación Silvia & Omar

## Resumen

Aplicación Next.js (App Router) desplegada en Vercel. La UI es una experiencia de invitación mobile-first. Los datos y textos de la boda viven en un módulo tipado de contenido para que los componentes de UI se mantengan presentacionales.

**Locale del producto:** `es-MX` (español de México). Ver `src/lib/locale.ts`.

```
Invitado (celular) → Vercel Edge / CDN → Next.js App Router
                                          ├─ Server Components (shell, metadata, import de contenido)
                                          ├─ Client Components (motion del hero, RSVP interactivo más adelante)
                                          └─ Módulo de contenido (src/content)
                                               └─ (futuro) Supabase para invitados / RSVP
```

## Decisiones de framework

| Elección | Decisión | Por qué |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) | App Router estable, optimización de imagen/fuente, nativo en Vercel |
| Lenguaje | **TypeScript** (strict) | Tipado fuerte para contenido y futuros modelos de invitados |
| Estilos | **Tailwind CSS v4** | Utility-first, poca superficie de CSS, tokens vía variables CSS |
| Motion | **Motion** (`motion`) | Solo para la transición portada → invitación y fades con reduced-motion |
| Imágenes | **`next/image`** | Negociación AVIF/WebP, sizing, lazy loading |
| Persistencia | **Ninguna por ahora** | Contenido estático en TypeScript; Supabase más adelante |
| Testing | Lint + typecheck + build + Playwright | Suficiente para la foundation |

Evitado en v0: Supabase, auth, CMS, librerías de estado, UI kits, video en autoplay, stacks pesados de animación.

## Arquitectura de la aplicación

### Estructura de carpetas

```
docs/                         Documentación de producto e ingeniería
public/
  images/
    placeholders/             Medios locales fáciles de sustituir
src/
  app/                        Rutas App Router, layouts, estilos globales
  components/
    invitation/               Hero, intro, secciones de evento, helpers de motion
    media/                    Primitivas de imagen / atmósfera
  content/                    Textos, fechas, sedes, URLs (fuente de verdad)
  lib/                        Utilidades (p. ej. locale es-MX)
e2e/                          Specs de Playwright + salida visual
```

### Routing (actual vs futuro)

| Ruta | Estado | Rol |
| --- | --- | --- |
| `/` | **Ahora** | Experiencia de invitación general |
| `/i/[slug]` | **Ahora (piloto)** | Invitación personalizada por familia (`src/content/guests.ts`) |
| `/admin/*` | **Futuro** | Panel RSVP (con autenticación) |
| API routes | **Futuro** | Mutaciones RSVP cuando exista Supabase |

Las URLs personalizadas reutilizan `InvitationExperience` con un `guest` opcional resuelto en el servidor. Metadata: `noindex, nofollow`; sin canonical público a `/i/[slug]` y sin Open Graph con nombres de familias.

### Server vs Client Components

**Por defecto: Server Components.**

| Preocupación | Ubicación |
| --- | --- |
| Layout, metadata, fuentes, secciones estáticas | Server |
| Lectura de `src/content/wedding.ts` | Server (import en pages; props hacia islas client) |
| Transición portada → invitación, CTA | Client (`InvitationExperience`) |
| Formularios RSVP futuros | Isla Client |
| Embeds de mapas futuros | Client o iframe diferido |

Regla: no usar `"use client"` salvo que haga falta API del navegador, estado local o motion.

### Estrategia de contenido / datos

- **Ahora:** `src/content/wedding.ts` + `src/content/types.ts` concentran nombres, fecha, copy, medios y logística.
- **Regla de UI:** Los componentes no hardcodean hechos de la boda; reciben contenido por props o imports tipados.
- **Locale:** `es-MX` explícito. Fechas largas vía `formatLongDateEsMx` (`Intl.DateTimeFormat` con `es-MX` y `America/Mexico_City`).
- **Después:** Invitados y RSVPs en Supabase; la narrativa estática puede seguir en git.
- **Imágenes:** Archivos en `public/images/…` referenciados desde el contenido. Sustituir el placeholder sin tocar React.

### Persistencia / RSVP (piloto seguro)

Ver `docs/RSVP.md`.

- Store: Supabase (Production) o memory (local / Preview / e2e).
- DB guarda `access_token_hash` (SHA-256), nunca el token en claro.
- Writes: server action + verificación de hash (slug insuficiente).
- Service role solo en servidor; RLS sin policies públicas.
- Sin token válido: no se revelan familia / lugares / RSVP.

### Routing personalizado futuro

```
/i/[slug] → resolveInvitation(slug) → InvitationExperience + props de invitado
```

- Slugs opacos, URL-safe y aptos para QR (`familia-montero`).
- Slugs desconocidos → not-found suave (mensaje elegante, sin filtrar datos).
- Cupos y saludos son datos, no plantillas de página distintas.

### Arquitectura de deployment

- **Host:** Vercel (Preview + Production).
- **Build:** `next build` (estático donde sea posible; dinámico para `/i/[slug]` futuro).
- **Assets:** Optimización de imagen vía Next/Vercel; cuidar el peso del hero.
- **Env:** Sin secretos en v0. Después: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, keys solo server.

### Consideraciones de seguridad

- No incluir PII en el bundle del cliente más allá de lo que la propia liga del invitado deba mostrar.
- Rutas admin futuras requieren autenticación.
- Endpoints RSVP: rate limit, validar pertenencia del slug, patrones seguros para mutaciones.
- No commitear secretos `.env`; usar env de Vercel + `.env.local` local.
- Las ligas personalizadas son capability URLs — tratar los slugs como suficientemente difíciles de adivinar en contexto de boda; tokens firmados opcionales más adelante.

### Arquitectura de performance

- JS client mínimo: una isla de experiencia para la portada.
- `next/font` para display + sans (sin layout shift).
- Priority solo en el medio del hero; lazy loading abajo.
- Respetar `prefers-reduced-motion`.
- Lighthouse móvil como quality gate al incorporar fotografía.

### Quality gates

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Playwright (Chromium) cubre carga del home, revelado del CTA, visibilidad de ceremonia/recepción y overflow a 360 px. WebKit está preparado para validación Safari futura, pero no forma parte del script por defecto.
