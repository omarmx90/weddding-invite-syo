import type { FaithContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import {
  BotanicalSprig,
  GuadalupeMark,
  JudeMark,
  LatinCross,
} from "@/components/invitation/ornaments";

type FaithSectionProps = {
  content: FaithContent;
  tone?: "canvas" | "surface";
};

/**
 * Sección de fe — momento íntimo de papelería católica editorial.
 * La tipografía y el versículo lideran; los símbolos son grabado fino.
 */
export function FaithSection({ content, tone = "surface" }: FaithSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";
  const guadalupe = content.patrons[0];
  const jude = content.patrons[1];

  return (
    <section
      id="nuestra-fe"
      className={`${background} section-pad text-ink`}
      aria-labelledby="faith-title"
      data-testid="faith-section"
    >
      <Reveal className="mx-auto w-full max-w-[min(100%,26rem)] text-center md:max-w-[28rem]">
        <LatinCross className="mx-auto h-8 w-5 text-taupe/70" />

        <h2
          id="faith-title"
          className="font-display mt-8 text-[clamp(1.95rem,7.5vw,2.65rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance"
        >
          {content.title}
        </h2>

        <blockquote className="mx-auto mt-10 max-w-[22rem]">
          <p className="font-display text-[clamp(1.2rem,4.8vw,1.45rem)] leading-[1.55] font-medium tracking-[-0.01em] text-ink text-pretty">
            {content.verse.text}
          </p>
          <footer className="mt-6">
            <cite className="font-sans text-[0.6875rem] font-medium not-italic uppercase tracking-[0.26em] text-ink-subtle">
              {content.verse.citation}
            </cite>
          </footer>
        </blockquote>

        <BotanicalSprig className="mx-auto mt-12 h-5 w-16 text-taupe/55" />

        <ul className="mt-12 flex flex-col items-center gap-10 md:mt-14 md:flex-row md:items-start md:justify-center md:gap-16">
          {guadalupe ? (
            <li className="flex max-w-[11rem] flex-col items-center gap-3">
              <GuadalupeMark className="h-12 w-10 text-taupe/65" />
              <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance">
                {guadalupe}
              </p>
            </li>
          ) : null}

          {guadalupe && jude ? (
            <li
              className="font-display text-sand md:pt-5"
              aria-hidden="true"
            >
              ·
            </li>
          ) : null}

          {jude ? (
            <li className="flex max-w-[11rem] flex-col items-center gap-3">
              <JudeMark className="h-12 w-10 text-taupe/65" />
              <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance">
                {jude}
              </p>
            </li>
          ) : null}
        </ul>

        <p className="mx-auto mt-12 max-w-[21rem] font-sans text-[1rem] leading-[1.75] text-ink-muted text-pretty md:mt-14">
          {content.patronsPrayer}
        </p>
      </Reveal>
    </section>
  );
}
