"use client";

import { motion, useReducedMotion } from "motion/react";
import type { WeddingContent } from "@/content/types";
import { HeroAtmosphere } from "@/components/media/HeroAtmosphere";

type HeroOpeningProps = {
  content: WeddingContent;
  onEnter: () => void;
};

export function HeroOpening({ content, onEnter }: HeroOpeningProps) {
  const reduceMotion = useReducedMotion();

  const rise = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  return (
    <section
      className="relative flex h-dvh min-h-[100svh] w-full flex-col overflow-x-hidden overflow-y-auto bg-warm-white"
      aria-label="Apertura de la invitación"
      data-testid="hero-opening"
    >
      <HeroAtmosphere media={content.media.hero} priority />

      <div className="relative z-10 flex min-h-[100svh] flex-1 flex-col px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(1.6rem,env(safe-area-inset-top))] pb-[max(1.35rem,calc(env(safe-area-inset-bottom)+0.75rem))] md:max-w-[min(100%,34rem)] md:justify-center md:py-[max(3rem,env(safe-area-inset-top))] md:pl-[max(3.25rem,env(safe-area-inset-left))]">
        <div className="flex shrink-0 flex-col pt-1 md:pt-0 [@media(max-height:500px)]:pt-0">
          <motion.p
            className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.38em] text-ink-subtle"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.06 }}
          >
            {content.copy.heroEyebrow}
          </motion.p>

          <motion.h1
            className="font-display mt-6 text-ink md:mt-7"
            {...rise}
            transition={{ duration: reduceMotion ? 0.25 : 0.95, delay: reduceMotion ? 0 : 0.14 }}
          >
            <span className="hero-name block">{content.couple.partnerOne}</span>
            <span className="hero-ampersand block" aria-hidden="true">
              &
            </span>
            <span className="hero-name block pl-[0.06em] md:pl-[0.12em]">
              {content.couple.partnerTwo}
            </span>
            <span className="sr-only">{content.couple.displayName}</span>
          </motion.h1>

          <motion.p
            className="mt-7 font-sans text-[0.75rem] font-medium uppercase tracking-[0.36em] text-ink-muted md:mt-9 [@media(max-height:500px)]:mt-3"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.28 }}
          >
            {content.copy.tagline}
          </motion.p>

          <motion.p
            className="mt-5 font-display text-[clamp(1.2rem,4.6vw,1.55rem)] tracking-[0.2em] text-ink md:mt-6 [@media(max-height:500px)]:mt-2"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.4 }}
          >
            <time dateTime={content.date.iso}>{content.date.display}</time>
          </motion.p>

          <motion.p
            className="mt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-ink-subtle md:mt-4 [@media(max-height:500px)]:mt-2"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.5 }}
          >
            {content.copy.locationLabel}
          </motion.p>
        </div>

        <div className="flex min-h-[36svh] flex-1 flex-col justify-end md:min-h-0 md:flex-none md:justify-start md:pt-14">
          <motion.div
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.62 }}
          >
            <button
              type="button"
              onClick={onEnter}
              data-testid="hero-cta"
              className="group inline-flex min-h-11 min-w-[13rem] items-center justify-center border border-taupe/75 bg-warm-white px-7 py-3 font-sans text-[0.75rem] font-medium tracking-[0.28em] text-ink uppercase transition-[border-color,background-color,transform] hover:border-taupe hover:bg-beige active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe"
            >
              <span className="border-b border-transparent pb-0.5 transition-[border-color] group-hover:border-taupe/70">
                {content.copy.heroCta}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
