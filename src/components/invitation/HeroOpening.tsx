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
      className="relative flex h-dvh min-h-[100svh] w-full flex-col overflow-x-hidden overflow-y-auto"
      aria-label="Apertura de la invitación"
      data-testid="hero-opening"
    >
      <HeroAtmosphere media={content.media.hero} priority />

      <div className="relative z-10 flex min-h-[100svh] flex-1 flex-col items-center justify-center px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.25rem,calc(env(safe-area-inset-bottom)+1.25rem))] [@media(max-height:500px)]:min-h-0 [@media(max-height:500px)]:justify-between [@media(max-height:500px)]:py-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center [@media(max-height:500px)]:flex-none [@media(max-height:500px)]:py-4">
          <motion.div
            className="mb-9 h-px w-8 bg-hero-fg/45 [@media(max-height:500px)]:mb-5"
            aria-hidden="true"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : 0.05 }}
          />

          <motion.h1
            className="font-display max-w-[11ch] text-[clamp(2.65rem,12.5vw,4.85rem)] leading-[1.02] font-medium tracking-[-0.02em] text-hero-fg text-balance [@media(max-height:500px)]:text-[clamp(1.85rem,12vh,2.75rem)]"
            {...rise}
            transition={{ duration: reduceMotion ? 0.25 : 0.95, delay: reduceMotion ? 0 : 0.14 }}
          >
            {content.couple.displayName}
          </motion.h1>

          <motion.p
            className="mt-8 font-sans text-[0.71875rem] font-medium tracking-[0.38em] text-hero-fg/85 uppercase [@media(max-height:500px)]:mt-4"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.75, delay: reduceMotion ? 0 : 0.34 }}
          >
            {content.copy.tagline}
          </motion.p>

          <motion.p
            className="mt-9 font-display text-[1.125rem] font-normal tracking-[0.22em] text-hero-fg/92 [@media(max-height:500px)]:mt-4 [@media(max-height:500px)]:text-base"
            {...rise}
            transition={{ duration: reduceMotion ? 0.2 : 0.75, delay: reduceMotion ? 0 : 0.5 }}
          >
            <time dateTime={content.date.iso}>{content.date.display}</time>
          </motion.p>
        </div>

        <motion.div
          className="shrink-0"
          {...rise}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.66 }}
        >
          <button
            type="button"
            onClick={onEnter}
            data-testid="hero-cta"
            className="group inline-flex min-h-11 min-w-[12.5rem] items-center justify-center px-6 py-3 font-sans text-[0.8125rem] font-medium tracking-[0.24em] text-hero-fg uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-fg"
          >
            <span className="border-b border-hero-fg/55 pb-1 transition-[border-color] group-hover:border-hero-fg">
              {content.copy.heroCta}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
