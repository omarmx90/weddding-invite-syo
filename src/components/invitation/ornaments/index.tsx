/**
 * Sistema ornamental editorial — papelería fina católica.
 * SVG originales; decorativos con aria-hidden salvo cuando el padre aporta texto.
 */

type OrnamentProps = {
  className?: string;
};

/** Cruz latina mínima — taupe/sand vía currentColor. */
export function LatinCross({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 36"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1.5V34.5M4.5 11.5H19.5"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Rama botánica lineal — flourish controlado. */
export function BotanicalSprig({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 14C16 14 22 8 36 8C50 8 56 14 68 14"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M22 14C24 10 28 7.5 32 7M28 14C29.5 11.5 32 9.5 35 9"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M40 8C43 9.5 46 12 48 14M44 8.5C47 10.5 49.5 12.5 51 14"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Monograma tipográfico S & O. */
export function MonogramSO({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="32"
        y="20"
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-display), 'Bodoni Moda', Georgia, serif",
          fontSize: "15px",
          letterSpacing: "0.12em",
        }}
      >
        S &amp; O
      </text>
    </svg>
  );
}

/**
 * Medallón mariano abstracto — óvalo, rayos y estrella.
 * No es un retrato; grabado de papelería.
 */
export function GuadalupeMark({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Rayos suaves */}
      <path
        d="M24 4V9M24 47V52M8 28H13M35 28H40M12.5 12.5L15.5 15.5M32.5 40.5L35.5 43.5M35.5 12.5L32.5 15.5M15.5 40.5L12.5 43.5"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Manto / silueta oval */}
      <ellipse
        cx="24"
        cy="28"
        rx="9.5"
        ry="14"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path
        d="M18 36C19.5 40 22 42.5 24 42.5C26 42.5 28.5 40 30 36"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      {/* Estrella */}
      <path
        d="M24 18.5L24.7 20.6H26.9L25.1 21.9L25.8 24L24 22.7L22.2 24L22.9 21.9L21.1 20.6H23.3L24 18.5Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Medallón de San Judas — círculo, halo y pequeña llama abstracta.
 */
export function JudeMark({ className }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="24"
        cy="30"
        r="11"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path
        d="M13 20C16 16.5 20 14.5 24 14.5C28 14.5 32 16.5 35 20"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Llama / medallón interior */}
      <path
        d="M24 24C24 24 21.5 27.5 21.5 30C21.5 32.2 22.6 33.5 24 33.5C25.4 33.5 26.5 32.2 26.5 30C26.5 27.5 24 24 24 24Z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type OrnamentalDividerProps = OrnamentProps & {
  /** Motivo central */
  motif?: "cross" | "diamond" | "monogram" | "sprig";
};

/**
 * Separador editorial: líneas finas + motivo central.
 */
export function OrnamentalDivider({
  className,
  motif = "diamond",
}: OrnamentalDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="h-px w-10 max-w-[18vw] bg-current opacity-35 sm:w-14" />
      {motif === "cross" ? (
        <LatinCross className="h-4 w-3 opacity-80" />
      ) : motif === "monogram" ? (
        <span className="font-display text-[0.7rem] tracking-[0.22em] opacity-80">
          S &amp; O
        </span>
      ) : motif === "sprig" ? (
        <BotanicalSprig className="h-3.5 w-11 opacity-80" />
      ) : (
        <span className="inline-block h-1 w-1 rotate-45 border border-current opacity-70" />
      )}
      <span className="h-px w-10 max-w-[18vw] bg-current opacity-35 sm:w-14" />
    </div>
  );
}
