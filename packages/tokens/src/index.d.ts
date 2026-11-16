/** CSS custom properties remain the runtime source of truth. */
export type ThemeMode = "light" | "dark";
export interface BrandPalette {
  background: string;
  hover: string;
  pressed: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
}
export interface PrimaryPalette extends BrandPalette {
  link: string;
  linkHover: string;
}
export interface ProductTheme {
  primary: PrimaryPalette;
  secondary: BrandPalette;
}
export interface TokenDefinition {
  name: `--${string}`;
  category: string;
  light: string;
  dark: string;
}
export declare const tokenContract: {
  version: 1;
  reference: { package: string; version: string };
  tokens: readonly TokenDefinition[];
};
