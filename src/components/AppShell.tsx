"use client";

import { useState } from "react";
import { HamburgerButton } from "@/components/HamburgerButton";
import { SideDrawer } from "@/components/SideDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <HamburgerButton
        open={drawerOpen}
        onClick={() => setDrawerOpen((v) => !v)}
      />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {children}
    </>
  );
}
