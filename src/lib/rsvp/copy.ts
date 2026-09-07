import { formatLongDateEsMx } from "@/lib/locale";
import { wedding } from "@/content/wedding";

export const rsvpCopy = {
  eyebrow: "Confirmación",
  title: "Confirma tu asistencia",
  question: "¿Nos acompañan?",
  yes: "Sí, ahí estaremos",
  no: "No podremos acompañarlos",
  seatsQuestion: "¿Cuántos nos acompañarán?",
  submit: "Enviar confirmación",
  update: "Actualizar confirmación",
  confirmedTitle: "Asistencia confirmada",
  declinedTitle: "Confirmación registrada",
  seatsSummary: (confirmed: number, max: number) =>
    `${confirmed} de ${max} ${max === 1 ? "lugar" : "lugares"}`,
  successYes:
    "Gracias por confirmar. Nos dará mucha alegría compartir este día con ustedes.",
  successNo:
    "Gracias por avisarnos. Los tendremos presentes en este día tan especial.",
  deadlineLabel: "Confirma antes del",
  deadlinePassedTitle: "El periodo de confirmación ha terminado",
  deadlinePassedBody:
    "Si necesitas hacer algún cambio, comunícate con nosotros.",
  missingTokenTitle: "No pudimos validar esta invitación",
  missingTokenBody:
    "Abre el enlace completo que recibiste. Si el problema continúa, escríbenos.",
  unavailableTitle: "Confirmación no disponible",
  unavailableBody:
    "Estamos preparando la confirmación en línea. Vuelve a intentar más tarde.",
  persistError:
    "No pudimos guardar tu confirmación en este momento. Intenta nuevamente en unos minutos.",
  loading: "Guardando tu confirmación…",
  validationAttend: "Elige una opción para continuar.",
  optionalMessageLabel: "Mensaje (opcional)",
  optionalMessagePlaceholder: "Una nota breve, si lo deseas",
} as const;

export function formatRsvpDeadlineCopy(
  deadlineIso = wedding.rsvp.deadlineIso,
): string {
  return `${rsvpCopy.deadlineLabel} ${formatLongDateEsMx(deadlineIso)}`;
}
