import { Suspense } from "react";
import { headers } from "next/headers";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { resolveAdminAuthEmailRedirectTo } from "@/lib/admin/auth-redirect";
import {
  isAdminE2EAuthEnabled,
  isSupabaseAuthConfiguredForAdmin,
} from "@/lib/admin/e2e-auth-shared";

export default async function AdminLoginPage() {
  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto");
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const requestOrigin =
    proto && host ? `${proto}://${host}` : host ? `https://${host}` : null;

  const emailRedirectTo = resolveAdminAuthEmailRedirectTo({
    requestOrigin,
  });

  return (
    <Suspense fallback={null}>
      <AdminLoginForm
        authConfigured={isSupabaseAuthConfiguredForAdmin()}
        e2eHint={isAdminE2EAuthEnabled()}
        emailRedirectTo={emailRedirectTo}
      />
    </Suspense>
  );
}
