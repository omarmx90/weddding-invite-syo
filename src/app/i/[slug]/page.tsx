import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import {
  getEnabledGuestInvitations,
  getGuestBySlug,
} from "@/content/guests";
import { wedding } from "@/content/wedding";

type PersonalizedInvitationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getEnabledGuestInvitations().map((guest) => ({
    slug: guest.slug,
  }));
}

/**
 * Metadata de privacidad:
 * - robots: noindex, nofollow (los slugs no deben indexarse)
 * - sin Open Graph personalizado (no exponer nombres de familias)
 * - sin canonical a /i/[slug] (evita legitimar URLs privadas en buscadores)
 *   La home `/` conserva su canonical público.
 */
export async function generateMetadata({
  params,
}: PersonalizedInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);

  if (!guest) {
    return {
      title: "Invitación no encontrada",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    title: "Invitación",
    description: wedding.meta.description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    openGraph: {
      title: wedding.meta.title,
      description: wedding.meta.description,
      // URL genérica del sitio — no la ruta personalizada
      url: "/",
    },
  };
}

export default async function PersonalizedInvitationPage({
  params,
}: PersonalizedInvitationPageProps) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  return <InvitationExperience content={wedding} guest={guest} />;
}
