"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GuestInvitation } from "@/content/guest-types";
import type { WeddingContent } from "@/content/types";
import { isGallerySectionVisible } from "@/content/wedding";
import { formatLongDateEsMx } from "@/lib/locale";
import { HeroOpening } from "@/components/invitation/HeroOpening";
import { CountdownSection } from "@/components/invitation/CountdownSection";
import { PersonalizedWelcome } from "@/components/invitation/PersonalizedWelcome";
import { IntroSection } from "@/components/invitation/IntroSection";
import { EventSection } from "@/components/invitation/EventSection";
import { NarrativeBridge } from "@/components/invitation/NarrativeBridge";
import { DayScheduleSection } from "@/components/invitation/DayScheduleSection";
import { FaithSection } from "@/components/invitation/FaithSection";
import { OurTeamSection } from "@/components/invitation/OurTeamSection";
import { MomentsGallerySection } from "@/components/invitation/MomentsGallerySection";
import { DressGuidanceSection } from "@/components/invitation/DressGuidanceSection";
import { PresenceGiftSection } from "@/components/invitation/PresenceGiftSection";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { CinematicMoment } from "@/components/invitation/CinematicMoment";
import { EditorialClosing } from "@/components/invitation/EditorialClosing";
import { FamiliesBlessingSection } from "@/components/invitation/FamiliesBlessingSection";

type RsvpContext = {
  accessToken?: string;
  existingRsvp?: {
    attending: boolean;
    confirmedSeats: number;
    adultCount?: number | null;
    childCount?: number | null;
  } | null;
  persistenceReady: boolean;
  deadlinePassed: boolean;
};

type InvitationExperienceProps = {
  content: WeddingContent;
  guest?: GuestInvitation;
  rsvpContext?: RsvpContext;
};

type Phase = "opening" | "invitation";

export function InvitationExperience({
  content,
  guest,
  rsvpContext,
}: InvitationExperienceProps) {
  const [phase, setPhase] = useState<Phase>("opening");
  const reduceMotion = useReducedMotion();
  const showGallery = isGallerySectionVisible(content.gallery);
  const isPersonalized = Boolean(guest);
  const cineCouple = content.editorial.cinematic.find(
    (m) => m.id === "cine-couple",
  );
  const cineFamily = content.editorial.cinematic.find(
    (m) => m.id === "cine-family",
  );
  const cineClosing = content.editorial.cinematic.find(
    (m) => m.id === "cine-closing",
  );

  const countdownAccessibleSummary = `Cuenta regresiva para la ceremonia del ${formatLongDateEsMx(content.countdown.targetIsoDate)} a las ${content.event.ceremony.time}, hora de la Ciudad de México.`;

  const enterInvitation = useCallback(() => {
    setPhase("invitation");
  }, []);

  return (
    <div
      className="relative min-h-dvh bg-canvas"
      data-testid="invitation-root"
      data-invitation-mode={isPersonalized ? "personalized" : "general"}
    >
      <AnimatePresence mode="wait">
        {phase === "opening" ? (
          <motion.div
            key="opening"
            className="min-h-dvh"
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    y: -8,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          >
            <HeroOpening content={content} onEnter={enterInvitation} />
          </motion.div>
        ) : (
          <motion.main
            key="invitation"
            id="invitation"
            data-testid="invitation-content"
            className="overflow-x-clip"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0.2 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CountdownSection
              content={content.countdown}
              accessibleSummary={countdownAccessibleSummary}
              chapter={content.editorial.chapters.day}
              tone="canvas"
              wedding={content}
            />
            {guest ? (
              <PersonalizedWelcome
                guest={guest}
                tone="surface"
                photo={content.media.personalizedWelcome}
              />
            ) : null}
            <IntroSection content={content} />
            {cineFamily ? <CinematicMoment moment={cineFamily} /> : null}
            <EventSection
              sectionId="ceremony"
              event={content.event.ceremony}
              tone={guest ? "canvas" : "surface"}
              detail={content.media.ceremonyDetail}
            />
            <NarrativeBridge
              text={content.copy.celebrationTransition}
              tone={guest ? "surface" : "canvas"}
              media={content.media.celebrationBridge}
            />
            <EventSection
              sectionId="reception"
              event={content.event.reception}
              tone={guest ? "canvas" : "surface"}
              detail={content.media.receptionDetail}
              hospitality={content.receptionHospitality}
            />
            <DayScheduleSection
              schedule={content.schedule}
              tone={guest ? "surface" : "canvas"}
              detail={content.media.scheduleDetail}
            />
            <FaithSection
              content={content.faith}
              tone={guest ? "canvas" : "surface"}
              details={content.media.faithDetails}
            />
            {cineCouple ? <CinematicMoment moment={cineCouple} /> : null}
            <OurTeamSection
              content={content.familyTeam}
              chapter={content.editorial.chapters.family}
              tone={guest ? "surface" : "canvas"}
            />
            <FamiliesBlessingSection
              content={content.familiesBlessing}
              tone={guest ? "canvas" : "surface"}
            />
            {showGallery ? (
              <MomentsGallerySection
                content={content.gallery}
                chapter={content.editorial.chapters.moments}
                tone={guest ? "canvas" : "surface"}
              />
            ) : null}
            <DressGuidanceSection
              content={content.dress}
              chapter={content.editorial.chapters.celebrate}
              tone={guest ? "surface" : "canvas"}
            />
            {cineClosing ? <CinematicMoment moment={cineClosing} /> : null}
            <PresenceGiftSection
              content={content.presenceGift}
              tone={guest ? "canvas" : "surface"}
            />
            {guest && rsvpContext ? (
              <RsvpSection
                slug={guest.slug}
                maxSeats={guest.maxSeats ?? guest.seats}
                deadlineIso={guest.rsvpDeadlineIso ?? content.rsvp.deadlineIso}
                accessToken={rsvpContext.accessToken}
                existingRsvp={rsvpContext.existingRsvp}
                persistenceReady={rsvpContext.persistenceReady}
                deadlinePassed={rsvpContext.deadlinePassed}
                tone="canvas"
              />
            ) : null}
            <EditorialClosing
              content={content}
              tone={guest ? "surface" : "canvas"}
            />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
