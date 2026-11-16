/**
 * Open documents in one or more panes.
 *
 * The product owns the document list and what each document renders. This
 * block owns the tab strips and the drag. A tab can be reordered, dropped
 * on another pane, or dropped on the trailing edge to open a new pane.
 * Arrow keys activate a neighbor. Ctrl+Shift+Arrow moves the active
 * document into the neighboring pane, or opens one when there is no
 * neighbor. The close control is compact because it sits in the tab strip.
 */

import { DismissRegular } from "@fluentui/react-icons";
import { type DragEvent, type JSX, type KeyboardEvent, type ReactNode, useState } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";

export type DocumentMove = { paneId: string; index: number } | { newPane: true };

export interface DocumentTab {
  id: string;
  title: string;
}

export interface DocumentPane {
  id: string;
  tabs: readonly DocumentTab[];
  activeId: string | null;
}

export interface DocumentDockProps {
  panes: readonly DocumentPane[];
  /** Accessible name of the dock. */
  label: string;
  onActivate: (paneId: string, documentId: string) => void;
  /**
   * `index` is the destination position after the document has left its
   * current pane. `{ newPane: true }` asks for a pane to the right.
   */
  onMove: (documentId: string, target: DocumentMove) => void;
  onClose: (documentId: string) => void;
  renderDocument: (documentId: string) => ReactNode;
  className?: string;
}

const DRAG_TYPE = "application/x-molcrafts-document";

export function DocumentDock({
  panes,
  label,
  onActivate,
  onMove,
  onClose,
  renderDocument,
  className,
}: DocumentDockProps): JSX.Element {
  const [dragging, setDragging] = useState(false);

  if (panes.length === 0) {
    return (
      <div className={cn("flex h-full min-h-0 items-center justify-center", className)}>
        <EmptyState title="No notebooks open" />
      </div>
    );
  }

  const paneView = (pane: DocumentPane, index: number) => (
    <Pane
      key={pane.id}
      pane={pane}
      paneIndex={index}
      panes={panes}
      dragging={dragging}
      onDragChange={setDragging}
      onActivate={onActivate}
      onMove={onMove}
      onClose={onClose}
      renderDocument={renderDocument}
    />
  );

  return (
    <div data-slot="document-dock" role="region" aria-label={label} className={cn("flex h-full min-h-0 min-w-0", className)}>
      {panes.length === 1 && panes[0] ? (
        paneView(panes[0], 0)
      ) : (
        <ResizablePanelGroup direction="horizontal" className="min-h-0 min-w-0">
          {panes.flatMap((pane, index) => {
            const panel = (
              <ResizablePanel key={pane.id} id={pane.id} minSize="240px" defaultSize={`${100 / panes.length}%`}>
                {paneView(pane, index)}
              </ResizablePanel>
            );
            return index === 0 ? [panel] : [<ResizableHandle key={`${pane.id}-handle`} />, panel];
          })}
        </ResizablePanelGroup>
      )}
    </div>
  );
}

function Pane({
  pane,
  paneIndex,
  panes,
  dragging,
  onDragChange,
  onActivate,
  onMove,
  onClose,
  renderDocument,
}: {
  pane: DocumentPane;
  paneIndex: number;
  panes: readonly DocumentPane[];
  dragging: boolean;
  onDragChange: (dragging: boolean) => void;
  onActivate: DocumentDockProps["onActivate"];
  onMove: DocumentDockProps["onMove"];
  onClose: DocumentDockProps["onClose"];
  renderDocument: DocumentDockProps["renderDocument"];
}): JSX.Element {
  const active = pane.tabs.find((tab) => tab.id === pane.activeId) ?? pane.tabs[0] ?? null;

  function dropOnStrip(event: DragEvent<HTMLDivElement>): void {
    const documentId = event.dataTransfer.getData(DRAG_TYPE);
    if (!documentId) return;
    event.preventDefault();
    onMove(documentId, { paneId: pane.id, index: dropIndex(event, pane.tabs.map((tab) => tab.id)) });
    onDragChange(false);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: DocumentTab): void {
    const ids = pane.tabs.map((item) => item.id);
    const index = ids.indexOf(tab.id);
    if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      const neighbor = panes[event.key === "ArrowRight" ? paneIndex + 1 : paneIndex - 1];
      if (neighbor) onMove(tab.id, { paneId: neighbor.id, index: neighbor.tabs.length });
      else if (event.key === "ArrowRight") onMove(tab.id, { newPane: true });
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = event.key === "ArrowRight" ? ids[(index + 1) % ids.length] : ids[(index - 1 + ids.length) % ids.length];
      if (next) {
        onActivate(pane.id, next);
        document.getElementById(`${pane.id}-tab-${next}`)?.focus();
      }
      return;
    }
    if (event.key === "Home" && ids[0]) {
      event.preventDefault();
      onActivate(pane.id, ids[0]);
    }
    if (event.key === "End" && ids.at(-1)) {
      event.preventDefault();
      onActivate(pane.id, ids.at(-1)!);
    }
  }

  return (
    <section aria-label={active ? active.title : "Empty pane"} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label="Open notebooks"
        className="flex h-toolbar shrink-0 items-center gap-1 border-b border-border bg-surface px-2"
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes(DRAG_TYPE)) event.preventDefault();
        }}
        onDrop={dropOnStrip}
      >
        {pane.tabs.map((tab) => {
          const selected = tab.id === active?.id;
          return (
            <div key={tab.id} className="flex h-control min-w-0 items-stretch" data-document-tab={tab.id}>
              <button
                type="button"
                role="tab"
                id={`${pane.id}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${pane.id}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                draggable
                title={tab.title}
                className={cn(
                  "flex min-w-0 items-center rounded-control px-3 font-mono text-body",
                  selected ? "bg-background font-semibold text-foreground" : "text-muted-foreground hover:bg-interactive hover:text-foreground",
                )}
                onClick={() => onActivate(pane.id, tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, tab)}
                onDragStart={(event) => {
                  event.dataTransfer.setData(DRAG_TYPE, tab.id);
                  event.dataTransfer.effectAllowed = "move";
                  onDragChange(true);
                }}
                onDragEnd={() => onDragChange(false)}
              >
                <span className="max-w-48 truncate">{tab.title}</span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Close ${tab.title}`}
                onClick={() => onClose(tab.id)}
              >
                <DismissRegular />
              </Button>
            </div>
          );
        })}
        {dragging ? (
          <div
            aria-hidden="true"
            className="ml-auto flex h-control w-24 shrink-0 items-center justify-center rounded-control border border-dashed border-border text-label text-muted-foreground"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const documentId = event.dataTransfer.getData(DRAG_TYPE);
              if (!documentId) return;
              event.preventDefault();
              event.stopPropagation();
              onMove(documentId, { newPane: true });
              onDragChange(false);
            }}
          >
            New pane
          </div>
        ) : null}
      </div>
      <div
        role="tabpanel"
        id={active ? `${pane.id}-panel-${active.id}` : undefined}
        aria-labelledby={active ? `${pane.id}-tab-${active.id}` : undefined}
        className="min-h-0 flex-1 overflow-auto bg-background"
      >
        {active ? (
          renderDocument(active.id)
        ) : (
          <div className="flex h-full items-center justify-center">
            <EmptyState title="No notebooks open" description="Create one from the file list, or drop a tab here." />
          </div>
        )}
      </div>
    </section>
  );
}

/** Index in this strip after the dragged tab is removed. The pointer's half decides the side. */
function dropIndex(event: DragEvent<HTMLElement>, ids: readonly string[]): number {
  const rows = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-document-tab]")];
  for (let index = 0; index < rows.length; index += 1) {
    const rect = rows[index].getBoundingClientRect();
    if (event.clientX < rect.left + rect.width / 2) return adjustForRemoval(ids, event.dataTransfer.getData(DRAG_TYPE), index);
  }
  return adjustForRemoval(ids, event.dataTransfer.getData(DRAG_TYPE), ids.length);
}

function adjustForRemoval(ids: readonly string[], documentId: string, index: number): number {
  const from = ids.indexOf(documentId);
  if (from === -1 || from >= index) return index;
  return index - 1;
}
