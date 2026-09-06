import type { WeddingContent } from "./types";
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
    introEyebrow: "Nuestra boda",
    introTitle: "Con alegría queremos compartir este día con ustedes",
    introBody:
      "Será un honor tenerlos presentes en la ceremonia y en la celebración. A continuación encontrarán los detalles para acompañarnos.",
  },
  meta: {
    title: "Silvia & Omar | Nos casamos",
    description:
      "Una invitación especial para celebrar nuestra boda el 16 de octubre de 2026.",
  },
  media: {
    hero: {
      src: "/images/placeholders/hero.svg",
      alt: "Fondo provisional en tonos arena — reemplazar con fotografía de Silvia y Omar",
      width: 1080,
      height: 1920,
    },
  },
  event: {
    ceremony: {
      title: "Ceremonia religiosa",
      date: ceremonyDate,
      timeLabel: "Hora",
      time: "5:00 p. m.",
      venueLabel: "Iglesia",
      venue: "Por confirmar",
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
    /**
     * Solo entradas confirmadas.
     * Extender más adelante con preparación, traslado, cena, etc.
     */
    items: [
      {
        id: "ceremony",
        title: "Ceremonia religiosa",
        time: "5:00 p. m.",
        eventKey: "ceremony",
      },
    ],
  },
  familyTeam: {
    title: "Nuestro equipo",
    eyebrow: "Familia",
    line: "Los mejores partidos se juegan juntos.",
    members: [
      { name: "Silvia" },
      { name: "Omar" },
      { name: "Nuestro hijo" },
    ],
    photoPlaceholderLabel: "Pronto una foto de nuestro equipo",
    // photo: { src, alt, objectPosition } — cuando exista fotografía real
  },
  links: {},
};

export type { WeddingContent };
