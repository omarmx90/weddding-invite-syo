"use client";

import { motion, useReducedMotion } from "motion/react";
import type { WeddingContent } from "@/content/types";

type IntroSectionProps = {
  content: WeddingContent;
};

export function IntroSection({ content }: IntroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="section-pad bg-canvas text-ink"
      aria-labelledby="intro-title"
      data-testid="intro-section"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--content-max)] text-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {content.copy.introEyebrow}
        </p>
        <h2
          id="intro-title"
          className="font-display mt-7 text-[clamp(1.85rem,7.5vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance"
        >
          {content.copy.introTitle}
        </h2>
        <p className="mt-7 font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty">
          {content.copy.introBody}
        </p>
        <hr className="invite-rule mx-auto mt-12" aria-hidden="true" />
        <p className="mt-10 font-display text-[1.35rem] text-ink">
          {content.couple.displayName}
        </p>
        <p className="mt-3 font-sans text-sm tracking-[0.22em] text-ink-muted">
          <time dateTime={content.date.iso}>{content.date.display}</time>
        </p>
      </motion.div>
    </section>
  );
}
