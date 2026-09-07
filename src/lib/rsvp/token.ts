import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** Longitud mínima del secreto en bytes (base64url ≈ 43 chars). */
export const INVITE_TOKEN_BYTES = 32;

/**
 * Token de alta entropía para capability URL `?t=`.
 * Nunca derivar de slug, apellido, fecha o contador.
 */
export function generateInviteToken(bytes = INVITE_TOKEN_BYTES): string {
  if (bytes < 32) {
    throw new Error("El token de invitación requiere al menos 32 bytes.");
  }
  return randomBytes(bytes).toString("base64url");
}

/**
 * Digest estable SHA-256 (hex) para almacenar en DB.
 * Los tokens ya son de alta entropía; no se usa pepper para no sobrearquitectar.
 *
 * Regla de logging: nunca registrar el token en claro ni URLs con `t=`.
 */
export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function safeEqualDigest(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function verifyInviteToken(
  token: string,
  expectedHash: string,
): boolean {
  if (!token || !expectedHash) {
    return false;
  }
  return safeEqualDigest(hashInviteToken(token), expectedHash);
}
