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
  /** Título tipográfico sobre la imagen (copy ya existente) */
  title: string;
  objectPosition?: string;
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
