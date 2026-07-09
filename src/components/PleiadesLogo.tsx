import Image from "next/image";
import Link from "next/link";

type PleiadesLogoProps = {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
  onClick?: () => void;
};

const SIZES = {
  full: {
    sm: { width: 120, height: 48, src: "/pleiades-logo-sm.png" },
    md: { width: 160, height: 64, src: "/pleiades-logo-sm.png" },
    lg: { width: 200, height: 80, src: "/pleiades-logo.png" },
  },
  mark: {
    sm: { width: 52, height: 40, src: "/pleiades-icon.png" },
    md: { width: 62, height: 48, src: "/pleiades-icon.png" },
    lg: { width: 78, height: 60, src: "/pleiades-icon.png" },
  },
} as const;

export function PleiadesLogo({
  variant = "full",
  size = "md",
  href = "/",
  className = "",
  onClick,
}: PleiadesLogoProps) {
  const { width, height, src } = SIZES[variant][size];

  const img = (
    <Image
      src={src}
      alt="Pleiades"
      width={width}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ maxHeight: height, maxWidth: width }}
      unoptimized
      priority={variant === "mark" && size === "md"}
    />
  );

  if (href == null) return img;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex shrink-0 transition-opacity hover:opacity-80"
      aria-label="Pleiades home"
    >
      {img}
    </Link>
  );
}
