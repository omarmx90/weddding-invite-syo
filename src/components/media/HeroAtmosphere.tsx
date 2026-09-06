import Image from "next/image";
import type { CSSProperties } from "react";
import type { WeddingMediaAsset } from "@/content/types";

type HeroMedia = WeddingMediaAsset & {
  objectPositionMobile?: string;
  objectPositionDesktop?: string;
};

type HeroAtmosphereProps = {
  media: HeroMedia;
  priority?: boolean;
};

type HeroPhotoStyle = CSSProperties & {
  ["--hero-object-pos-mobile"]?: string;
  ["--hero-object-pos-desktop"]?: string;
};

/**
 * Fotografía editorial del hero con velo tipo papel / acuarela vía CSS.
 */
export function HeroAtmosphere({ media, priority = false }: HeroAtmosphereProps) {
  const mobilePos = media.objectPositionMobile ?? media.objectPosition ?? "54% 42%";
  const desktopPos = media.objectPositionDesktop ?? media.objectPosition ?? "62% 46%";

  const photoStyle: HeroPhotoStyle = {
    ["--hero-object-pos-mobile"]: mobilePos,
    ["--hero-object-pos-desktop"]: desktopPos,
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="hero-photo-frame absolute inset-0 md:inset-y-0 md:left-[26%] md:right-0"
        style={photoStyle}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, 74vw"
          className="hero-photo object-cover"
          data-testid="hero-photo"
        />
      </div>

      <div className="hero-paper-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-paper-feather pointer-events-none absolute inset-0" aria-hidden="true" />

      <svg
        className="pointer-events-none absolute top-[max(1.25rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] h-14 w-14 text-taupe/30 md:h-[4.5rem] md:w-[4.5rem] md:text-taupe/25"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M32 56C32 56 18 42 18 28C18 20 24 14 32 14C40 14 46 20 46 28C46 42 32 56 32 56Z"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path d="M32 56V30" stroke="currentColor" strokeWidth="1.15" />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] left-[max(0.65rem,env(safe-area-inset-left))] h-12 w-12 text-sand/45 md:bottom-20 md:left-[24%] md:h-14 md:w-14"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 40C20 28 28 22 40 18"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M22 36C26 30 32 26 40 24"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M28 44C34 36 42 32 52 30"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
