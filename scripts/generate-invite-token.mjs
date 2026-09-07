/**
 * Genera un único token de invitación (stdout).
 * Uso: npm run invites:token
 */
import { randomBytes } from "node:crypto";

const bytes = 32;
const token = randomBytes(bytes).toString("base64url");
process.stdout.write(`${token}\n`);
