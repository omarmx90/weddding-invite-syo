/**
 * Genera tokens criptográficamente seguros y material privado de seed.
 *
 * Uso:
 *   npm run invites:generate
 *
 * Salida (gitignored):
 *   .private/invite-links.json
 *   .private/seed-token-hashes.sql
 *
 * Nunca escribe tokens reales dentro de archivos trackeados por git.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomBytes } from "node:crypto";

const SITE_URL = process.env.INVITE_SITE_URL ?? "https://silvia-y-omar.com";
const TOKEN_BYTES = 32;

const PILOT_FAMILIES = [
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

function generateToken() {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

function hashToken(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function escapeSql(value) {
  return value.replaceAll("'", "''");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const privateDir = join(root, ".private");
mkdirSync(privateDir, { recursive: true });

const generatedAt = new Date().toISOString();
const links = PILOT_FAMILIES.map((family) => {
  const token = generateToken();
  const accessTokenHash = hashToken(token);
  const url = `${SITE_URL}/i/${family.slug}?t=${token}`;
  return {
    ...family,
    token,
    accessTokenHash,
    url,
  };
});

const inviteLinksPath = join(privateDir, "invite-links.json");
writeFileSync(
  inviteLinksPath,
  `${JSON.stringify({ generatedAt, siteUrl: SITE_URL, invitations: links }, null, 2)}\n`,
  "utf8",
);

const sqlLines = [
  "-- Generado por npm run invites:generate — NO commitear",
  `-- ${generatedAt}`,
  "-- Aplicar DESPUÉS de supabase/schema.sql y supabase/seed.sql",
  "",
];

for (const item of links) {
  sqlLines.push(
    `update public.invitations`,
    `set access_token_hash = '${escapeSql(item.accessTokenHash)}'`,
    `where slug = '${escapeSql(item.slug)}';`,
    "",
  );
}

const sqlPath = join(privateDir, "seed-token-hashes.sql");
writeFileSync(sqlPath, `${sqlLines.join("\n")}\n`, "utf8");

process.stdout.write("\nInvitaciones privadas generadas (no se guardan en git):\n\n");
for (const item of links) {
  process.stdout.write(`${item.displayName}\n`);
  process.stdout.write(`${item.url}\n`);
  process.stdout.write(`lugares: ${item.maxSeats}\n\n`);
}
process.stdout.write(`Archivos:\n- ${inviteLinksPath}\n- ${sqlPath}\n`);
process.stdout.write(
  "\nSiguiente paso: ejecutar .private/seed-token-hashes.sql en Supabase.\n",
);
