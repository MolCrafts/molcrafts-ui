/**
 * Fact bands: the posture of one object, read in a single row.
 *
 * Domain-free blocks. Products pass formatted values; these blocks own the
 * band layout, hairline dividers, and description-list semantics. A band is
 * not something a reader opens or moves, so it has no box: a rule below it and
 * hairlines between cells carry the structure.
 */

import type { JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Meter, type MeterTone } from "../ui/meter";

const CELL = "flex min-w-0 flex-col gap-0.5 px-4 first:pl-0 [&+&]:border-l [&+&]:border-border";

export interface MetaFact {
  label: string;
  value: ReactNode;
  /** Monospace is reserved for code and identifiers. */
  mono?: boolean;
}

export interface MetaStripProps {
  facts: MetaFact[];
  className?: string;
}

/** Three to eight facts at one size. Not a grid of stat cards. */
export const MetaStrip = ({ facts, className }: MetaStripProps): JSX.Element => (
  <dl data-slot="meta-strip" className={cn("flex flex-wrap items-center gap-y-2 border-b border-border pb-3", className)}>
    {facts.map(fact => (
      <div key={fact.label} className={CELL}>
        <dt className="whitespace-nowrap text-label text-muted-foreground">{fact.label}</dt>
        <dd className={cn("truncate text-body-lg font-semibold tabular-nums text-foreground", fact.mono && "font-mono")}>
          {fact.value}
        </dd>
      </div>
    ))}
  </dl>
);

export interface Measure {
  label: string;
  /** Already formatted. This block does not decide precision. */
  value: string;
  /** 0–100. Draws a meter under the value. Omit it for counts. */
  percent?: number;
  tone?: MeterTone;
}

export interface MeasureBandProps {
  measures: Measure[];
  className?: string;
}

/** Several measures of one thing, read together, with meters doing the comparing. */
export const MeasureBand = ({ measures, className }: MeasureBandProps): JSX.Element => (
  <dl data-slot="measure-band" className={cn("flex flex-wrap gap-y-3 border-b border-border pb-3", className)}>
    {measures.map(measure => (
      <div key={measure.label} className={cn(CELL, "min-w-40 flex-1 gap-1")}>
        <dt className="text-label text-muted-foreground">{measure.label}</dt>
        <dd className="flex flex-col gap-1 text-title font-semibold tabular-nums text-foreground">
          {measure.value}
          {measure.percent != null && <Meter value={measure.percent} tone={measure.tone} />}
        </dd>
      </div>
    ))}
  </dl>
);
