import type { DressGuidanceContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type DressGuidanceSectionProps = {
  content: DressGuidanceContent;
  tone?: "canvas" | "surface";
};

/**
 * Orientación de vestimenta — editorial, sin códigos rígidos.
 */
export function DressGuidanceSection({
  content,
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
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <p className="mt-10 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-ink-subtle">
          {content.eyebrow}
        </p>

        <h2
          id="dress-title"
          className="font-display mt-5 text-[clamp(2rem,8vw,2.75rem)] leading-tight font-medium tracking-[-0.01em] text-balance"
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-7 max-w-[22rem] font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty">
          {content.body}
        </p>

        <div className="mx-auto mt-10 max-w-[18rem]">
          <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
            {content.suggestionLabel}
          </p>
          <p className="font-display mt-3 text-[1.25rem] tracking-wide text-ink">
            {content.suggestion}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
