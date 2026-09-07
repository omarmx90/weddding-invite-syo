import { NextResponse } from "next/server";
import {
  clearMemoryDeadlineOverride,
  setMemoryDeadlinePassed,
} from "@/lib/rsvp/deadline";
import {
  getMemoryPlaintextToken,
  resetMemoryRsvpStore,
  setMemoryFailNextWrite,
} from "@/lib/rsvp/memory-store";
import { resolveRsvpStoreMode } from "@/lib/rsvp/repository";

type ResetBody = {
  deadlinePassed?: boolean;
  failNextWrite?: boolean;
};

/**
 * Solo Playwright / QA con RSVP_STORE=memory.
 * Nunca disponible con Supabase.
 */
export async function POST(request: Request) {
  if (resolveRsvpStoreMode() !== "memory") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  let body: ResetBody = {};
  try {
    body = (await request.json()) as ResetBody;
  } catch {
    body = {};
  }

  resetMemoryRsvpStore();
  clearMemoryDeadlineOverride();

  if (typeof body.deadlinePassed === "boolean") {
    setMemoryDeadlinePassed(body.deadlinePassed);
  }

  if (body.failNextWrite) {
    setMemoryFailNextWrite(true);
  }

  return NextResponse.json({ ok: true });
}

/**
 * Entrega el token efímero de memoria para un slug (solo e2e).
 * No loguear el token.
 */
export async function GET(request: Request) {
  if (resolveRsvpStoreMode() !== "memory") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = getMemoryPlaintextToken(slug);
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true, token });
}
