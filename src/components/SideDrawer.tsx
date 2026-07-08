"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ACCOUNT_PAGES,
  LEGAL_PAGES,
  NAV_PAGES,
  navHref,
  orbitHref,
} from "@/lib/navigation";
import { SISTER_ORBITS } from "@/lib/sister-orbits";
import type { SisterOrbitId } from "@/lib/sister-orbits";
import { useAuth } from "@/lib/use-auth";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SideDrawer({ open, onClose }: SideDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [hash, setHash] = useState("");
  const [orbit, setOrbit] = useState<SisterOrbitId | null>(null);

  useEffect(() => {
    const update = () => {
      setHash(window.location.hash);
      const params = new URLSearchParams(window.location.search);
      const o = params.get("orbit");
      setOrbit(o as SisterOrbitId | null);
    };
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

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
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        id="side-drawer"
        ref={panelRef}
        tabIndex={-1}
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-white/10 bg-black px-6 py-20 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
          Pleiades
        </p>

        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
          Pages
        </p>
        <ul className="mb-8 flex flex-col gap-1">
          {NAV_PAGES.map((page) => {
            const href = navHref(page);
            const isActive = page.hash
              ? pathname === page.href && hash === page.hash && !orbit
              : pathname === page.href && !page.hash;

            return (
              <li key={`${page.label}-${href}`}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {page.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
          Account
        </p>
        <ul className="mb-8 flex flex-col gap-1">
          {!loading && user ? (
            <>
              <li>
                <Link
                  href="/account"
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/account"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {user.name}
                  <span className="mt-0.5 block text-xs font-normal text-zinc-600">
                    {user.xConnected
                      ? `@${user.xUsername ?? "x"} connected`
                      : "Account & X"}
                  </span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    void logout().then(onClose);
                  }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                >
                  Sign out
                </button>
              </li>
            </>
          ) : (
            ACCOUNT_PAGES.map((page) => {
              const href = navHref(page);
              const isActive = pathname === page.href;
              return (
                <li key={`${page.label}-${href}`}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {page.label}
                  </Link>
                </li>
              );
            })
          )}
        </ul>

        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
          Sister orbits
        </p>
        <ul className="mb-8 flex flex-col gap-1">
          {SISTER_ORBITS.map((sister) => {
            const href = orbitHref(sister.id);
            const isActive = orbit === sister.id && hash === "#watch";

            return (
              <li key={sister.id}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <span className="font-medium">{sister.name}</span>
                  <span className="ml-2 text-xs text-zinc-600">
                    {sister.feature}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
          Legal
        </p>
        <ul className="flex flex-col gap-1">
          {LEGAL_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                onClick={onClose}
                className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  pathname === page.href
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
