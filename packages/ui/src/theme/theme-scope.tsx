"use client";

import { createContext, useContext, useState, type ComponentProps } from "react";
import type { ProductTheme, ThemeMode } from "@molcrafts/design-tokens";
import { cn } from "../lib/utils";

const ThemePortalContext = createContext<HTMLDivElement | null | undefined>(undefined);

/** Internal: undefined uses the document body; null waits for a scoped host. */
export function useThemePortalContainer() {
  return useContext(ThemePortalContext);
}

export interface ThemeScopeProps extends ComponentProps<"div"> {
  /** Controlled light/dark mode. Omit to inherit the surrounding CSS theme. */
  theme?: ThemeMode;
  /** Supply both complete brand families; status and neutral roles remain shared. */
  brand?: ProductTheme;
}

/** Theme CSS and a portal destination shared by all descendant MolCrafts overlays. */
export function ThemeScope({ theme, brand, className, style, children, ...props }: ThemeScopeProps) {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const palette = brand ? {
    "--primary": brand.primary.background,
    "--primary-hover": brand.primary.hover,
    "--primary-pressed": brand.primary.pressed,
    "--primary-foreground": brand.primary.foreground,
    "--primary-muted": brand.primary.muted,
    "--primary-muted-foreground": brand.primary.mutedForeground,
    "--primary-link": brand.primary.link,
    "--primary-link-hover": brand.primary.linkHover,
    "--secondary": brand.secondary.background,
    "--secondary-hover": brand.secondary.hover,
    "--secondary-pressed": brand.secondary.pressed,
    "--secondary-foreground": brand.secondary.foreground,
    "--secondary-muted": brand.secondary.muted,
    "--secondary-muted-foreground": brand.secondary.mutedForeground,
  } : {};
  return <div {...props} data-mol-theme={theme}
    className={cn("mol-product-theme bg-background text-foreground font-sans", className)}
    style={{ ...palette, ...style }}>
    <ThemePortalContext.Provider value={portalHost}>
      {children}
      <div data-mol-portal="" ref={setPortalHost} />
    </ThemePortalContext.Provider>
  </div>;
}
