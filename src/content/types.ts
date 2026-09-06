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
  /** CSS object-position para el crop (p. ej. "50% 28%") */
  objectPosition?: string;
};

/** Fecha editorial en bloques (invitación impresa). */
export type EditorialDate = {
  weekday: string;
  dayMonthYear: string;
};

export type EventLocation = {
  title: string;
  /** Fecha en jerarquía editorial; omitir si aún no aplica */
  date?: EditorialDate;
  timeLabel: string;
  time: string;
  venueLabel: string;
  venue: string;
  addressLabel: string;
  address: string;
  ctaLabel: string;
  /** Si está vacío, el CTA se muestra pero no navega (pendiente) */
  mapsUrl: string;
};

/**
 * Ítems futuros del itinerario del día.
 * Solo incluir entradas con información confirmada.
 */
export type ScheduleItemId =
  | "preparation"
  | "ceremony"
  | "transfer"
  | "reception"
  | "dinner"
  | "special"
  | (string & {});

export type ScheduleItem = {
  id: ScheduleItemId;
  title: string;
  /** Hora en español de México cuando esté confirmada */
  time?: string;
  description?: string;
  eventKey?: "ceremony" | "reception";
};

export type DaySchedule = {
  title: string;
  items: ScheduleItem[];
};

export type FamilyMember = {
  name: string;
  /** Etiqueta breve opcional */
  label?: string;
};

export type FamilyTeamContent = {
  title: string;
  eyebrow: string;
  /** Línea emocional principal */
  line: string;
  members: FamilyMember[];
  /**
   * Fotografía familiar futura.
   * Mientras no exista, la UI muestra un marco preparado.
   */
  photo?: WeddingMediaAsset;
  photoPlaceholderLabel: string;
};

export type WeddingCopy = {
  tagline: string;
  heroCta: string;
  heroEyebrow: string;
  locationLabel: string;
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
    hero: WeddingMediaAsset & {
      /** object-position para viewports estrechos */
      objectPositionMobile?: string;
      /** object-position para desktop */
      objectPositionDesktop?: string;
    };
  };
  event: {
    ceremony: EventLocation;
    reception: EventLocation;
  };
  /** Estructura lista para el itinerario completo (sin inventar eventos). */
  schedule: DaySchedule;
  familyTeam: FamilyTeamContent;
  links: {
    /** Atajos futuros de WhatsApp / contacto */
    whatsapp?: string;
  };
};
