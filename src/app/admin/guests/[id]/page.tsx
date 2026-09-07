import { notFound, redirect } from "next/navigation";
import { AdminGuestDetail } from "@/components/admin/AdminGuestDetail";
import { getAuthorizedAdminSession } from "@/lib/admin/session";
import { getAdminGuestStore, isAdminPersistenceReady } from "@/lib/admin/repository";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGuestDetailPage({ params }: PageProps) {
  const session = await getAuthorizedAdminSession();
  if (!session) redirect("/admin/login");
  if (!isAdminPersistenceReady()) {
    return <p data-testid="admin-unavailable">Admin no disponible.</p>;
  }

  const { id } = await params;
  const guest = await getAdminGuestStore().getGuest(id);
  if (!guest) notFound();

  return <AdminGuestDetail guest={guest} />;
}
