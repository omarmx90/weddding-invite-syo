import type { WeddingContent } from "@/content/types";
import type { WeddingCalendarPayload } from "@/lib/calendar/wedding-event";

/**
 * Payload de calendario a partir del contenido confirmado de la boda.
 * No inventa Maps ni datos ausentes.
 */
export function getWeddingCalendarPayload(
  content: WeddingContent,
): WeddingCalendarPayload {
  const ceremony = content.event.ceremony;
  const reception = content.event.reception;

  const description = [
    `Ceremonia católica — ${ceremony.time}`,
    ceremony.venue,
    ceremony.address,
    "",
    `Celebración íntima — ${reception.time}`,
    reception.venue,
    reception.address,
  ].join("\n");

  return {
    title: `Boda de ${content.couple.partnerOne} & ${content.couple.partnerTwo}`,
    description,
    location: `${ceremony.venue}, ${ceremony.address}`,
    timezone: "America/Mexico_City",
    startDate: content.date.iso,
    startTime: "17:00",
    endDate: content.date.iso,
    endTime: "21:30",
    uid: `wedding-${content.couple.partnerOne.toLowerCase()}-${content.couple.partnerTwo.toLowerCase()}-${content.date.iso}@silvia-y-omar.com`,
  };
}
