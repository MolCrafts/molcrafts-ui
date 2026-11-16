import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { statusFill, type Status } from "./status-mark";

export type MeterTone = "primary" | Status;

export interface MeterProps {
  /** 0–100. Values outside are clamped. */
  value: number;
  tone?: MeterTone;
  /**
   * Accessible name. Omit it when the formatted value is already visible next
   * to the bar; the bar is then decorative.
   */
  label?: string;
  className?: string;
}

/** A thin horizontal bar that compares one percentage at a glance. */
export const Meter = ({ value, tone = "primary", label, className }: MeterProps): JSX.Element => {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <span
      data-slot="meter"
      {...(label
        ? { role: "meter", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent }
        : { "aria-hidden": true })}
      className={cn("block h-1 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <span
        className={cn("block h-full", tone === "primary" ? "bg-primary" : statusFill[tone])}
        style={{ width: `${percent}%` }}
      />
    </span>
  );
};
