import { redirect } from "next/navigation";
import { AdminCreateInvitationForm } from "@/components/admin/AdminCreateInvitationForm";
import { getAuthorizedAdminSession } from "@/lib/admin/session";

export default async function AdminNewGuestPage() {
  const session = await getAuthorizedAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div data-testid="admin-new-guest">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
        Nueva
      </p>
      <h1 className="font-display mt-3 text-[clamp(1.8rem,5vw,2.4rem)] leading-snug">
        Nueva invitación
      </h1>
      <p className="mt-4 max-w-lg font-sans text-[1rem] leading-relaxed text-ink-muted text-pretty">
        Generaremos un enlace privado con token seguro. El secreto no se guarda
        en claro en la base de datos.
      </p>
      <div className="mt-10">
        <AdminCreateInvitationForm />
      </div>
    </div>
  );
}
