import { OrnamentalDivider } from "@/components/invitation/ornaments";

type SectionEndMarkProps = {
  className?: string;
};

/**
 * Cierre editorial de sección — líneas + monograma S & O.
 * Marca el final visual además del cambio de tono canvas/surface.
 */
export function SectionEndMark({ className }: SectionEndMarkProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-[18rem] justify-center ${className ?? "mt-14 md:mt-16"}`}
      data-testid="section-end-mark"
    >
      <OrnamentalDivider className="text-taupe/60" motif="monogram" />
    </div>
  );
}
