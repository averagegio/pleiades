export type NavPage = {
  href: string;
  label: string;
  hash?: string;
  search?: string;
};

export const NAV_PAGES: NavPage[] = [
  { href: "/", label: "Intro" },
  { href: "/", label: "Watch list", hash: "#watch" },
  { href: "/journal", label: "Journal" },
  { href: "/pin", label: "Pin" },
  { href: "/pin", label: "Checkout", hash: "#preorder" },
  { href: "/about", label: "About" },
];

export const ACCOUNT_PAGES: NavPage[] = [
  { href: "/login", label: "Log in / Sign up" },
  { href: "/account", label: "Account & X" },
];

export const LEGAL_PAGES: NavPage[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/safety", label: "Safety" },
];

export function navHref(page: NavPage): string {
  const base = page.hash ? `${page.href}${page.hash}` : page.href;
  return page.search ? `${page.href}?${page.search}${page.hash ?? ""}` : base;
}

export function orbitHref(orbitId: string): string {
  return `/?orbit=${orbitId}#watch`;
}
