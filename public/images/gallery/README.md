# Galería — Nuestros momentos

## Archivos en producción (repo)

Derivados web curados (lado largo ≈ 1600 px):

`momento-01.jpg` … `momento-16.jpg`

Se declaran en `src/content/wedding.ts` → `gallery.items`.

## Originales (local)

Las fotografías de alta resolución viven en:

`public/images/gallery/originals/`

Esa carpeta está en `.gitignore` (archivos de 10–22 MB). No se modifican destructivamente.

## Mapping curado (original → momento)

| Original | Nuevo | Rol narrativo |
| --- | --- | --- |
| Previas -80.jpg | momento-01.jpg | Apertura — pareja |
| Previas -35.jpg | momento-02.jpg | Pareja frente a la entrada |
| Previas -74.jpg | momento-03.jpg | Retrato vertical pareja |
| Previas -40.jpg | momento-04.jpg | Mirada íntima |
| Previas -58.jpg | momento-05.jpg | Detalle — manos / anillo |
| Previas -43.jpg | momento-06.jpg | Momento espontáneo |
| Previas -4.jpg | momento-07.jpg | Familia — terraza / acueducto |
| Previas -24.jpg | momento-08.jpg | Familia — jardín |
| Previas -32.jpg | momento-09.jpg | Familia — patio |
| Previas -107.jpg | momento-10.jpg | Guiño futbolero — juntos |
| Previas -91.jpg | momento-11.jpg | Familia caminando (playeras) |
| Previas -95.jpg | momento-12.jpg | Rivalidad — retrato vertical |
| Previas -116.jpg | momento-13.jpg | Mauro |
| Previas -114.jpg | momento-14.jpg | Silvia |
| Previas -119.jpg | momento-15.jpg | Omar |
| Previas -29.jpg | momento-16.jpg | Cierre — caminando juntos |

## Descartadas del riel (permanecen en `originals/`)

| Archivo | Motivo |
| --- | --- |
| nuestro-equipo.jpg | Ya se usa en “Nuestro equipo” |
| Previas -15.jpg | Muy similar a momento-07 (terraza) |
| Previas -68.jpg | Redundante con 01/02 (pareja en arco) |
| Previas -85.jpg | Variante futbolera sentada; 10–12 cubren el tema |
| Previas -89.jpg | Casi idéntica a momento-11 |
| Previas -97.jpg | Casi idéntica a momento-12 |
| Previas -99.jpg | Variante de 12 |
| Previas -103.jpg | Variante de grupo con playeras |

## Activar / ampliar

1. Agregar o regenerar `momento-XX.jpg` (derivado web).
2. Declarar el ítem en `wedding.gallery.items` con `featured: true`.
3. Mantener `gallery.enabled: true`.

Futuro: “Ver más” puede cargar ítems no featured bajo demanda. Lightbox ampliado queda para una iteración posterior (sin librería pesada).
