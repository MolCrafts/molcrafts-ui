/**
 * Scrollable kernel log. The host owns the lines; xterm, when used, is
 * rendered by the host beside this pane rather than inside the design system.
 */

import type { JSX } from "react";

import { cn } from "../../lib/utils";
import { EmptyState } from "../ui/empty-state";

export interface ConsoleLine {
  id: string;
  stream: "stdout" | "stderr" | "info";
  text: string;
}

export interface ConsolePaneProps {
  lines: readonly ConsoleLine[];
  label?: string;
  className?: string;
}

const STREAM = {
  stdout: "text-foreground",
  stderr: "text-destructive",
  info: "text-muted-foreground",
} as const;

export function ConsolePane({ lines, label = "Console", className }: ConsolePaneProps): JSX.Element {
  return (
    <section data-slot="console-pane" aria-label={label} className={cn("flex h-full min-h-0 flex-col bg-surface", className)}>
      {lines.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState title="No output yet" density="compact" />
        </div>
      ) : (
        <div role="log" aria-live="polite" className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-body">
          {lines.map((line) => (
            <pre key={line.id} className={cn("whitespace-pre-wrap break-words", STREAM[line.stream])}>
              {line.text}
            </pre>
          ))}
        </div>
      )}
    </section>
  );
}
