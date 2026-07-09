type LogoDownloadLinkProps = {
  variant?: "full" | "mark";
  className?: string;
};

const DOWNLOADS = {
  full: {
    href: "/pleiades-logo.png",
    filename: "pleiades-logo.png",
    label: "Download logo (PNG)",
  },
  mark: {
    href: "/pleiades-icon.png",
    filename: "pleiades-icon.png",
    label: "Download icon (PNG)",
  },
} as const;

export function LogoDownloadLink({
  variant = "full",
  className = "",
}: LogoDownloadLinkProps) {
  const { href, filename, label } = DOWNLOADS[variant];

  return (
    <a
      href={href}
      download={filename}
      className={`text-xs text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline ${className}`}
    >
      {label}
    </a>
  );
}
