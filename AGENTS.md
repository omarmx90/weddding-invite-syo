<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Instrucciones permanentes para agentes de IA

Proyecto: invitación digital de boda de Silvia & Omar.

## Idioma

- Idioma del producto: **español de México (`es-MX`)**.
- Todo contenido visible al usuario debe estar en español de México.
- Toda documentación del repositorio debe escribirse en español de México.
- Accesibilidad (`aria-*`, `alt`, labels) y metadata/SEO deben estar en español.
- Mensajes de validación y errores futuros: español de México.
- Identificadores técnicos permanecen normalmente en inglés (`EventSection`, `handleRSVP`, `weddingDate`).
- Terminología estándar de ingeniería puede permanecer en inglés (Next.js, App Router, Server Components, Playwright, Vercel, Supabase, Core Web Vitals, etc.).
- No introducir contenido visible en inglés sin justificación explícita.
- No traducir mecánicamente; usar español natural, elegante y apropiado para una boda mexicana.
- Fechas textuales largas en formato mexicano (`Viernes 16 de octubre de 2026`); usar `es-MX` explícito con `Intl` (`src/lib/locale.ts`).

## Producto

- Mobile-first; iPhone Safari y Android Chrome son targets primarios (~360–430 px).
- Experiencia premium, elegante, romántica, cálida y editorial.
- Paleta: warm white / beige / sand / taupe; texto en tinta cálida (no negro puro).
- Evitar apariencia SaaS, plantilla genérica, cards excesivas, dorados metálicos o rosa pastel.
- Contenido de boda centralizado en `src/content/` — no hardcodear en la UI.

## Ingeniería

- Next.js + TypeScript + App Router + Tailwind CSS.
- Server Components por defecto; Client Components solo cuando sean necesarios.
- Performance y accesibilidad son quality gates.
- No agregar dependencias innecesarias.
- No implementar funcionalidades fuera del alcance solicitado (p. ej. no adelantar RSVP/Supabase/admin sin pedirlo).
- Antes de proponer el trabajo como listo, ejecutar: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.

## Git

- No hacer **commit** sin autorización explícita del usuario.
- No hacer **push** sin autorización explícita del usuario.
- No crear PRs salvo que se soliciten.
