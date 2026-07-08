export type NavPage = {
  href: string;
  label: string;
  hash?: string;
};

export const NAV_PAGES: NavPage[] = [
  { href: "/", label: "Intro" },
  { href: "/", label: "Watch list", hash: "#watch" },
  { href: "/about", label: "About" },
];

export function navHref(page: NavPage): string {
  return page.hash ? `${page.href}${page.hash}` : page.href;
}
