import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "wine" | "ghost" | "gold";
export type ButtonSize = "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  wine: "bg-wine text-cream hover:bg-wine-soft active:bg-ink",
  ghost:
    "border border-current text-ink hover:bg-ink hover:text-cream dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink",
  gold: "bg-gold text-ink hover:bg-gold-soft active:bg-gold",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "wine",
  size: ButtonSize = "md",
  className = "",
) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");
}

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    transitionTypes?: string[];
  };

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const {
    variant = "wine",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink(props: LinkProps) {
  const {
    variant = "wine",
    size = "md",
    className,
    children,
    href,
    transitionTypes,
    ...rest
  } = props;
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        className={buttonClasses(variant, size, className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      transitionTypes={transitionTypes}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {children}
    </Link>
  );
}