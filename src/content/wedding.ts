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
   * Galería editorial — derivados web `momento-XX.jpg`.
   * Originales de alta resolución en `public/images/gallery/originals/` (local).
   * Mapping documentado en `public/images/gallery/README.md`.
   */
  gallery: {
    enabled: true,
    title: "Nuestros momentos",
    eyebrow: "Álbum",
    hint: "Desliza para ver más",
    items: [
      {
        id: "momento-01",
        src: "/images/gallery/momento-01.jpg",
        alt: "Silvia y Omar sonriendo juntos frente a una fachada de tonos cálidos",
        width: 1600,
        height: 1067,
        objectPosition: "50% 38%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Empezamos aquí",
      },
      {
        id: "momento-02",
        src: "/images/gallery/momento-02.jpg",
        alt: "Silvia y Omar tomados de la mano frente a una entrada colonial",
        width: 1600,
        height: 1161,
        objectPosition: "50% 42%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-03",
        src: "/images/gallery/momento-03.jpg",
        alt: "Silvia y Omar posando juntos bajo un árbol en un patio soleado",
        width: 1067,
        height: 1600,
        objectPosition: "50% 28%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
      },
      {
        id: "momento-04",
        src: "/images/gallery/momento-04.jpg",
        alt: "Silvia sonríe a Omar en un momento íntimo en el patio",
        width: 1600,
        height: 1115,
        objectPosition: "42% 40%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-05",
        src: "/images/gallery/momento-05.jpg",
        alt: "Manos de Silvia y Omar entrelazadas, con el anillo a la vista",
        width: 1400,
        height: 933,
        objectPosition: "50% 45%",
        orientation: "landscape",
        frame: "square",
        featured: true,
        caption: "Un sí compartido",
      },
      {
        id: "momento-06",
        src: "/images/gallery/momento-06.jpg",
        alt: "Omar sonríe a Silvia en un instante espontáneo",
        width: 1600,
        height: 1021,
        objectPosition: "62% 40%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-07",
        src: "/images/gallery/momento-07.jpg",
        alt: "Silvia, Omar y Mauro sonriendo en una terraza con el acueducto de fondo",
        width: 1600,
        height: 1067,
        objectPosition: "50% 32%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Nuestra familia",
      },
      {
        id: "momento-08",
        src: "/images/gallery/momento-08.jpg",
        alt: "Silvia, Mauro y Omar sentados juntos en el jardín",
        width: 1600,
        height: 1067,
        objectPosition: "50% 55%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-09",
        src: "/images/gallery/momento-09.jpg",
        alt: "Retrato familiar de Silvia, Mauro y Omar en un patio de piedra",
        width: 1600,
        height: 1067,
        objectPosition: "50% 35%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-10",
        src: "/images/gallery/momento-10.jpg",
        alt: "Silvia, Mauro y Omar juntos con las playeras de Cruz Azul, América y Chivas",
        width: 1600,
        height: 1067,
        objectPosition: "50% 32%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Tres equipos, una familia",
      },
      {
        id: "momento-11",
        src: "/images/gallery/momento-11.jpg",
        alt: "Silvia, Mauro y Omar caminando de la mano por una calle colonial",
        width: 1600,
        height: 1067,
        objectPosition: "50% 30%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-12",
        src: "/images/gallery/momento-12.jpg",
        alt: "Silvia, Mauro y Omar de brazos cruzados con sus playeras favoritas",
        width: 1055,
        height: 1600,
        objectPosition: "50% 28%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
      },
      {
        id: "momento-13",
        src: "/images/gallery/momento-13.jpg",
        alt: "Mauro sonriendo con su playera del América en una calle empedrada",
        width: 1067,
        height: 1600,
        objectPosition: "50% 30%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
      },
      {
        id: "momento-14",
        src: "/images/gallery/momento-14.jpg",
        alt: "Silvia posando con su playera del Cruz Azul en una calle soleada",
        width: 1106,
        height: 1600,
        objectPosition: "50% 26%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
      },
      {
        id: "momento-15",
        src: "/images/gallery/momento-15.jpg",
        alt: "Omar caminando sonriente con su playera de las Chivas",
        width: 1060,
        height: 1600,
        objectPosition: "50% 24%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
      },
      {
        id: "momento-16",
        src: "/images/gallery/momento-16.jpg",
        alt: "Silvia, Omar y Mauro caminando de la mano hacia el horizonte",
        width: 1600,
        height: 1067,
        objectPosition: "50% 40%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Siempre juntos",
      },
    ],
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
