import { site } from "@/content/site";

export function getInviteSiteUrl(): string {
  const fromEnv = process.env.INVITE_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return site.url.replace(/\/$/, "");
}

export function buildInviteCapabilityUrl(slug: string, token: string): string {
  const base = getInviteSiteUrl();
  return `${base}/i/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`;
}

export function buildWhatsAppMessage(
  displayName: string,
  inviteUrl: string,
): string {
  return [
    "Hola 😊",
    "",
    `Con mucha alegría queremos compartirles nuestra invitación de boda, preparada con cariño para ${displayName}.`,
    "",
    "Este enlace es personal y solo para ustedes:",
    "",
    inviteUrl,
    "",
    "Nos dará mucho gusto celebrar juntos este día.",
    "",
    "Con cariño,",
    "Silvia & Omar",
  ].join("\n");
}

export function buildWhatsAppShareHref(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
