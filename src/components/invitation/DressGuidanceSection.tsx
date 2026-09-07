import type { DressGuidanceContent } from "@/content/types";
import type { EditorialChapter } from "@/content/editorial-types";
import { Reveal } from "@/components/invitation/Reveal";
import { ChapterMark } from "@/components/invitation/ChapterMark";

type DressGuidanceSectionProps = {
  content: DressGuidanceContent;
  chapter?: EditorialChapter;
  tone?: "canvas" | "surface";
};

/**
 * Orientación de vestimenta — editorial, sin códigos rígidos.
 */
export function DressGuidanceSection({
  content,
  chapter,
  tone = "canvas",
}: DressGuidanceSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="vestimenta"
      className={`${background} section-pad text-ink`}
      aria-labelledby="dress-title"
      data-testid="dress-section"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        {chapter ? <ChapterMark chapter={chapter} className="mb-8" /> : null}
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.34em] text-ink-subtle">
          {content.eyebrow}
        </p>

        <h2
          id="dress-title"
          className="font-display mt-5 text-[clamp(2.15rem,8.5vw,3rem)] leading-[0.95] font-medium tracking-[-0.02em] text-balance"
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-7 max-w-[22rem] font-sans text-[1.0625rem] leading-[1.8] text-ink-muted text-pretty">
          {content.body}
        </p>

        <div className="mx-auto mt-12 max-w-[18rem]">
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-ink-subtle">
            {content.suggestionLabel}
          </p>
          <p className="font-display mt-3 text-[clamp(1.25rem,5vw,1.5rem)] tracking-[0.04em] text-ink">
            {content.suggestion}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
