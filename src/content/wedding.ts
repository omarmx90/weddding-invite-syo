import type { WeddingContent } from "./types";
import { formatLongDateEsMx, PRODUCT_LOCALE, PRODUCT_TIMEZONE } from "@/lib/locale";

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
    title: "Silvia & Omar — 16 de octubre de 2026",
    description:
      "Invitación digital a la boda de Silvia y Omar. Viernes 16 de octubre de 2026.",
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
      dateLabel: formatLongDateEsMx("2026-10-16"),
      timeLabel: "Hora",
      time: "Por confirmar",
      venueLabel: "Iglesia",
      venue: "Por confirmar",
      addressLabel: "Dirección",
      address: "Por confirmar",
      ctaLabel: "Ver ubicación",
      mapsUrl: "",
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
  links: {},
};

export type { WeddingContent };
