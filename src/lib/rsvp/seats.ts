/**
 * Normaliza el desglose adultos/niños a partir de un RSVP persistido.
 * RSVPs legacy (sin columnas o null) se leen como todos adultos.
 */
export function resolveSeatBreakdown(input: {
  attending: boolean;
  confirmedSeats: number;
  adultCount?: number | null;
  childCount?: number | null;
}): { adultCount: number; childCount: number; confirmedSeats: number } {
  if (!input.attending) {
    return { adultCount: 0, childCount: 0, confirmedSeats: 0 };
  }

  const hasAdult = input.adultCount != null;
  const hasChild = input.childCount != null;

  if (hasAdult && hasChild) {
    const adultCount = input.adultCount as number;
    const childCount = input.childCount as number;
    return {
      adultCount,
      childCount,
      confirmedSeats: adultCount + childCount,
    };
  }

  return {
    adultCount: input.confirmedSeats,
    childCount: 0,
    confirmedSeats: input.confirmedSeats,
  };
}

export function formatPartyBreakdown(
  adultCount: number,
  childCount: number,
): string {
  const parts: string[] = [];
  if (adultCount > 0) {
    parts.push(`${adultCount} ${adultCount === 1 ? "adulto" : "adultos"}`);
  }
  if (childCount > 0) {
    parts.push(`${childCount} ${childCount === 1 ? "niño" : "niños"}`);
  }
  return parts.join(" · ");
}
