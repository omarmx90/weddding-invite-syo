import Image from "next/image";
import type { CinematicMomentContent } from "@/content/editorial-types";
import { Reveal } from "@/components/invitation/Reveal";

type CinematicMomentProps = {
  moment: CinematicMomentContent;
};

/**
 * Momento fotográfico de alto impacto entre secciones.
 * Gradiente cálido mínimo para contraste — sin overlay negro genérico.
 */
export function CinematicMoment({ moment }: CinematicMomentProps) {
  return (
    <section
      className="relative isolate min-h-[72svh] w-full overflow-hidden bg-ink"
      aria-label={moment.title}
      data-testid={`cinematic-${moment.id}`}
    >
      <Image
        src={moment.src}
        alt={moment.alt}
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: moment.objectPosition ?? "50% 40%" }}
        loading="lazy"
      />
      <div className="cinematic-veil pointer-events-none absolute inset-0" aria-hidden="true" />

      <Reveal className="absolute inset-x-0 bottom-0 z-10 px-[max(1.35rem,env(safe-area-inset-left))] pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] pr-[max(1.35rem,env(safe-area-inset-right))]">
        <p className="font-display max-w-[16rem] text-[clamp(2rem,9vw,3.25rem)] leading-[0.95] font-medium tracking-[-0.03em] text-warm-white text-balance md:max-w-[22rem]">
          {moment.title}
        </p>
      </Reveal>
    </section>
  );
}
