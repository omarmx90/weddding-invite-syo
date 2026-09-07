import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;

/**
 * Cifrado de capability tokens para invitation_secrets.
 * Clave: INVITE_TOKEN_ENCRYPTION_KEY — 32 bytes en hex (64 chars) o base64.
 * Solo servidor. Nunca NEXT_PUBLIC_.
 */
export function getInviteTokenEncryptionKey(): Buffer {
  const raw = process.env.INVITE_TOKEN_ENCRYPTION_KEY?.trim();
  if (!raw) {
    throw new Error("INVITE_TOKEN_ENCRYPTION_KEY no configurada.");
  }

  if (/^[a-f0-9]{64}$/i.test(raw)) {
    return Buffer.from(raw, "hex");
  }

  const fromB64 = Buffer.from(raw, "base64");
  if (fromB64.length === 32) {
    return fromB64;
  }

  throw new Error(
    "INVITE_TOKEN_ENCRYPTION_KEY debe ser 32 bytes (hex 64 o base64).",
  );
}

export function hasInviteTokenEncryptionKey(): boolean {
  try {
    getInviteTokenEncryptionKey();
    return true;
  } catch {
    return false;
  }
}

/** Formato: base64(iv).base64(ciphertext).base64(tag) */
export function encryptInviteToken(plaintext: string): string {
  const key = getInviteTokenEncryptionKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64url"),
    encrypted.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

export function decryptInviteToken(ciphertext: string): string {
  const key = getInviteTokenEncryptionKey();
  const parts = ciphertext.split(".");
  if (parts.length !== 3) {
    throw new Error("Ciphertext de invitación inválido.");
  }
  const [ivB64, dataB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, "base64url");
  const data = Buffer.from(dataB64, "base64url");
  const tag = Buffer.from(tagB64, "base64url");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8",
  );
}
