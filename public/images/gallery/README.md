# Galería — Nuestros momentos

## Archivos en producción (repo)

### Features (cinematic)

Derivados web (~2000 px lado largo) en `features/`:

| Archivo | Original | Uso |
| --- | --- | --- |
| `feature-church-kiss.jpg` | Previas -78.jpg | Cinematic #1 — pareja + fe |
| `feature-family-walkaway.jpg` | Previas -25.jpg | Cinematic #2 — familia al santuario |
| `feature-couple-laugh.jpg` | Previas -36.jpg | Cinematic #3 — cierre emocional |
| `feature-hands-detail.jpg` | Previas -57.jpg | Nuestro día — debajo de Guardar la fecha |
| `feature-ceremony-couple.jpg` | Previas -81.jpg | Ceremonia — debajo de Cómo llegar |
| `feature-celebration-family.jpg` | Previas -21.jpg | Puente hacia celebración íntima |
| `feature-reception-family.jpg` | Previas -9.jpg | Celebración íntima |
| `feature-schedule-terrace.jpg` | Previas -16.jpg | Itinerario del día |
| `feature-faith-silvia-gaze.jpg` | Previas -42.jpg | Fe — díptico (Silvia) |
| `feature-faith-omar-gaze.jpg` | Previas -46.jpg | Fe — díptico (Omar) |
| `feature-presence-gift.jpg` | Previas -33.jpg | Su presencia es nuestro regalo |

### Reel

Derivados web (lado largo ≈ 1500–1600 px):

`momento-01.jpg` … `momento-10.jpg`

Se declaran en `src/content/wedding.ts` → `gallery.items`.

## Originales (local)

Las fotografías de alta resolución viven en:

`public/images/gallery/originals/`

Esa carpeta está en `.gitignore` (archivos de 10–24 MB). No se modifican destructivamente.

## Mapping curado (original → momento)

| Original | Nuevo | Rol narrativo |
| --- | --- | --- |
| Previas -71.jpg | momento-01.jpg | Apertura — pareja a cámara (elegida sobre -35: mirada al invitado, menos solapada con hero/-36) |
| Previas -41.jpg | momento-02.jpg | Silvia espontánea (OTS) |
| Previas -47.jpg | momento-03.jpg | Omar espontáneo (OTS) |
| Previas -51.jpg | momento-04.jpg | Detalle — manos / anillo |
| Previas -14.jpg | momento-05.jpg | Familia — terraza / conexión con Mauro |
| Previas -24.jpg | momento-06.jpg | Familia — jardín |
| Previas -27.jpg | momento-07.jpg | Familia caminando al santuario (variante del feature -25) |
| Previas -93.jpg | momento-08.jpg | Familia playeras — caminando |
| Previas -94.jpg | momento-09.jpg | Rivalidad / humor |
| Previas -107.jpg | momento-10.jpg | Cierre — abrazo futbolero |

## Fuera del reel (protagonismo propio)

| Archivo | Motivo |
| --- | --- |
| portada / Previas -79 | Hero |
| Previas -78 | Feature #1 |
| Previas -25 | Feature #2 |
| Previas -36 | Feature #3 |
| Previas -33 | Su presencia es nuestro regalo |
| nuestro-equipo.jpg | Sección Nuestro equipo |

## Activar / ampliar

1. Regenerar derivados desde `originals/` (script local en `.private/` si aplica).
2. Declarar el ítem en `wedding.gallery.items` con `featured: true`.
3. Mantener `gallery.enabled: true`.
