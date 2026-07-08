"use client";

type PinMockupProps = {
  className?: string;
  glowing?: boolean;
};

export function PinMockup({ className = "", glowing = true }: PinMockupProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className={`absolute h-48 w-48 rounded-full blur-3xl ${
          glowing ? "bg-blue-400/20 animate-pulse-slow" : "bg-blue-400/10"
        }`}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Pin body */}
        <div className="relative h-52 w-32 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 shadow-2xl ring-1 ring-white/10">
          {/* Metallic edge */}
          <div className="absolute inset-x-3 top-4 h-24 rounded-full bg-gradient-to-b from-zinc-500/30 to-transparent" />

          {/* LED */}
          <div className="absolute left-1/2 top-10 -translate-x-1/2">
            <div
              className={`h-5 w-5 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(147,197,253,0.8)] ${
                glowing ? "animate-twinkle" : ""
              }`}
            />
            <div className="absolute inset-0 h-5 w-5 rounded-full bg-blue-200/40 blur-sm" />
          </div>

          {/* Button */}
          <div className="absolute bottom-14 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-600 to-zinc-800 ring-2 ring-zinc-900 shadow-inner" />

          {/* Pin clasp */}
          <div className="absolute -right-1 top-1/2 h-16 w-3 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-zinc-600 to-zinc-800" />
        </div>

        {/* Pin needle */}
        <div className="absolute -bottom-6 left-1/2 h-8 w-1 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-zinc-500 to-zinc-700" />
      </div>
    </div>
  );
}
