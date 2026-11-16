/**
 * Code cells. The editor and the output are slots: Monaco and MIME rendering
 * stay in the product. This block owns the cell chrome and the run controls.
 */

import { AddRegular, DeleteRegular, PlayRegular, StopRegular } from "@fluentui/react-icons";
import type { JSX, ReactNode } from "react";

import { cn } from "../../lib/utils";
import { StatusMark, type Status } from "../ui/status-mark";
import { ToolButton } from "../ui/tool-button";

export type NotebookCellPhase = "idle" | "running" | "ok" | "error";

export interface NotebookCellModel {
  id: string;
  execCount: number | null;
  phase: NotebookCellPhase;
}

export interface NotebookProps {
  cells: readonly NotebookCellModel[];
  /** Disables run controls while a cell is executing. */
  busy?: boolean;
  onRunAll?: () => void;
  onStop?: () => void;
  onRunCell?: (cellId: string) => void;
  onInsertBelow?: (cellId: string) => void;
  onDeleteCell?: (cellId: string) => void;
  renderEditor: (cell: NotebookCellModel) => ReactNode;
  renderOutput: (cell: NotebookCellModel) => ReactNode;
  className?: string;
}

const CELL_PHASE: Record<NotebookCellPhase, { status: Status; label: string }> = {
  idle: { status: "draft", label: "Not run" },
  running: { status: "running", label: "Running" },
  ok: { status: "completed", label: "Completed" },
  error: { status: "failed", label: "Failed" },
};

export function Notebook({
  cells,
  busy = false,
  onRunAll,
  onStop,
  onRunCell,
  onInsertBelow,
  onDeleteCell,
  renderEditor,
  renderOutput,
  className,
}: NotebookProps): JSX.Element {
  return (
    <div data-slot="notebook" className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
      <div className="flex h-toolbar shrink-0 items-center gap-1 border-b border-border px-2">
        <ToolButton label="Run all cells" disabled={busy || cells.length === 0} onClick={onRunAll}>
          <PlayRegular />
        </ToolButton>
        <ToolButton label="Stop" disabled={!busy} onClick={onStop}>
          <StopRegular />
        </ToolButton>
      </div>
      <ol className="min-h-0 flex-1 overflow-auto">
        {cells.map((cell) => {
          const phase = CELL_PHASE[cell.phase];
          return (
            <li key={cell.id} className="border-b border-border">
              <div className="flex h-toolbar items-center gap-2 px-2">
                <span className="w-8 shrink-0 text-right font-mono text-label tabular-nums text-muted-foreground">
                  {cell.execCount === null ? "" : `[${cell.execCount}]`}
                </span>
                <StatusMark status={phase.status} />
                <span className="text-label text-muted-foreground">{phase.label}</span>
                <span className="flex-1" />
                <ToolButton label="Run cell" disabled={busy} onClick={() => onRunCell?.(cell.id)}>
                  <PlayRegular />
                </ToolButton>
                <ToolButton label="Insert cell below" disabled={busy} onClick={() => onInsertBelow?.(cell.id)}>
                  <AddRegular />
                </ToolButton>
                <ToolButton label="Delete cell" disabled={busy || cells.length < 2} onClick={() => onDeleteCell?.(cell.id)}>
                  <DeleteRegular />
                </ToolButton>
              </div>
              <div className="px-3 pb-2">{renderEditor(cell)}</div>
              <div className="px-3 pb-4">{renderOutput(cell)}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
