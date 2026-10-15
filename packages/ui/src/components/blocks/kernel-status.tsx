/**
 * One kernel's status, in the shared status vocabulary.
 *
 * The dot is not the only signal: the word is always visible.
 */

import type { JSX } from "react";

import { cn } from "../../lib/utils";
import { StatusMark, type Status } from "../ui/status-mark";

export type KernelPhase = "idle" | "loading" | "ready" | "busy" | "error";

const PHASE: Record<KernelPhase, { status: Status; label: string }> = {
  idle: { status: "draft", label: "Idle" },
  loading: { status: "queued", label: "Starting" },
  ready: { status: "ready", label: "Ready" },
  busy: { status: "running", label: "Running" },
  error: { status: "failed", label: "Failed" },
};

export interface KernelStatusProps {
  phase: KernelPhase;
  /** Shown as the accessible description when the kernel failed. */
  error?: string | null;
  className?: string;
}

export function KernelStatus({ phase, error, className }: KernelStatusProps): JSX.Element {
  const { status, label } = PHASE[phase];
  return (
    <span data-slot="kernel-status" className={cn("inline-flex items-center gap-2 text-body", className)} title={phase === "error" ? error ?? undefined : undefined}>
      <StatusMark status={status} />
      <span className="font-semibold">{label}</span>
      {phase === "error" && error ? <span className="truncate text-muted-foreground">{error}</span> : null}
    </span>
  );
}
