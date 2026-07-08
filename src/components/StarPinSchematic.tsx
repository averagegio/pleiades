"use client";

type StarPinSchematicProps = {
  className?: string;
  activePart?: "led" | "button" | "ble" | "clasp" | null;
};

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
        {/* Star body outline */}
        <polygon
          points="160,40 190,120 275,120 205,175 230,260 160,215 90,260 115,175 45,120 130,120"
          fill="none"
          stroke="rgba(228,228,231,0.35)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points="160,55 180,115 240,115 190,155 210,230 160,195 110,230 130,155 80,115 140,115"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        {/* Center LED */}
        <circle
          cx="160"
          cy="145"
          r="10"
          className={activePart === "led" ? "fill-blue-300" : "fill-white"}
          opacity={activePart === "led" ? 1 : 0.85}
        />
        {activePart === "led" && (
          <circle cx="160" cy="145" r="18" fill="rgba(147,197,253,0.15)" />
        )}

        {/* Button at lower point */}
        <circle
          cx="160"
          cy="230"
          r="14"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          className={activePart === "button" ? "stroke-blue-300" : ""}
        />
        <circle cx="160" cy="230" r="6" fill="rgba(255,255,255,0.5)" />

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
          <line x1="160" y1="125" x2="160" y2="95" className={highlight("led")} />
          <text x="160" y="88" textAnchor="middle" fill="rgb(161,161,170)" fontSize="9">
            LED
          </text>

          <line x1="175" y1="230" x2="210" y2="250" className={highlight("button")} />
          <text x="215" y="254" fill="rgb(161,161,170)" fontSize="9">
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
          y1="260"
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
