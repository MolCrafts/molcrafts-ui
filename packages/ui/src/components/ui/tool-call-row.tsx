import { CheckmarkCircleRegular, DismissCircleRegular } from "@fluentui/react-icons";
import type { JSX } from "react";
import { ProgressSpinner } from "./progress-spinner";

export interface ToolCallRowProps {
  name: string;
  status: "running" | "success" | "failed";
  args?: string | null;
  summary?: string | null;
  /** Already formatted, for example "0.8s". */
  duration?: string | null;
}

/** One tool-call line: running, succeeded, or failed. */
export function ToolCallRow({ name, status, args, summary, duration }: ToolCallRowProps): JSX.Element {
  if (status === "running") {
    return (
      <div className="flex min-w-0 items-center gap-2 rounded-control px-2 py-1 text-label">
        <ProgressSpinner className="text-info" label="Tool running" />
        <span className="truncate font-mono text-foreground">
          {name}
          {args ? <span className="text-muted-foreground">({args})</span> : null}
        </span>
        <span className="flex-none text-muted-foreground">running…</span>
      </div>
    );
  }

  const failed = status === "failed";
  const Icon = failed ? DismissCircleRegular : CheckmarkCircleRegular;
  return (
    <div className="group/tool flex min-w-0 items-center gap-2 rounded-control px-2 py-1 text-label transition-colors hover:bg-muted/40">
      <Icon
        className={`size-3.5 flex-none ${failed ? "text-destructive" : "text-success"}`}
        aria-label={failed ? "Tool call failed" : "Tool call succeeded"}
      />
      <span className={`truncate font-mono ${failed ? "text-destructive" : "text-foreground"}`}>{name}</span>
      {summary ? (
        <span className={`min-w-0 truncate ${failed ? "text-destructive/90" : "text-muted-foreground"}`} title={summary}>
          {summary}
        </span>
      ) : null}
      {duration ? (
        <span className="ml-auto flex-none font-mono text-micro text-muted-foreground/70 tabular-nums">{duration}</span>
      ) : null}
    </div>
  );
}
