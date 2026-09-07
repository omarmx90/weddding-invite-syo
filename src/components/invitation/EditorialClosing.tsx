import type { WeddingContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import {
  BotanicalSprig,
  OrnamentalDivider,
} from "@/components/invitation/ornaments";

type EditorialClosingProps = {
  content: WeddingContent;
  tone?: "canvas" | "surface";
};

/**
 * Cierre editorial mínimo — monograma, fecha y lugar.
 */
export function EditorialClosing({
  content,
  tone = "surface",
}: EditorialClosingProps) {
  const background = tone === "surface" ? "bg-surface" : "bg-canvas";

  return (
    <section
      className={`${background} px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] py-14 text-ink md:py-16`}
      aria-label="Cierre de la invitación"
      data-testid="editorial-closing"
    >
      <Reveal className="mx-auto flex w-full max-w-[18rem] flex-col items-center text-center">
        <OrnamentalDivider className="text-taupe/65" motif="monogram" />
        <BotanicalSprig className="mt-6 h-4 w-14 text-taupe/50" />
        <p className="mt-7 font-display text-[clamp(1.15rem,4.2vw,1.35rem)] tracking-[0.22em] text-ink">
          <time dateTime={content.date.iso}>{content.date.display}</time>
        </p>
        <p className="mt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink-subtle">
          {content.copy.locationLabel}
        </p>
      </Reveal>
    </section>
  );
}
