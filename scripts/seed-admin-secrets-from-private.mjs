/**
 * Genera SQL para poblar invitation_secrets desde .private/invite-links.json.
 * No imprime tokens. Requiere INVITE_TOKEN_ENCRYPTION_KEY.
 *
 * Uso:
 *   node scripts/seed-admin-secrets-from-private.mjs > .private/seed-invitation-secrets.sql
 */
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function getKey() {
  const raw = process.env.INVITE_TOKEN_ENCRYPTION_KEY?.trim();
  if (!raw) {
    console.error("Falta INVITE_TOKEN_ENCRYPTION_KEY");
    process.exit(1);
  }
  if (/^[a-f0-9]{64}$/i.test(raw)) return Buffer.from(raw, "hex");
  const b64 = Buffer.from(raw, "base64");
  if (b64.length === 32) return b64;
  console.error("INVITE_TOKEN_ENCRYPTION_KEY inválida");
  process.exit(1);
}

function encrypt(plaintext, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
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

function hashToken(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

const file = path.join(process.cwd(), ".private", "invite-links.json");
if (!existsSync(file)) {
  console.error("No existe .private/invite-links.json");
  process.exit(1);
}

const key = getKey();
const data = JSON.parse(readFileSync(file, "utf8"));
const invitations = data.invitations ?? [];

console.log("-- invitation_secrets backfill (NO contiene plaintext)");
console.log(
  "-- Revisar y ejecutar en SQL Editor. No commitear el SQL generado.",
);
console.log("");

for (const item of invitations) {
  const slug = item.slug;
  const token = item.token;
  if (!slug || !token) continue;
  const ciphertext = encrypt(token, key);
  const digest = hashToken(token);
  console.log(
    `update public.invitations set access_token_hash = '${digest}' where slug = '${slug}';`,
  );
  console.log(
    `insert into public.invitation_secrets (invitation_id, token_ciphertext)
select id, '${ciphertext}'
from public.invitations
where slug = '${slug}'
on conflict (invitation_id) do update
set token_ciphertext = excluded.token_ciphertext,
    updated_at = now();`,
  );
  console.log("");
}

console.error(`OK: ${invitations.length} familias preparadas (tokens no impresos).`);
