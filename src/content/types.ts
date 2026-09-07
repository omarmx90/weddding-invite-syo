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
  /** Valor datetime para <time>, p. ej. "17:00" o "18:30/21:30" */
  timeDateTime?: string;
  venueLabel: string;
  venue: string;
  addressLabel: string;
  address: string;
  /** Párrafo breve bajo el título (opcional) */
  body?: string;
  ctaLabel: string;
  /**
   * URL de Maps. Vacío = no inventar link;
   * la UI no renderiza CTA de ubicación.
   */
  mapsUrl: string;
};

/**
 * Ítems del itinerario del día.
 * Solo incluir entradas con información confirmada.
 */
export type ScheduleItemId =
  | "preparation"
  | "ceremony"
  | "transfer"
  | "reception"
  | "dinner"
  | "closing"
  | "special"
  | (string & {});

export type ScheduleItem = {
  id: ScheduleItemId;
  title: string;
  /** Hora en español de México cuando esté confirmada */
  time?: string;
  /** Valor datetime para <time> */
  timeDateTime?: string;
  /** Ubicación breve (parroquia, hacienda, etc.) */
  location?: string;
  description?: string;
  eventKey?: "ceremony" | "reception";
};

export type DaySchedule = {
  title: string;
  eyebrow?: string;
  items: ScheduleItem[];
};

export type FamilyMember = {
  name: string;
  /** Etiqueta breve opcional (p. ej. rol familiar) */
  label?: string;
  /** Equipo favorito — guiño familiar, no branding deportivo */
  team?: string;
};

export type FamilyTeamContent = {
  title: string;
  eyebrow: string;
  /** Línea emocional principal */
  line: string;
  /** Segunda línea corta (guiño futbolero, opcional) */
  lineSecondary?: string;
  /** Título del guiño de equipos */
  rivalryTitle?: string;
  members: FamilyMember[];
  /**
   * Fotografía familiar futura.
   * Mientras no exista, la UI muestra un marco preparado.
   */
  photo?: WeddingMediaAsset;
  photoPlaceholderLabel: string;
};

export type GalleryOrientation = "portrait" | "landscape";

export type GalleryFrame = "featured" | "portrait" | "landscape" | "square";

export type GalleryItem = WeddingMediaAsset & {
  id: string;
  /** Solo las marcadas aparecen en el riel inicial */
  featured: boolean;
  orientation: GalleryOrientation;
  /** Ritmo editorial del slide en el riel */
  frame?: GalleryFrame;
  /** Pie opcional, breve */
  caption?: string;
};

export type GalleryContent = {
  /**
   * Si es false, la sección no se renderiza (aunque haya ítems de prueba).
   * Activar cuando existan fotografías reales en `public/images/gallery/`.
   */
  enabled: boolean;
  title: string;
  eyebrow: string;
  /** Pista breve de swipe (solo si aporta) */
  hint?: string;
  items: GalleryItem[];
};

export type CountdownContent = {
  /** Fecha calendario del evento (YYYY-MM-DD) */
  targetIsoDate: string;
  /** Hora local 24h HH:mm en la zona del producto */
  targetTime: string;
  timezone: string;
  preface: string;
  suffix: string;
  arrivedMessage: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
  };
};

export type FaithContent = {
  title: string;
  body: string;
  patrons: string[];
};

export type DressGuidanceContent = {
  eyebrow: string;
  title: string;
  body: string;
  suggestionLabel: string;
  suggestion: string;
};

/**
 * RSVP — modelo preparado; UI activa solo cuando enabled === true
 * y exista implementación real (sin CTAs falsos).
 */
export type RsvpContent = {
  enabled: boolean;
  /** Fecha límite YYYY-MM-DD */
  deadlineIso: string;
  timezone: string;
  /** Etiqueta futura, p. ej. "Confirmar asistencia" */
  ctaLabel: string;
  note: string;
};

export type WeddingCopy = {
  tagline: string;
  heroCta: string;
  heroEyebrow: string;
  locationLabel: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  /** Firma familiar bajo el mensaje de bienvenida */
  familySignature: string;
  /** Puente editorial entre ceremonia y celebración */
  celebrationTransition: string;
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
  countdown: CountdownContent;
  faith: FaithContent;
  dress: DressGuidanceContent;
  /** Confirmación futura — no renderizar CTA mientras enabled sea false */
  rsvp: RsvpContent;
  familyTeam: FamilyTeamContent;
  /**
   * Galería editorial ("Nuestros momentos").
   * Escalable a ~100 fotos; el riel solo consume `featured`.
   */
  gallery: GalleryContent;
  links: {
    /** Atajos futuros de WhatsApp / contacto */
    whatsapp?: string;
  };
};
