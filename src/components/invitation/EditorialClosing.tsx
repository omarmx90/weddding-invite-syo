import type { WeddingContent } from "@/content/types";
import { Reveal } from "@/components/invitation/Reveal";
import { OrnamentalDivider } from "@/components/invitation/ornaments";

type EditorialClosingProps = {
  content: WeddingContent;
  tone?: "canvas" | "surface";
};

/**
 * Cierre ornamental discreto — monograma + fecha.
 * Sin cruz aquí: ya aparece en Ceremonia y Fe.
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
        <p className="mt-7 font-display text-[clamp(1.15rem,4.2vw,1.35rem)] tracking-[0.22em] text-ink">
          <time dateTime={content.date.iso}>{content.date.display}</time>
        </p>
      </Reveal>
    </section>
  );
}
