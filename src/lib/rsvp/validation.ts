export type RsvpValidationInput = {
  attending: boolean;
  maxSeats: number;
  adultCount?: number;
  childCount?: number;
  /** Legacy: total tratado como adultos si no hay desglose */
  confirmedSeats?: number;
};

export type RsvpValidationResult =
  | {
      ok: true;
      confirmedSeats: number;
      adultCount: number;
      childCount: number;
    }
  | { ok: false; message: string };

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Valida capacidad RSVP.
 * Invariante: adultCount + childCount <= maxSeats;
 * attending ⇒ total >= 1; declined ⇒ 0/0/0.
 */
export function validateRsvpInput(
  input: RsvpValidationInput,
): RsvpValidationResult {
  const { attending, maxSeats } = input;

  if (maxSeats < 1) {
    return {
      ok: false,
      message: "Esta invitación no tiene lugares disponibles.",
    };
  }

  if (!attending) {
    return { ok: true, confirmedSeats: 0, adultCount: 0, childCount: 0 };
  }

  const hasBreakdown =
    input.adultCount !== undefined || input.childCount !== undefined;

  let adultCount: number;
  let childCount: number;

  if (hasBreakdown) {
    if (
      !isNonNegativeInteger(input.adultCount) ||
      !isNonNegativeInteger(input.childCount)
    ) {
      return {
        ok: false,
        message: "Indica un número válido de adultos y niños.",
      };
    }
    adultCount = input.adultCount;
    childCount = input.childCount;
  } else {
    const seats = Number(input.confirmedSeats);
    if (!Number.isInteger(seats) || seats < 0) {
      return {
        ok: false,
        message: "Selecciona un número válido de lugares.",
      };
    }
    adultCount = seats;
    childCount = 0;
  }

  const confirmedSeats = adultCount + childCount;

  if (confirmedSeats < 1) {
    return {
      ok: false,
      message: "Indica al menos 1 persona si van a acompañarnos.",
    };
  }

  if (confirmedSeats > maxSeats) {
    return {
      ok: false,
      message: `Solo hay ${maxSeats} lugares reservados para ustedes.`,
    };
  }

  return { ok: true, confirmedSeats, adultCount, childCount };
}
