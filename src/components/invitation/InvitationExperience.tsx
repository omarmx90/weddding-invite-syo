"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WeddingContent } from "@/content/types";
import { isGallerySectionVisible } from "@/content/wedding";
import { HeroOpening } from "@/components/invitation/HeroOpening";
import { IntroSection } from "@/components/invitation/IntroSection";
import { EventSection } from "@/components/invitation/EventSection";
import { OurTeamSection } from "@/components/invitation/OurTeamSection";
import { MomentsGallerySection } from "@/components/invitation/MomentsGallerySection";

type InvitationExperienceProps = {
  content: WeddingContent;
};

type Phase = "opening" | "invitation";

export function InvitationExperience({ content }: InvitationExperienceProps) {
  const [phase, setPhase] = useState<Phase>("opening");
  const reduceMotion = useReducedMotion();
  const showGallery = isGallerySectionVisible(content.gallery);

  const enterInvitation = useCallback(() => {
    setPhase("invitation");
  }, []);

  return (
    <div className="relative min-h-dvh bg-canvas" data-testid="invitation-root">
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
            <IntroSection content={content} />
            <EventSection
              sectionId="ceremony"
              event={content.event.ceremony}
              tone="surface"
            />
            <EventSection
              sectionId="reception"
              event={content.event.reception}
              tone="canvas"
            />
            <OurTeamSection content={content.familyTeam} tone="surface" />
            {showGallery ? (
              <MomentsGallerySection content={content.gallery} tone="canvas" />
            ) : null}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
