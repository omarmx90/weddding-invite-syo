import { createClient } from "@supabase/supabase-js";
import {
  hasAdminAllowlistConfigured,
  isEmailAllowlisted,
  normalizeAdminEmail,
} from "@/lib/admin/allowlist";
import {
  assertProductionAdminRedirectSafe,
  resolveAdminAuthEmailRedirectTo,
} from "@/lib/admin/auth-redirect";

/** Respuesta visible al cliente — no confirma allowlist. */
export const ADMIN_LOGIN_NEUTRAL_MESSAGE =
  "Si tu cuenta está autorizada, recibirás un enlace de acceso. Ábrelo desde este dispositivo.";

export type AdminMagicLinkOutcome =
  | "neutral_ack"
  | "otp_sent"
  | "not_configured"
  | "invalid_email"
  | "otp_failed";

export type AdminMagicLinkResult = {
  ok: boolean;
  outcome: AdminMagicLinkOutcome;
  /** Solo para tests / logs server; el cliente usa mensaje neutral. */
  shouldCreateUser?: boolean;
  message: string;
};

export type SendAdminOtpFn = (input: {
  email: string;
  emailRedirectTo: string;
  shouldCreateUser: boolean;
}) => Promise<{ error: { message: string; code?: string; status?: number } | null }>;

export function isSignupNotAllowedOtpError(error: {
  message: string;
  code?: string;
  status?: number;
}): boolean {
  const hay = `${error.code ?? ""} ${error.message}`.toLowerCase();
  return (
    hay.includes("signups not allowed") ||
    hay.includes("signup_disabled") ||
    hay.includes("user not found") ||
    error.code === "otp_disabled"
  );
}

/**
 * Envía OTP admin con anon key. Sin persistir sesión en el proceso.
 */
export const defaultSendAdminOtp: SendAdminOtpFn = async ({
  email,
  emailRedirectTo,
  shouldCreateUser,
}) => {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    return { error: { message: "Supabase Auth no configurado." } };
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser,
    },
  });

  return { error: error ? { message: error.message, code: error.code, status: error.status } : null };
};

function looksLikeEmail(email: string): boolean {
  // Validación mínima — no confirma existencia.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Invite-only: allowlist server-side ANTES de OTP.
 * No allowlisted → ack neutral (sin llamar a Supabase).
 * Allowlisted → shouldCreateUser: false; fallback create solo si signup bloqueado.
 */
export async function requestAdminMagicLink(input: {
  email: string;
  emailRedirectTo?: string | null;
  requestOrigin?: string | null;
  sendOtp?: SendAdminOtpFn;
}): Promise<AdminMagicLinkResult> {
  const email = normalizeAdminEmail(input.email);
  if (!email || !looksLikeEmail(email)) {
    return {
      ok: false,
      outcome: "invalid_email",
      message: "Revisa el correo e intenta otra vez.",
    };
  }

  if (!hasAdminAllowlistConfigured()) {
    return {
      ok: false,
      outcome: "not_configured",
      message: "La autenticación admin aún no está configurada en este entorno.",
    };
  }

  const emailRedirectTo =
    input.emailRedirectTo?.trim() ||
    resolveAdminAuthEmailRedirectTo({
      requestOrigin: input.requestOrigin,
    });

  try {
    assertProductionAdminRedirectSafe(emailRedirectTo);
  } catch {
    return {
      ok: false,
      outcome: "otp_failed",
      message: "Configuración de acceso incompleta. Revisa el dominio de autenticación.",
    };
  }

  if (!emailRedirectTo.includes("/admin/auth/callback")) {
    return {
      ok: false,
      outcome: "otp_failed",
      message: "Configuración de acceso incompleta. Revisa el dominio de autenticación.",
    };
  }

  // Pre-auth allowlist: no OTP, no creación de usuario, respuesta neutral.
  if (!isEmailAllowlisted(email)) {
    return {
      ok: true,
      outcome: "neutral_ack",
      message: ADMIN_LOGIN_NEUTRAL_MESSAGE,
    };
  }

  const sendOtp = input.sendOtp ?? defaultSendAdminOtp;

  let shouldCreateUser = false;
  let { error } = await sendOtp({
    email,
    emailRedirectTo,
    shouldCreateUser: false,
  });

  // Migración operacional: admin allowlisted sin identity aún → un create controlado.
  if (error && isSignupNotAllowedOtpError(error)) {
    shouldCreateUser = true;
    ({ error } = await sendOtp({
      email,
      emailRedirectTo,
      shouldCreateUser: true,
    }));
  }

  if (error) {
    return {
      ok: false,
      outcome: "otp_failed",
      shouldCreateUser,
      message: "No pudimos enviar el enlace en este momento. Intenta más tarde.",
    };
  }

  return {
    ok: true,
    outcome: "otp_sent",
    shouldCreateUser,
    message: ADMIN_LOGIN_NEUTRAL_MESSAGE,
  };
}
