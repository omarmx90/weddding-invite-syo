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
import { RsvpComingSoonSection } from "@/components/invitation/RsvpComingSoonSection";
import { CinematicMoment } from "@/components/invitation/CinematicMoment";

type InvitationExperienceProps = {
  content: WeddingContent;
  guest?: GuestInvitation;
};

type Phase = "opening" | "invitation";

export function InvitationExperience({
  content,
  guest,
}: InvitationExperienceProps) {
  const [phase, setPhase] = useState<Phase>("opening");
  const reduceMotion = useReducedMotion();
  const showGallery = isGallerySectionVisible(content.gallery);
  const isPersonalized = Boolean(guest);
  const [cineCouple, cineFamily] = content.editorial.cinematic;

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
            />
            {guest ? (
              <PersonalizedWelcome guest={guest} tone="surface" />
            ) : null}
            <IntroSection content={content} />
            <EventSection
              sectionId="ceremony"
              event={content.event.ceremony}
              tone={guest ? "canvas" : "surface"}
            />
            <NarrativeBridge
              text={content.copy.celebrationTransition}
              tone={guest ? "surface" : "canvas"}
            />
            <EventSection
              sectionId="reception"
              event={content.event.reception}
              tone={guest ? "canvas" : "surface"}
            />
            <DayScheduleSection
              schedule={content.schedule}
              tone={guest ? "surface" : "canvas"}
            />
            <FaithSection
              content={content.faith}
              tone={guest ? "canvas" : "surface"}
            />
            {cineCouple ? <CinematicMoment moment={cineCouple} /> : null}
            <OurTeamSection
              content={content.familyTeam}
              chapter={content.editorial.chapters.family}
              tone={guest ? "surface" : "canvas"}
            />
            {cineFamily ? <CinematicMoment moment={cineFamily} /> : null}
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
            {guest ? (
              <RsvpComingSoonSection
                deadlineIso={
                  guest.rsvpDeadlineIso ?? content.rsvp.deadlineIso
                }
                tone="canvas"
              />
            ) : null}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
