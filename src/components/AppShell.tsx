"use client";

import { useState } from "react";
import { HamburgerButton } from "@/components/HamburgerButton";
import { SideDrawer } from "@/components/SideDrawer";

type AppShellProps = {
  children: React.ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = true }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {showNav && (
        <>
          <HamburgerButton
            open={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          />
          <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
      )}
      {children}
    </>
  );
}
