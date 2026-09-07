/**
 * Catálogo piloto público (sin secretos).
 * Los access tokens reales viven solo en `.private/` (gitignored) o en memoria de test.
 */

export type PilotFamily = {
  slug: string;
  displayName: string;
  maxSeats: number;
  enabled: boolean;
};

export const PILOT_FAMILIES: readonly PilotFamily[] = [
  {
    slug: "granados-montero",
    displayName: "Familia Granados Montero",
    maxSeats: 2,
    enabled: true,
  },
  {
    slug: "montero-aguilar",
    displayName: "Familia Montero Aguilar",
    maxSeats: 3,
    enabled: true,
  },
  {
    slug: "nava-munoz",
    displayName: "Familia Nava Muñoz",
    maxSeats: 3,
    enabled: true,
  },
] as const;

/** @deprecated usar PILOT_FAMILIES */
export const PILOT_INVITATIONS = PILOT_FAMILIES;
