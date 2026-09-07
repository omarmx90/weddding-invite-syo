import type { GalleryContent, WeddingContent } from "./types";
import {
  formatEditorialDateEsMx,
  PRODUCT_LOCALE,
  PRODUCT_TIMEZONE,
} from "@/lib/locale";

const ceremonyDate = formatEditorialDateEsMx("2026-10-16");

/**
 * Fuente de verdad de la narrativa y la logística de la boda.
 * Cambiar valores aquí en lugar de editar componentes de UI.
 */
export const wedding: WeddingContent = {
  couple: {
    partnerOne: "Silvia",
    partnerTwo: "Omar",
    displayName: "Silvia & Omar",
  },
  date: {
    iso: "2026-10-16",
    display: "16 · 10 · 2026",
    timezone: PRODUCT_TIMEZONE,
  },
  locale: PRODUCT_LOCALE,
  copy: {
    tagline: "Nos casamos",
    heroCta: "Ver invitación",
    heroEyebrow: "Nuestra boda",
    locationLabel: "Querétaro, México",
    introEyebrow: "Con cariño",
    introTitle: "Nos hace mucha ilusión celebrar este día con ustedes",
    introBody:
      "Cada persona que recibe esta invitación es especial para nosotros. Gracias por acompañar a nuestra familia — Silvia, Omar y Mauro — en un momento que queremos compartir de cerca.",
    familySignature: "Silvia, Omar y Mauro",
  },
  meta: {
    title: "Silvia & Omar | Nos casamos",
    description:
      "Una invitación especial para celebrar nuestra boda el 16 de octubre de 2026.",
  },
  media: {
    hero: {
      // Derivado web; portada.jpg original se conserva intacto.
      src: "/images/hero/portada-display.jpg",
      alt: "Silvia y Omar frente a una iglesia durante una sesión de pareja",
      width: 1600,
      height: 2400,
      objectPosition: "58% 52%",
      objectPositionMobile: "54% 42%",
      objectPositionDesktop: "62% 46%",
    },
  },
  event: {
    ceremony: {
      title: "Ceremonia católica",
      date: ceremonyDate,
      timeLabel: "Hora",
      time: "5:00 p. m.",
      venueLabel: "Parroquia",
      venue: "Parroquia de Nuestra Señora de la Luz",
      addressLabel: "Dirección",
      address: "Por confirmar",
      ctaLabel: "Cómo llegar",
      mapsUrl: "https://share.google/cyuLdnExWdwHQkBQg",
    },
    reception: {
      title: "Recepción",
      timeLabel: "Hora",
      time: "Por confirmar",
      venueLabel: "Lugar",
      venue: "Por confirmar",
      addressLabel: "Dirección",
      address: "Por confirmar",
      ctaLabel: "Ver ubicación",
      mapsUrl: "",
    },
  },
  schedule: {
    title: "Itinerario del día",
    items: [
      {
        id: "ceremony",
        title: "Ceremonia católica",
        time: "5:00 p. m.",
        eventKey: "ceremony",
      },
    ],
  },
  familyTeam: {
    title: "Nuestro equipo",
    eyebrow: "Familia",
    line: "Los mejores partidos se juegan juntos.",
    lineSecondary:
      "En la cancha no nos ponemos de acuerdo; en la vida, siempre del mismo lado.",
    rivalryTitle: "Tres corazones. Tres equipos. Una sola familia.",
    members: [
      { name: "Silvia", team: "Cruz Azul" },
      { name: "Omar", team: "Chivas" },
      { name: "Mauro", team: "América" },
    ],
    photoPlaceholderLabel: "Pronto una foto de nuestro equipo",
    photo: {
      // Derivado web del original (nuestro-equipo.jpg se conserva intacto).
      src: "/images/family/nuestro-equipo-display.jpg",
      alt: "Silvia, Omar y Mauro juntos en una terraza durante una sesión familiar",
      width: 2400,
      height: 1600,
      objectPosition: "50% 42%",
    },
  },
  /**
   * Galería deshabilitada hasta agregar fotografías reales en
   * `public/images/gallery/` y marcar `featured: true` en los ítems.
   * Ver `public/images/gallery/README.md`.
   */
  gallery: {
    enabled: false,
    title: "Nuestros momentos",
    eyebrow: "Álbum",
    hint: "Desliza para ver más",
    items: [],
  },
  links: {},
};

/** Ítems destacados del riel (máx. ~20 en la primera versión). */
export function getFeaturedGalleryItems(gallery: GalleryContent) {
  return gallery.items.filter((item) => item.featured);
}

/** La sección se muestra solo con contenido real habilitado. */
export function isGallerySectionVisible(gallery: GalleryContent) {
  return gallery.enabled && getFeaturedGalleryItems(gallery).length > 0;
}

export type { WeddingContent };
