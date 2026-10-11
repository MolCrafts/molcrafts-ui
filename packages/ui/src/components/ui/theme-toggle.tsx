import { WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import type { JSX } from "react";
import type { ThemeMode } from "@molcrafts/ui-tokens";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface ThemeToggleProps {
  /** The mode shown now. The product owns the preference and its storage. */
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
}

/** Icon-only light/dark switch. Its name and tooltip say which mode it switches to. */
export function ThemeToggle({ theme, onThemeChange, className }: ThemeToggleProps): JSX.Element {
  const next: ThemeMode = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} theme`;
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={cn("text-muted-foreground", className)}
      onClick={() => onThemeChange(next)}
    >
      {theme === "dark" ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
    </Button>
  );
}
