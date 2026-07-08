"use client";

type HamburgerButtonProps = {
  open: boolean;
  onClick: () => void;
};

export function HamburgerButton({ open, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="side-drawer"
      aria-label={open ? "Close menu" : "Open menu"}
      className="fixed top-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-50 backdrop-blur-sm transition-colors hover:bg-white/10"
    >
      <span className="relative h-4 w-5">
        <span
          className={`absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
            open ? "top-2 rotate-45" : "top-0"
          }`}
        />
        <span
          className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition-opacity duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
            open ? "top-2 -rotate-45" : "top-4"
          }`}
        />
      </span>
    </button>
  );
}
