/**
 * Contratos de contenido de la invitación.
 * Los componentes de UI consumen estos tipos; no inventan campos de boda ad hoc.
 */

export type WeddingMediaAsset = {
  /** Ruta pública, p. ej. `/images/placeholders/hero.svg` */
  src: string;
  alt: string;
  /** Hint opcional para next/image con assets raster */
  width?: number;
  height?: number;
};

export type EventLocation = {
  title: string;
  /** Línea de fecha larga bajo el título (opcional) */
  dateLabel?: string;
  timeLabel: string;
  time: string;
  venueLabel: string;
  venue: string;
  addressLabel: string;
  address: string;
  ctaLabel: string;
  /** Si está vacío, el CTA se muestra pero no navega (placeholder) */
  mapsUrl: string;
};

export type WeddingCopy = {
  tagline: string;
  heroCta: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
};

export type WeddingContent = {
  couple: {
    partnerOne: string;
    partnerTwo: string;
    /** Texto de portada, p. ej. "Silvia & Omar" */
    displayName: string;
  };
  date: {
    /** Fecha ISO (YYYY-MM-DD) */
    iso: string;
    /** Fecha editorial para invitados */
    display: string;
    timezone: string;
  };
  /** Locale BCP 47 del producto */
  locale: "es-MX";
  copy: WeddingCopy;
  meta: {
    title: string;
    description: string;
  };
  media: {
    hero: WeddingMediaAsset;
  };
  event: {
    ceremony: EventLocation;
    reception: EventLocation;
  };
  links: {
    /** Atajos futuros de WhatsApp / contacto */
    whatsapp?: string;
  };
};
