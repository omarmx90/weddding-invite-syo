export type RsvpValidationInput = {
  attending: boolean;
  confirmedSeats: number;
  maxSeats: number;
};

export type RsvpValidationResult =
  | { ok: true; confirmedSeats: number }
  | { ok: false; message: string };

export function validateRsvpInput(
  input: RsvpValidationInput,
): RsvpValidationResult {
  const { attending, maxSeats } = input;
  const seats = Number(input.confirmedSeats);

  if (!Number.isInteger(seats)) {
    return {
      ok: false,
      message: "Selecciona un número válido de lugares.",
    };
  }

  if (maxSeats < 1) {
    return {
      ok: false,
      message: "Esta invitación no tiene lugares disponibles.",
    };
  }

  if (attending) {
    if (seats < 1) {
      return {
        ok: false,
        message: "Indica al menos 1 persona si van a acompañarnos.",
      };
    }
    if (seats > maxSeats) {
      return {
        ok: false,
        message: `Solo hay ${maxSeats} lugares reservados para ustedes.`,
      };
    }
    return { ok: true, confirmedSeats: seats };
  }

  return { ok: true, confirmedSeats: 0 };
}
