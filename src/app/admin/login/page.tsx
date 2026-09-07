import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  isAdminE2EAuthEnabled,
  isSupabaseAuthConfiguredForAdmin,
} from "@/lib/admin/e2e-auth-shared";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm
        authConfigured={isSupabaseAuthConfiguredForAdmin()}
        e2eHint={isAdminE2EAuthEnabled()}
      />
    </Suspense>
  );
}
