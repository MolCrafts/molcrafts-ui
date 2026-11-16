/**
 * Field: label, optional unit, control, and one caption line.
 *
 * Domain-free block for a narrow column. SettingsRow stays the horizontal
 * settings row. The label is not a `<label>`, so the control inside keeps
 * its own accessible name.
 */

import type { JSX, ReactNode } from "react";

export interface FieldProps {
  label: string;
  /** Sits on the label row, never inside the control. */
  unit?: string;
  /** One muted line under the control. Empty and null render nothing. */
  caption?: string | null;
  children: ReactNode;
}

export function Field({ label, unit, caption, children }: FieldProps): JSX.Element {
  return (
    <div data-slot="field" className="flex min-w-0 flex-col gap-1">
      <div className="flex min-w-0 items-baseline gap-1">
        <span className="truncate text-micro text-muted-foreground">{label}</span>
        {unit ? <span className="shrink-0 text-micro text-subtle-foreground">{unit}</span> : null}
      </div>
      {children}
      {caption ? (
        <span className="truncate font-mono text-micro text-subtle-foreground tabular-nums">{caption}</span>
      ) : null}
    </div>
  );
}
