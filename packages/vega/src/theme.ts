import { useEffect, useState, type RefObject } from "react";

export interface ChartTheme {
  foreground: string;
  mutedForeground: string;
  background: string;
  border: string;
  primary: string;
  secondary: string;
  danger: string;
  font: string;
  labelSize: number;
  titleSize: number;
}

/** Reads the nearest CSS theme; watches scoped brands as well as document themes. */
export function useChartTheme(host: RefObject<HTMLElement | null>): ChartTheme | null {
  const [theme, setTheme] = useState<ChartTheme | null>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let frame = 0;
    const read = () => {
      const style = getComputedStyle(element);
      const probe = document.createElement("span");
      probe.style.display = "none";
      element.append(probe);
      const color = (name: string, fallback: string) => {
        probe.style.color = `var(${name}, ${fallback})`;
        return getComputedStyle(probe).color;
      };
      const fontSize = (name: string) => {
        probe.style.fontSize = `var(${name})`;
        return Number.parseFloat(getComputedStyle(probe).fontSize);
      };
      const next: ChartTheme = {
        foreground: color("--foreground", "CanvasText"),
        mutedForeground: color("--muted-foreground", "GrayText"),
        background: color("--background", "Canvas"),
        border: color("--border", "GrayText"),
        primary: color("--primary", "Highlight"),
        secondary: color("--secondary", "ButtonFace"),
        danger: color("--status-failed", "CanvasText"),
        font: style.fontFamily,
        labelSize: fontSize("--text-label"),
        titleSize: fontSize("--text-body"),
      };
      probe.remove();
      setTheme(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(read); };
    const observer = new MutationObserver(schedule);
    for (let node: HTMLElement | null = element; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-mol-theme"] });
    }
    const media = matchMedia("(prefers-color-scheme: dark)");
    const forced = matchMedia("(forced-colors: active)");
    media.addEventListener("change", schedule);
    forced.addEventListener("change", schedule);
    read();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      media.removeEventListener("change", schedule); forced.removeEventListener("change", schedule);
    };
  }, [host]);
  return theme;
}
