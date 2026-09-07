import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthorizedAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Administración",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-canvas text-ink" data-testid="admin-shell">
      <header className="border-b border-taupe/30 bg-warm-white/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8 sm:py-4">
          <div className="min-w-0">
            <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              Privado
            </p>
            <p className="font-display text-[1.2rem] tracking-[-0.01em] sm:text-[1.35rem]">
              Silvia & Omar
            </p>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}

async function AdminNav() {
  const session = await getAuthorizedAdminSession();
  if (!session) {
    return null;
  }

  return (
    <nav className="flex shrink-0 items-center gap-x-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-muted sm:gap-x-4 sm:text-[0.75rem] sm:tracking-[0.18em]">
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
      >
        Resumen
      </Link>
      <Link
        href="/admin/guests"
        className="inline-flex min-h-11 items-center hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
        data-testid="admin-nav-guests"
      >
        Invitaciones
      </Link>
      <form
        action={async () => {
          "use server";
          const { createSupabaseAuthServerClient } = await import(
            "@/lib/admin/session"
          );
          const { isAdminE2EAuthEnabled, ADMIN_E2E_COOKIE } = await import(
            "@/lib/admin/e2e-auth"
          );
          const { cookies } = await import("next/headers");
          if (isAdminE2EAuthEnabled()) {
            const jar = await cookies();
            jar.set(ADMIN_E2E_COOKIE, "", { path: "/", maxAge: 0 });
          } else {
            try {
              const supabase = await createSupabaseAuthServerClient();
              await supabase.auth.signOut();
            } catch {
              // ignore
            }
          }
          redirect("/admin/login");
        }}
      >
        <button
          type="submit"
          className="inline-flex min-h-11 items-center hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
          data-testid="admin-logout"
        >
          Salir
        </button>
      </form>
    </nav>
  );
}
