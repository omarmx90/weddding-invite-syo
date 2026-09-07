import type { FamiliesBlessingContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import { OrnamentalDivider } from "@/components/invitation/ornaments";
import { SectionEndMark } from "@/components/invitation/SectionEndMark";

type FamiliesBlessingSectionProps = {
  content: FamiliesBlessingContent;
  tone?: "canvas" | "surface";
};

/**
 * Bendición de las familias — solo se renderiza con nombres reales y enabled.
 */
export function FamiliesBlessingSection({
  content,
  tone = "canvas",
}: FamiliesBlessingSectionProps) {
  if (!content.enabled) return null;
  if (
    content.brideParents.names.length === 0 ||
    content.groomParents.names.length === 0
  ) {
    return null;
  }

  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      id="nuestras-familias"
      className={`${background} section-pad text-ink`}
      aria-labelledby="families-blessing-title"
      data-testid="families-blessing"
    >
      <Reveal className="mx-auto w-full max-w-[min(100%,26rem)] text-center">
        <OrnamentalDivider className="text-taupe/65" motif="monogram" />
        <h2
          id="families-blessing-title"
          className="font-display mt-10 text-[clamp(1.85rem,7vw,2.45rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance"
        >
          {content.title}
        </h2>

        <div className="mt-12 flex flex-col gap-10 md:gap-12">
          <div>
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              {content.brideParents.label}
            </p>
            <p className="font-display mt-3 text-[clamp(1.15rem,4.5vw,1.35rem)] leading-snug text-ink text-balance">
              {content.brideParents.names.join(" · ")}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
              {content.groomParents.label}
            </p>
            <p className="font-display mt-3 text-[clamp(1.15rem,4.5vw,1.35rem)] leading-snug text-ink text-balance">
              {content.groomParents.names.join(" · ")}
            </p>
          </div>
        </div>
      </Reveal>

      <SectionEndMark />
    </section>
  );
}
