import Image from "next/image";
import type { WeddingMediaAsset } from "@/content/types";

type HeroAtmosphereProps = {
  media: WeddingMediaAsset;
  priority?: boolean;
};

/**
 * Medios a pantalla completa del hero. Sustituye el archivo en /public y la
 * ruta en el contenido — sin cambiar el layout.
 */
export function HeroAtmosphere({ media, priority = false }: HeroAtmosphereProps) {
  const isSvg = media.src.endsWith(".svg");

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden={media.alt ? undefined : true}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        unoptimized={isSvg}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-overlay absolute inset-0" />
    </div>
  );
}
