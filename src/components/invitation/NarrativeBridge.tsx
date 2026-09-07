import { Reveal } from "@/components/invitation/Reveal";

type NarrativeBridgeProps = {
  text: string;
  tone?: "canvas" | "surface";
  testId?: string;
};

/**
 * Puente tipográfico breve entre secciones del día.
 */
export function NarrativeBridge({
  text,
  tone = "canvas",
  testId = "celebration-transition",
}: NarrativeBridgeProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      className={`${background} section-pad text-ink`}
      aria-label="Transición hacia la celebración"
      data-testid={testId}
    >
      <Reveal className="mx-auto w-full max-w-[var(--content-max)] text-center">
        <hr className="invite-rule mx-auto" aria-hidden="true" />
        <p className="font-display mt-10 text-[clamp(1.35rem,5.5vw,1.7rem)] leading-snug text-ink text-balance">
          {text}
        </p>
      </Reveal>
    </section>
  );
}
