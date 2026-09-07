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
    celebrationTransition:
      "Después de este paso tan importante, queremos seguir celebrando con quienes forman parte de nuestra historia.",
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
      timeDateTime: "17:00",
      venueLabel: "Parroquia",
      venue: "Parroquia de Nuestra Señora de la Luz",
      addressLabel: "Dirección",
      address:
        "Av. de la Luz S/N, Santa Ana, 76116 Santiago de Querétaro, Qro.",
      ctaLabel: "Cómo llegar",
      mapsUrl: "https://share.google/cyuLdnExWdwHQkBQg",
    },
    reception: {
      title: "Celebración íntima",
      timeLabel: "Horario",
      time: "6:30 p. m. – 9:30 p. m.",
      timeDateTime: "18:30/21:30",
      venueLabel: "Lugar",
      venue: "Hacienda Los Laureles Restaurante Y Banquetes",
      addressLabel: "Dirección",
      address:
        "Carretera México–San Luis Potosí, Km. 8.5, Jurica, 76100 Santiago de Querétaro, Qro.",
      body: "Después de la ceremonia queremos compartir una comida especial con ustedes.",
      ctaLabel: "Cómo llegar",
      // Sin URL confirmada: no inventar Maps; la UI no muestra CTA.
      mapsUrl: "",
    },
  },
  schedule: {
    title: "Itinerario del día",
    eyebrow: "El recorrido",
    items: [
      {
        id: "ceremony",
        title: "Ceremonia católica",
        time: "5:00 p. m.",
        timeDateTime: "17:00",
        location: "Parroquia de Nuestra Señora de la Luz",
        eventKey: "ceremony",
      },
      {
        id: "reception",
        title: "Celebración íntima",
        time: "6:30 p. m.",
        timeDateTime: "18:30",
        location: "Hacienda Los Laureles",
        eventKey: "reception",
      },
      {
        id: "closing",
        title: "Cierre de la celebración",
        time: "9:30 p. m.",
        timeDateTime: "21:30",
      },
    ],
  },
  countdown: {
    targetIsoDate: "2026-10-16",
    targetTime: "17:00",
    timezone: PRODUCT_TIMEZONE,
    preface: "Faltan",
    suffix: "para nuestro gran día",
    arrivedMessage: "Nuestro gran día llegó",
    labels: {
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
    },
  },
  faith: {
    title: "Con la bendición de Dios",
    /**
     * Texto tradicional en español para 1 Cor 13, 7–8.
     * Se cita el libro/capítulo; no se atribuye una edición comercial.
     */
    verse: {
      text: "Todo lo disculpa, todo lo cree, todo lo espera, todo lo soporta. El amor no pasa nunca.",
      citation: "1 Corintios 13, 7–8",
    },
    patrons: ["Nuestra Señora de Guadalupe", "San Judas Tadeo"],
    patronsPrayer:
      "Que su intercesión acompañe nuestro matrimonio, nuestro hogar y nuestra familia.",
  },
  /**
   * Preparado para futuros nombres reales.
   * enabled: false — no inventar placeholders.
   */
  familiesBlessing: {
    enabled: false,
    title: "Con la bendición de nuestras familias",
    brideParents: {
      label: "Padres de Silvia",
      names: [],
    },
    groomParents: {
      label: "Padres de Omar",
      names: [],
    },
  },
  dress: {
    eyebrow: "Para celebrar juntos",
    title: "Un toque especial",
    body: "Nos encantará verlos con un estilo elegante y cómodo, ideal para disfrutar esta tarde juntos.",
    suggestionLabel: "Sugerencia de vestimenta",
    suggestion: "Elegante y cómodo",
  },
  /**
   * Confirmación de asistencia — fase futura.
   * enabled: false evita CTAs falsos. Deadline real: 10 de octubre de 2026.
   */
  rsvp: {
    enabled: true,
    deadlineIso: "2026-10-10",
    timezone: PRODUCT_TIMEZONE,
    ctaLabel: "Confirmar asistencia",
    note: "Confirmación en ligas privadas /i/[slug] con hash del secreto en Supabase.",
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
      src: "/images/gallery/football/football-01-family-huddle.jpg",
      alt: "Silvia, Mauro y Omar sonriendo juntos con playeras de Cruz Azul, América y Chivas",
      width: 1800,
      height: 1200,
      objectPosition: "50% 32%",
    },
    footballGallery: {
      title: "Fútbol en familia",
      items: [
        {
          id: "fb-01",
          src: "/images/gallery/football/football-01-family-huddle.jpg",
          alt: "Silvia, Mauro y Omar sonriendo juntos con playeras de Cruz Azul, América y Chivas",
          width: 1800,
          height: 1200,
          objectPosition: "50% 32%",
          orientation: "landscape",
          span: "hero",
        },
        {
          id: "fb-02",
          src: "/images/gallery/football/football-02-family-arms.jpg",
          alt: "Silvia, Mauro y Omar de brazos cruzados con playeras de Cruz Azul, América y Chivas",
          width: 1600,
          height: 1067,
          objectPosition: "50% 35%",
          orientation: "landscape",
          span: "wide",
        },
        {
          id: "fb-03",
          src: "/images/gallery/football/football-03-family-laugh.jpg",
          alt: "Mauro serio al frente mientras Silvia y Omar ríen con playeras rivales",
          width: 1111,
          height: 1600,
          objectPosition: "50% 32%",
          orientation: "portrait",
          span: "tall",
        },
        {
          id: "fb-04",
          src: "/images/gallery/football/football-04-family-pose-v.jpg",
          alt: "Silvia, Mauro y Omar de pie con brazos cruzados y playeras de sus equipos",
          width: 1067,
          height: 1600,
          objectPosition: "50% 28%",
          orientation: "portrait",
          span: "tall",
        },
        {
          id: "fb-05",
          src: "/images/gallery/football/football-05-family-walk.jpg",
          alt: "Silvia, Mauro y Omar caminan de la mano con playeras de fútbol por una calle colonial",
          width: 1600,
          height: 1067,
          objectPosition: "50% 35%",
          orientation: "landscape",
          span: "default",
        },
        {
          id: "fb-06",
          src: "/images/gallery/football/football-06-family-steps.jpg",
          alt: "Silvia, Mauro y Omar sentados en escalones de piedra con playeras de sus equipos",
          width: 1600,
          height: 1067,
          objectPosition: "50% 40%",
          orientation: "landscape",
          span: "default",
        },
        {
          id: "fb-07",
          src: "/images/gallery/football/football-07-family-shades.jpg",
          alt: "Silvia, Mauro y Omar en los escalones; Mauro lleva gafas de sol y playera del América",
          width: 1600,
          height: 1067,
          objectPosition: "50% 40%",
          orientation: "landscape",
          span: "default",
        },
        {
          id: "fb-08",
          src: "/images/gallery/football/football-08-family-kneel.jpg",
          alt: "Silvia, Mauro y Omar arrodillados en un callejón de tonos rojos con playeras rivales",
          width: 1600,
          height: 1123,
          objectPosition: "50% 38%",
          orientation: "landscape",
          span: "wide",
        },
        {
          id: "fb-09",
          src: "/images/gallery/football/football-09-family-alley.jpg",
          alt: "Silvia, Mauro y Omar de brazos cruzados en un callejón colonial con playeras de fútbol",
          width: 1600,
          height: 1067,
          objectPosition: "50% 35%",
          orientation: "landscape",
          span: "default",
        },
        {
          id: "fb-10",
          src: "/images/gallery/football/football-10-family-hands.jpg",
          alt: "Silvia, Mauro y Omar tomados de la mano frente a un edificio colonial con playeras",
          width: 1600,
          height: 1066,
          objectPosition: "50% 38%",
          orientation: "landscape",
          span: "default",
        },
        {
          id: "fb-11",
          src: "/images/gallery/football/football-11-family-stand-v.jpg",
          alt: "Retrato vertical de Silvia, Mauro y Omar de pie con playeras de Cruz Azul, América y Chivas",
          width: 1067,
          height: 1600,
          objectPosition: "50% 30%",
          orientation: "portrait",
          span: "tall",
        },
        {
          id: "fb-12",
          src: "/images/gallery/football/football-12-silvia.jpg",
          alt: "Silvia sonriendo de brazos cruzados con la playera azul de Cruz Azul",
          width: 949,
          height: 1500,
          objectPosition: "50% 28%",
          orientation: "portrait",
          span: "tall",
        },
        {
          id: "fb-13",
          src: "/images/gallery/football/football-13-mauro.jpg",
          alt: "Mauro arrodillado en una calle empedrada con la playera del América",
          width: 1000,
          height: 1500,
          objectPosition: "50% 30%",
          orientation: "portrait",
          span: "tall",
        },
        {
          id: "fb-14",
          src: "/images/gallery/football/football-14-family-play.jpg",
          alt: "Silvia y Omar arrodillados junto a Mauro en un momento juguetón con playeras rivales",
          width: 1600,
          height: 1067,
          objectPosition: "50% 38%",
          orientation: "landscape",
          span: "wide",
        },
      ],
    },
  },
  /**
   * Galería editorial — derivados web `momento-XX.jpg`.
   * Originales de alta resolución en `public/images/gallery/originals/` (local).
   * Mapping documentado en `public/images/gallery/README.md`.
   *
   * Reel curado (orden narrativo):
   * pareja cámara → OTS Silvia → OTS Omar → detalle manos →
   * familia terraza → jardín → santuario → playeras caminando →
   * rivalidad → abrazo.
   * Features (-78, -25, -36) y hero no se duplican aquí.
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
        alt: "Silvia y Omar sonriendo tomados de la mano frente a un arco colonial",
        width: 1600,
        height: 1067,
        objectPosition: "50% 38%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Nosotros",
      },
      {
        id: "momento-02",
        src: "/images/gallery/momento-02.jpg",
        alt: "Silvia ríe mirando a Omar en un instante espontáneo",
        width: 1600,
        height: 1067,
        objectPosition: "42% 40%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-03",
        src: "/images/gallery/momento-03.jpg",
        alt: "Omar sonríe a Silvia en la plaza frente a una estatua",
        width: 1600,
        height: 1045,
        objectPosition: "58% 40%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-04",
        src: "/images/gallery/momento-04.jpg",
        alt: "Manos de Silvia y Omar entrelazadas con anillo y pulsera de perlas",
        width: 1500,
        height: 1000,
        objectPosition: "50% 50%",
        orientation: "landscape",
        frame: "square",
        featured: true,
        caption: "Un sí compartido",
      },
      {
        id: "momento-05",
        src: "/images/gallery/momento-05.jpg",
        alt: "Silvia y Omar miran a Mauro sentado en la terraza con el acueducto de fondo",
        width: 1600,
        height: 1067,
        objectPosition: "48% 38%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Nuestra familia",
      },
      {
        id: "momento-06",
        src: "/images/gallery/momento-06.jpg",
        alt: "Silvia, Mauro y Omar sonriendo juntos en el jardín",
        width: 1600,
        height: 1067,
        objectPosition: "50% 42%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-07",
        src: "/images/gallery/momento-07.jpg",
        alt: "Silvia, Omar y Mauro caminan de la mano hacia un santuario",
        width: 1600,
        height: 1067,
        objectPosition: "50% 45%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-08",
        src: "/images/gallery/momento-08.jpg",
        alt: "Silvia, Mauro y Omar caminan de la mano con playeras de fútbol por una calle colonial",
        width: 1600,
        height: 1067,
        objectPosition: "50% 35%",
        orientation: "landscape",
        frame: "landscape",
        featured: true,
      },
      {
        id: "momento-09",
        src: "/images/gallery/momento-09.jpg",
        alt: "Mauro serio al frente mientras Silvia y Omar ríen con playeras rivales",
        width: 1111,
        height: 1600,
        objectPosition: "50% 32%",
        orientation: "portrait",
        frame: "portrait",
        featured: true,
        caption: "Tres equipos",
      },
      {
        id: "momento-10",
        src: "/images/gallery/momento-10.jpg",
        alt: "Silvia, Mauro y Omar abrazados con playeras de Cruz Azul, América y Chivas",
        width: 1600,
        height: 1067,
        objectPosition: "50% 32%",
        orientation: "landscape",
        frame: "featured",
        featured: true,
        caption: "Siempre juntos",
      },
    ],
  },
  editorial: {
    chapters: {
      day: { number: "01", label: "Nuestro gran día" },
      family: { number: "02", label: "Nuestra familia" },
      moments: { number: "03", label: "Recuerdos" },
      celebrate: { number: "04", label: "Para celebrar juntos" },
    },
    cinematic: [
      {
        id: "cine-couple",
        src: "/images/gallery/features/feature-church-kiss.jpg",
        alt: "Silvia y Omar se besan frente a una capilla colonial",
        // Sin título: la fotografía no compite con tipografía.
        layout: "portrait",
        veil: "none",
        objectPosition: "50% 35%",
        objectPositionMobile: "50% 35%",
        objectPositionDesktop: "50% 38%",
        width: 1333,
        height: 2000,
      },
      {
        id: "cine-family",
        src: "/images/gallery/features/feature-family-walkaway.jpg",
        alt: "Silvia, Omar y Mauro caminan de la mano hacia un santuario",
        title: "Silvia, Omar y Mauro",
        layout: "landscape",
        veil: "soft",
        objectPosition: "50% 45%",
        objectPositionMobile: "50% 45%",
        objectPositionDesktop: "50% 48%",
        width: 2000,
        height: 1333,
      },
      {
        id: "cine-closing",
        src: "/images/gallery/features/feature-couple-laugh.jpg",
        alt: "Silvia y Omar ríen tomados de la mano frente a un arco colonial",
        // Sin copy: RSVP ya incluye "Nos vemos el 16 de octubre".
        layout: "landscape",
        veil: "none",
        objectPosition: "50% 42%",
        objectPositionMobile: "50% 42%",
        objectPositionDesktop: "50% 40%",
        width: 2000,
        height: 1333,
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
