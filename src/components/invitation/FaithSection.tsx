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
        strokeWidth="1.05"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sección de fe — aireada, tipográfica, marca editorial pequeña.
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

        <MinimalCross className="mx-auto mt-14 h-7 w-5 text-taupe/65" />

        <h2
          id="faith-title"
          className="font-display mt-8 text-[clamp(1.95rem,7.5vw,2.65rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance"
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-8 max-w-[21rem] font-sans text-[1.0625rem] leading-[1.8] text-ink-muted text-pretty">
          {content.body}
        </p>

        {content.patrons.length > 0 ? (
          <p className="mx-auto mt-12 max-w-[20rem] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink-subtle text-balance">
            {content.patrons.map((patron, index) => (
              <span key={patron}>
                {index > 0 ? (
                  <span className="mx-2.5 text-sand" aria-hidden="true">
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
