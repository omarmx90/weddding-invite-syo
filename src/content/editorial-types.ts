/**
 * Capítulos y momentos cinematográficos — polish editorial.
 * No inventa frases nuevas; reutiliza nombres y copy existente.
 */

export type EditorialChapter = {
  number: string;
  label: string;
};

export type CinematicMomentContent = {
  id: string;
  src: string;
  alt: string;
  /**
   * Título tipográfico opcional sobre la imagen.
   * Omitir o vacío = fotografía protagonista sin copy.
   */
  title?: string;
  /** Crop base (también fallback mobile) */
  objectPosition?: string;
  objectPositionMobile?: string;
  objectPositionDesktop?: string;
  /** Ritmo visual: vertical full-bleed vs horizontal panorámico */
  layout?: "portrait" | "landscape";
  /** Veil más ligero cuando la foto debe hablar sola */
  veil?: "soft" | "none";
  width: number;
  height: number;
};

export type EditorialSystem = {
  chapters: {
    day: EditorialChapter;
    family: EditorialChapter;
    moments: EditorialChapter;
    celebrate: EditorialChapter;
  };
  cinematic: CinematicMomentContent[];
};
