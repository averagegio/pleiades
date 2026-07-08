"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { href: "/home", label: "Watch list" },
  { href: "/", label: "Intro" },
];

export function SideDrawer({ open, onClose }: SideDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        id="side-drawer"
        ref={panelRef}
        tabIndex={-1}
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-zinc-950/95 px-6 py-20 backdrop-blur-md transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Pleiades
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-xs text-zinc-600">
          The people watching app
        </p>
      </nav>
    </>
  );
}
