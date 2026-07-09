"use client";

import { useState } from "react";
import { HamburgerButton } from "@/components/HamburgerButton";
import { SideDrawer } from "@/components/SideDrawer";
import { SiteFooter } from "@/components/SiteFooter";

type AppShellProps = {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
};

export function AppShell({
  children,
  showNav = true,
  showFooter = true,
}: AppShellProps) {
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
      <div className="flex min-h-dvh flex-col">
        <div className="flex-1">{children}</div>
        {showFooter && <SiteFooter />}
      </div>
    </>
  );
}
