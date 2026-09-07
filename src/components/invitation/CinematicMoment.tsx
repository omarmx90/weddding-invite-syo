import Image from "next/image";
import type { CSSProperties } from "react";
import type { CinematicMomentContent } from "@/content/editorial-types";
import { Reveal } from "@/components/invitation/Reveal";

type CinematicMomentProps = {
  moment: CinematicMomentContent;
};

/**
 * Momento fotográfico de alto impacto entre secciones.
 * Portrait: full-bleed en mobile; marco 2:3 centrado en desktop
 * para no aplastar verticales como el beso en la capilla.
 * Landscape: full-bleed con ritmo horizontal.
 */
export function CinematicMoment({ moment }: CinematicMomentProps) {
  const hasTitle = Boolean(moment.title?.trim());
  const layout = moment.layout ?? "portrait";
  const veil = moment.veil ?? (hasTitle ? "soft" : "none");
  const mobilePos =
    moment.objectPositionMobile ?? moment.objectPosition ?? "50% 40%";
  const desktopPos =
    moment.objectPositionDesktop ?? moment.objectPosition ?? "50% 40%";

  const cropStyle = {
    "--cine-object-pos-mobile": mobilePos,
    "--cine-object-pos-desktop": desktopPos,
  } as CSSProperties;

  const frameClass =
    layout === "landscape"
      ? "relative min-h-[56svh] w-full md:min-h-[64vh] lg:min-h-[70vh]"
      : "relative min-h-[78svh] w-full md:mx-auto md:min-h-[min(88vh,52rem)] md:w-auto md:aspect-[2/3] md:max-h-[min(88vh,52rem)]";

  return (
    <section
      className="cinematic-moment relative isolate w-full overflow-hidden bg-canvas"
      aria-label={moment.title?.trim() || moment.alt}
      data-testid={`cinematic-${moment.id}`}
      data-cinematic-layout={layout}
      style={cropStyle}
    >
      <div className={frameClass}>
        <Image
          src={moment.src}
          alt={moment.alt}
          fill
          sizes={
            layout === "portrait"
              ? "(max-width: 767px) 100vw, min(52rem, 60vw)"
              : "100vw"
          }
          className="cinematic-photo object-cover"
          loading="lazy"
        />
        {veil === "soft" ? (
          <div
            className="cinematic-veil pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        ) : null}

        {hasTitle ? (
          <Reveal className="absolute inset-x-0 bottom-0 z-10 px-[max(1.35rem,env(safe-area-inset-left))] pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] pr-[max(1.35rem,env(safe-area-inset-right))]">
            <p className="font-display max-w-[16rem] text-[clamp(2rem,9vw,3.25rem)] leading-[0.95] font-medium tracking-[-0.03em] text-warm-white text-balance md:max-w-[22rem]">
              {moment.title}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
