# Galería — Nuestros momentos

Coloca aquí las fotografías familiares/de pareja (derivados web, no originales crudos de 10+ MB).

## Convención de archivos

```
public/images/gallery/
  01-nombre-corto.jpg
  02-nombre-corto.jpg
  …
```

Recomendado por foto destacada:

- Lado largo ≈ 1600–2000 px
- JPEG quality ~80–88 o WebP
- Dimensiones conocidas en el content

## Content config

En `src/content/wedding.ts` → `gallery`:

```ts
gallery: {
  enabled: true, // solo cuando haya assets reales
  title: "Nuestros momentos",
  eyebrow: "Álbum",
  hint: "Desliza para ver más",
  items: [
    {
      id: "01",
      src: "/images/gallery/01-ejemplo.jpg",
      alt: "Descripción en español de México",
      width: 1600,
      height: 2000,
      objectPosition: "50% 40%",
      featured: true, // aparece en el riel inicial
    },
  ],
}
```

## Estrategia para ~100 fotos

| Capa | Qué carga | Cuándo |
| --- | --- | --- |
| Featured (12–20) | Riel horizontal actual | Al entrar a la sección (lazy salvo la 1ª) |
| Archivo completo | Futuro “Ver más” / página álbum | Bajo demanda |
| Originales | Fuera del repo o no servidos | Nunca en el cliente |

Reglas:

1. `enabled: false` mientras no haya fotos → la sección no se renderiza.
2. Solo `featured: true` entra al riel (máx. ~20).
3. Hero sigue siendo el único `priority`; la galería no.
4. Next/Image entrega AVIF/WebP automáticamente.
5. Un “Ver más” futuro puede paginar o abrir un álbum sin cargar las 100 de golpe.

## Placeholders

No uses bloques vacíos en producción. Si faltan assets, deja `enabled: false` e `items: []`.
