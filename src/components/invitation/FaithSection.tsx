import type { FaithContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";

type FaithSectionProps = {
  content: FaithContent;
  tone?: "canvas" | "surface";
};

function MinimalCross({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2V30M5 11H19"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sección de fe — tipográfica, breve y respetuosa.
 */
export function FaithSection({ content, tone = "surface" }: FaithSectionProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="nuestra-fe"
      className={`${background} section-pad text-ink`}
      aria-labelledby="faith-title"
      data-testid="faith-section"
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />

        <MinimalCross className="mx-auto mt-10 h-8 w-6 text-taupe/70" />

        <h2
          id="faith-title"
          className="font-display mt-6 text-[clamp(1.85rem,7vw,2.5rem)] leading-snug font-medium tracking-[-0.01em] text-balance"
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-7 max-w-[22rem] font-sans text-[1.0625rem] leading-[1.75] text-ink-muted text-pretty">
          {content.body}
        </p>

        {content.patrons.length > 0 ? (
          <p className="mx-auto mt-10 max-w-[20rem] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-subtle text-balance">
            {content.patrons.map((patron, index) => (
              <span key={patron}>
                {index > 0 ? (
                  <span className="mx-2 text-sand" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <span>{patron}</span>
              </span>
            ))}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
