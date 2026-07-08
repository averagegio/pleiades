"use client";

type StarPinSchematicProps = {
  className?: string;
  activePart?: "led" | "button" | "ble" | "clasp" | null;
};

/** Four-point star path centered at (160, 145) */
const STAR_LED_PATH =
  "M 160 128 L 166 141 L 180 141 L 169 150 L 174 164 L 160 155 L 146 164 L 151 150 L 140 141 L 154 141 Z";

export function StarPinSchematic({
  className = "",
  activePart = null,
}: StarPinSchematicProps) {
  const highlight = (part: string) =>
    activePart === part ? "stroke-blue-300 opacity-100" : "stroke-zinc-600 opacity-60";

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 320 360"
        className="mx-auto h-auto w-full max-w-[300px]"
        aria-label="Pleiades Pin schematic"
        role="img"
      >
        {/* Circular disc body */}
        <circle
          cx="160"
          cy="160"
          r="95"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(228,228,231,0.35)"
          strokeWidth="1.5"
        />
        <circle
          cx="160"
          cy="160"
          r="82"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.75"
          strokeDasharray="4 3"
        />

        {/* Star-shaped LED */}
        <path
          d={STAR_LED_PATH}
          className={activePart === "led" ? "fill-blue-300" : "fill-white"}
          opacity={activePart === "led" ? 1 : 0.85}
        />
        {activePart === "led" && (
          <circle cx="160" cy="145" r="22" fill="rgba(147,197,253,0.12)" />
        )}

        {/* Tap button on lower edge */}
        <circle
          cx="160"
          cy="238"
          r="12"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          className={activePart === "button" ? "stroke-blue-300" : ""}
        />
        <circle cx="160" cy="238" r="5" fill="rgba(255,255,255,0.5)" />

        {/* BLE module hint */}
        <rect
          x="138"
          y="168"
          width="44"
          height="22"
          rx="4"
          fill="none"
          className={highlight("ble")}
          strokeWidth="1"
        />

        {/* Clasp */}
        <rect
          x="248"
          y="155"
          width="12"
          height="40"
          rx="3"
          fill="none"
          className={highlight("clasp")}
          strokeWidth="1"
        />

        {/* Callout lines + labels */}
        <g fill="none" strokeWidth="0.75" className="text-[9px]">
          <line x1="160" y1="128" x2="160" y2="95" className={highlight("led")} />
          <text x="160" y="88" textAnchor="middle" fill="rgb(161,161,170)" fontSize="9">
            Star LED
          </text>

          <line x1="172" y1="238" x2="210" y2="255" className={highlight("button")} />
          <text x="215" y="259" fill="rgb(161,161,170)" fontSize="9">
            Tap
          </text>

          <line x1="182" y1="179" x2="220" y2="195" className={highlight("ble")} />
          <text x="224" y="199" fill="rgb(161,161,170)" fontSize="9">
            BLE
          </text>

          <line x1="254" y1="175" x2="275" y2="165" className={highlight("clasp")} />
          <text x="278" y="169" fill="rgb(161,161,170)" fontSize="9">
            Clasp
          </text>
        </g>

        {/* Pin post */}
        <line
          x1="160"
          y1="255"
          x2="160"
          y2="310"
          stroke="rgba(161,161,170,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
