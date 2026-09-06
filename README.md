# Silvia & Omar — Invitación digital de boda

Invitación digital mobile-first para **Silvia & Omar** · **16 de octubre de 2026**.

Este repositorio es la base de una experiencia personalizada para invitados (más adelante `/i/[slug]`), no una plantilla genérica de boda.

**Idioma del producto:** español de México (`es-MX`).

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Documentación

| Documento | Contenido |
| --- | --- |
| [docs/PRODUCT-VISION.md](docs/PRODUCT-VISION.md) | Propósito, usuarios, principios y roadmap |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estructura de la app, datos, deploy y seguridad |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Tipografía, espacio, motion, móvil y a11y |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Setup, scripts y QA móvil |
| [AGENTS.md](AGENTS.md) | Instrucciones permanentes para agentes de IA |

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## Contenido

Edita textos y rutas de medios en `src/content/wedding.ts`.

Sustituye el marcador del hero en `public/images/placeholders/hero.svg` por fotografía y actualiza la ruta en el contenido.

## Alcance actual

Portada (hero), transición a la invitación, introducción, ceremonia y recepción. RSVP, Supabase, admin y rutas personalizadas quedan fuera de este alcance por ahora.
