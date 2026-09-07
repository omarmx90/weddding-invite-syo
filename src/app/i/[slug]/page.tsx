import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationAccessDenied } from "@/components/invitation/InvitationAccessDenied";
import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { getEnabledGuestInvitations } from "@/content/guests";
import { wedding } from "@/content/wedding";
import { isRsvpDeadlinePassed } from "@/lib/rsvp/deadline";
import {
  resolveInvitationAccess,
  toGuestInvitation,
} from "@/lib/rsvp/invitations";
import { isRsvpPersistenceReady } from "@/lib/rsvp/repository";

type PersonalizedInvitationPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getEnabledGuestInvitations().map((guest) => ({
    slug: guest.slug,
  }));
}

const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

/**
 * Metadata de privacidad — sin nombres de familia, sin canonical a /i/[slug].
 */
export async function generateMetadata({
  params,
}: PersonalizedInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { invitation } = await resolveInvitationAccess(slug, undefined);

  if (!invitation) {
    return {
      title: "Invitación no encontrada",
      robots: privateRobots,
    };
  }

  return {
    title: "Invitación",
    description: wedding.meta.description,
    robots: privateRobots,
    openGraph: {
      title: wedding.meta.title,
      description: wedding.meta.description,
      url: "/",
    },
  };
}

export default async function PersonalizedInvitationPage({
  params,
  searchParams,
}: PersonalizedInvitationPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const rawToken = query.t;
  const accessToken = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const { invitation, tokenValid, rsvp } = await resolveInvitationAccess(
    slug,
    accessToken,
  );

  if (!invitation) {
    notFound();
  }

  // Sin token válido: no revelar familia, lugares ni RSVP.
  if (!tokenValid) {
    return <InvitationAccessDenied />;
  }

  const guest = toGuestInvitation(invitation);

  return (
    <InvitationExperience
      content={wedding}
      guest={guest}
      rsvpContext={{
        accessToken,
        existingRsvp: rsvp
          ? {
              attending: rsvp.attending,
              confirmedSeats: rsvp.confirmedSeats,
            }
          : null,
        persistenceReady: isRsvpPersistenceReady(),
        deadlinePassed: isRsvpDeadlinePassed(),
      }}
    />
  );
}
