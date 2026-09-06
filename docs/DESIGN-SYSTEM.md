# Sistema de diseño — Invitación Silvia & Omar

## Intención de diseño

Una invitación impresa premium traducida a una experiencia móvil moderna:

- elegante, romántica, cálida, sobria, premium, atemporal, editorial, natural
- ritmo vertical calmado y whitespace generoso
- la fotografía (cuando sea real) es la portada emocional; la UI permanece discreta

Evitar: degradados dorados, brillos metálicos, glassmorphism, cards SaaS, rejillas en cajas, rosa pastel, acentos chillones, bordes pesados, texto negro puro.

**Idioma de la UI y de la documentación de diseño:** español de México (`es-MX`).

## Tokens de color (dirección final)

Definidos en `src/app/globals.css` y expuestos a Tailwind vía `@theme`.

| Token | Variable CSS | Valor | Rol |
| --- | --- | --- | --- |
| Warm white | `--warm-white` / `bg-warm-white` | `#FCFAF7` | Canvas principal |
| Beige | `--beige` / `bg-beige` | `#EDE3D5` | Superficie alternada |
| Sand | `--sand` / `text-sand` | `#D6C2A6` | Filetes y acentos suaves |
| Soft taupe | `--taupe` / `text-taupe` | `#A99076` | Subrayados CTA / foco |
| Warm ink | `--ink` / `text-ink` | `#4B443D` | Texto primario (no negro puro) |
| Muted ink | `--ink-muted` | `#7A7268` | Texto de apoyo |
| Subtle ink | `--ink-subtle` | `#9C9388` | Etiquetas / eyebrows |
| Canvas | `--canvas` | `var(--warm-white)` | Alias de fondo |
| Surface | `--surface` | `var(--beige)` | Alternancia de sección |
| Accent | `--accent` | `var(--taupe)` | Acento interactivo |
| Hero foreground | `--hero-fg` | `var(--warm-white)` | Texto sobre la portada |

El overlay del hero usa tinta cálida a opacidades medias para legibilidad del texto marfil — nunca negro puro.

Los componentes deben usar tokens (`bg-canvas`, `text-ink`, `border-taupe`, …), no hex sueltos.

## Tipografía

Solo dos familias (vía `next/font`):

| Rol | Familia | Uso |
| --- | --- | --- |
| Display | **Cormorant Garamond** | Nombres de la pareja, títulos de sección, líneas de fecha |
| Sans | **Source Sans 3** | Cuerpo, etiquetas, botones, logística |

Reglas:

- Excelente legibilidad a **360 px**
- Nombres / títulos con tamaños fluidos `clamp()`
- Etiquetas: sans pequeña, tracking generoso, mayúsculas solo en frases cortas
- Sin fuentes caligráficas / script
- CSS: `--font-display`, `--font-sans`

## Fechas y locale

- Locale de producto: **`es-MX`**
- Zona horaria de referencia: **`America/Mexico_City`**
- Fecha editorial de portada: `16 · 10 · 2026`
- Fecha textual larga: `Viernes 16 de octubre de 2026` (vía `formatLongDateEsMx` en `src/lib/locale.ts`)
- Si se usa `Intl.DateTimeFormat`, especificar siempre `es-MX` — no depender del locale del dispositivo

## Espaciado y ritmo de secciones

| Token / patrón | Intención |
| --- | --- |
| `--section-y` | `clamp(4.5rem, 12vw, 7.5rem)` de padding vertical |
| `--content-max` | `28rem` de medida de lectura |
| `.section-pad` | Horizontal con safe-area + ritmo vertical |
| `.invite-rule` | Filete corto en sand entre momentos editoriales |

Flujo: **Hero → Intro → Ceremonia → Recepción** con alternancia `canvas` / `surface` y whitespace intencional — nunca comprimir para caber más en pantalla.

## Jerarquía visual

1. Nombres de la pareja  
2. Tagline / títulos de sección  
3. Fecha  
4. CTA primario  
5. Detalles logísticos  

Sin cards en la narrativa. Bordes solo para filetes discretos o subrayados de CTA.

## Motion

- Apertura: fade/rise corto en escalones
- CTA → invitación: crossfade / lift suave
- Secciones: revelado ligero `whileInView` (una vez)
- Honrar `prefers-reduced-motion` (solo opacidad o versión acortada)
- Sin parallax; sin animar cada elemento

## Comportamiento móvil

| Preocupación | Enfoque |
| --- | --- |
| Altura de viewport | Hero con `dvh` / `svh` |
| Safe areas | `env(safe-area-inset-*)` |
| Targets táctiles | ≥ 44×44 px |
| Landscape | Hero scrolleable; tipo reducido bajo `max-height: 500px` |
| Ancho mínimo | Diseñar desde **360 px** |

## Comportamiento de imagen

- El hero es full-bleed `object-cover`
- Placeholder en `public/images/placeholders/hero.svg` — cambiar archivo + ruta de contenido para fotografía real sin reestructurar
- `next/image` con `sizes="100vw"`; priority solo en el hero

## Accesibilidad

- `lang="es-MX"` en el documento
- Textos de `aria-*`, `alt` y labels en español
- `h1` / `h2` semánticos, `time`, `dl` para detalles de evento
- Tinta cálida sobre warm white / beige con contraste legible; texto del hero sobre velo cálido
- Anillos de foco visibles (`outline-taupe` / `outline-hero-fg`)
- Elementos reales `button` / `a` con nombres accesibles
- Sin overflow horizontal; reduced motion respetado
