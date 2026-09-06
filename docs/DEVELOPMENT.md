# Desarrollo — Invitación Silvia & Omar

## Prerrequisitos

- **Node.js** 20+ (LTS recomendado; Node 24 es válido)
- **npm** 10+ (viene con Node)
- Git
- Navegadores de Playwright (se instalan una vez tras `npm install` — ver Testing)

## Setup local

```bash
git clone https://github.com/omarmx90/weddding-invite-syo.git
cd weddding-invite-syo
npm install
npx playwright install chromium
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Opcional (validación futura en iOS Safari):

```bash
npx playwright install webkit
```

No se requiere `.env` para los slices actuales de la invitación.

## Scripts

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Next.js (Turbopack) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build localmente |
| `npm run test:e2e` | Playwright (Chromium) |
| `npm run test:e2e:ui` | Playwright en modo UI |

Validación completa antes de compartir un build:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## Edición de contenido

Textos y datos de la boda viven en:

- `src/content/wedding.ts` — valores
- `src/content/types.ts` — forma
- `src/lib/locale.ts` — locale `es-MX` y formateo de fechas largas

Sustituye la fotografía del hero dejando el archivo en `public/images/placeholders/` y actualizando `media.hero` en `wedding.ts`.

Horas, sedes, direcciones y URLs de mapa de ceremonia/recepción se editan solo en `wedding.ts`.

## Locale es-MX

- Idioma oficial del producto: **español de México**
- `html lang="es-MX"`
- Fechas textuales largas: `Viernes 16 de octubre de 2026` (no inglés)
- `Intl.DateTimeFormat` debe usar `es-MX` y `America/Mexico_City` de forma explícita
- No depender del locale del dispositivo para copy crítico de la invitación

## Linting y tipos

- ESLint: `eslint-config-next`
- TypeScript: `strict` en `tsconfig.json`
- Preferir corregir la causa raíz antes de desactivar reglas

## Testing (Playwright)

Las specs viven en `e2e/`.

Chromium es el proyecto requerido. WebKit está configurado pero **no** es obligatorio en CI todavía — actívalo al validar iOS Safari en local.

```bash
# headless
npm run test:e2e

# depuración interactiva
npm run test:e2e:ui
```

Cobertura actual:

1. La página de inicio carga
2. Los nombres de la pareja son visibles
3. La fecha de la boda es visible
4. El CTA revela la experiencia de invitación
5. La sección de ceremonia es visible
6. La sección de recepción es visible
7. No hay overflow horizontal a 360 px
8. Capturas móviles en `e2e/output/` para inspección visual

`playwright.config.ts` arranca `npm run build && npm run start` (o reutiliza un servidor en ejecución fuera de CI).

Capturas y artefactos bajo `e2e/output/` y `test-results/` están en `.gitignore`.

## Build de producción

```bash
npm run build
npm run start
```

Despliega conectando el repo de GitHub a Vercel (Framework Preset: Next.js).

## Flujo de pruebas móviles

### Modo dispositivo del navegador (rápido)

| Tamaño | Referencia |
| --- | --- |
| 360 × 800 | Android pequeño |
| 375 × 812 | iPhone clase X |
| 390 × 844 | iPhone 12/13 |
| 393 × 852 | iPhone 14/15 |
| 430 × 932 | iPhone Pro Max |
| 768 × 1024 | Tablet |
| 1440 × 900 | Desktop |

Verifica: padding de safe-area, tamaño de CTA, sin scroll horizontal, ritmo calmado de secciones, jerarquía tipográfica.

### Dispositivos reales (obligatorio antes del lanzamiento a invitados)

1. `npm run dev -- --hostname 0.0.0.0`
2. Abre `http://<tu-ip-lan>:3000` en iOS Safari y Android Chrome
3. Confirma Dynamic Island / notch, chrome inferior y redes lentas

### Reduced motion

Ajuste del SO “Reducir movimiento” → la apertura y los revelados deben seguir siendo comprensibles sin motion.

## Convenciones del proyecto

- Server Components por defecto; Client solo para interacción/motion
- Sin hechos de boda hardcodeados en JSX
- Solo tokens de diseño — sin hex dispersos en componentes
- Dependencias mínimas
- Copy orientado a invitados en **español de México**
- Identificadores técnicos (componentes, types, hooks) en inglés

## Vercel Toolbar en producción

La app **no** incluye `@vercel/toolbar`. Si el toolbar aparece en
https://silvia-y-omar.com, es una configuración del dashboard de Vercel (o de la
extensión del navegador), no del código.

Para ocultarlo en producción:

1. Abre el [dashboard de Vercel](https://vercel.com/dashboard) y selecciona el proyecto.
2. Ve a **Settings → General**.
3. Busca **Vercel Toolbar**.
4. En el entorno **Production**, elige **Off**.
5. Opcional a nivel de team: **Team Settings → General → Vercel Toolbar → Production → Off**.
6. Redeploy si el cambio no se refleja de inmediato.
7. Verifica en una ventana de incógnito (sin estar logueado en Vercel / sin extensión).

Mantén Preview en **On** o **Default** si quieres el toolbar solo en previews.
