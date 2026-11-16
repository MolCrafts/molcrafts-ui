/**
 * Workbench shell: header, navigator, work surface, and a collapsible dock.
 *
 * Domain-free block. Region sizes and resize behavior live here, so no product
 * surface invents its own page layout. Regions are panels separated by a 1px
 * border and a surface step, never floating cards. Products own the content of
 * every region, the region names, and the storage key for persisted sizes.
 */

import { createContext, type JSX, type ReactNode, useContext, useMemo, useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
import { cn } from "../../lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Separator } from "../ui/separator";

export interface WorkbenchDock {
  collapsed: boolean;
  toggle: () => void;
}

const DockContext = createContext<WorkbenchDock>({ collapsed: false, toggle: () => {} });

/** Collapse state and toggle for whatever the product placed in the dock. */
export const useWorkbenchDock = (): WorkbenchDock => useContext(DockContext);

export interface WorkbenchRegionLabels {
  navigator: string;
  main: string;
  dock: string;
}

export interface WorkbenchShellProps {
  /** Usually a WorkbenchHeader. */
  header: ReactNode;
  navigator: ReactNode;
  children: ReactNode;
  /** Live operations, as tabs in one region. Omit it for a two-region shell. */
  dock?: ReactNode;
  /** Accessible names of the navigator, main, and dock landmarks. */
  labels: WorkbenchRegionLabels;
  /** Prefix for persisted sizes, such as `molci`. Namespace it per product. */
  storageKey: string;
  /** Height kept when the dock is collapsed: its own tab strip. Default 48. */
  dockCollapsedSize?: number;
}

const Region = ({ className, children }: { className?: string; children: ReactNode }): JSX.Element => (
  <div className={cn("flex h-full min-h-0 min-w-0 flex-col overflow-hidden", className)}>{children}</div>
);

export function WorkbenchShell({
  header,
  navigator,
  children,
  dock,
  labels,
  storageKey,
  dockCollapsedSize = 48,
}: WorkbenchShellProps): JSX.Element {
  const dockRef = useRef<PanelImperativeHandle | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const controls = useMemo<WorkbenchDock>(() => ({
    collapsed,
    toggle: () => {
      const panel = dockRef.current;
      if (!panel) return;
      if (panel.isCollapsed()) panel.expand();
      else panel.collapse();
    },
  }), [collapsed]);

  const columns = (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId={`${storageKey}.columns`}
      autoSavePanelIds={["navigator", "work"]}
      className="min-h-0"
    >
      <ResizablePanel id="navigator" defaultSize="256px" minSize="180px" maxSize="420px">
        <nav aria-label={labels.navigator} className="h-full">
          <Region className="border-r border-border bg-surface">{navigator}</Region>
        </nav>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="work" minSize="320px">
        <main aria-label={labels.main} className="h-full"><Region>{children}</Region></main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <div data-slot="workbench-shell" className="flex h-dvh min-h-0 flex-col bg-background text-foreground">
      {header}
      {dock === undefined ? (
        <div className="min-h-0 flex-1">{columns}</div>
      ) : (
        <ResizablePanelGroup
          direction="vertical"
          autoSaveId={`${storageKey}.shell`}
          autoSavePanelIds={["upper", "dock"]}
          className="min-h-0 flex-1"
        >
          <ResizablePanel id="upper" minSize="200px">{columns}</ResizablePanel>
          <ResizableHandle />
          {/* Opens collapsed: logs and problems are looked for, not greeted by. A drag or the toggle is remembered. */}
          <ResizablePanel
            id="dock"
            panelRef={dockRef}
            defaultSize={`${dockCollapsedSize}px`}
            minSize="140px"
            maxSize="70%"
            collapsible
            collapsedSize={`${dockCollapsedSize}px`}
            onResize={size => setCollapsed(size.inPixels <= dockCollapsedSize + 1)}
          >
            <DockContext.Provider value={controls}>
              <section aria-label={labels.dock} className="h-full">
                <Region className="border-t border-border bg-surface">{dock}</Region>
              </section>
            </DockContext.Provider>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}

export interface WorkbenchHeaderProps {
  /** The product name. Rendered as the document's only h1. */
  title: ReactNode;
  /** Location, from broad to narrow. The last item is the current one. */
  breadcrumb?: ReactNode[];
  /** The current surface's verbs, right-aligned. */
  actions?: ReactNode;
  className?: string;
}

/** Identity once, then the breadcrumb, then the verbs. Nothing else. */
export function WorkbenchHeader({ title, breadcrumb = [], actions, className }: WorkbenchHeaderProps): JSX.Element {
  return (
    <header data-slot="workbench-header" className={cn("flex h-toolbar shrink-0 items-center gap-3 border-b border-border bg-surface px-4", className)}>
      <h1 className="shrink-0 text-title font-semibold">{title}</h1>
      {breadcrumb.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-5" />
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-2 text-body">
              {breadcrumb.map((item, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <li key={i} className="flex min-w-0 items-center gap-2">
                    {i > 0 && <span aria-hidden="true" className="text-subtle-foreground">/</span>}
                    <span aria-current={last ? "page" : undefined} className={cn("truncate", last ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </>
      )}
      <span className="flex-1" />
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
