import Link from "next/link";
import { LEGAL_PAGES } from "@/lib/navigation";
import { PleiadesLogo } from "@/components/PleiadesLogo";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className = "" }: SiteFooterProps) {
  return (
    <footer
      className={`relative z-10 border-t border-white/10 bg-black px-6 py-10 ${className}`}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <PleiadesLogo variant="full" size="md" />
        <p className="max-w-sm text-sm text-zinc-500">
          The people watching app — private constellation, public sky.
        </p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-[10px] uppercase tracking-widest text-zinc-700">
          © {new Date().getFullYear()} Pleiades
        </p>
      </div>
    </footer>
  );
}
