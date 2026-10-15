/**
 * Editable workflow canvas.
 *
 * The free-layout editor owns drag, ports, edges, zoom, and undo.
 * The product draws the node body with `renderNode` and names each edge's
 * status class with `edgeClassName`.
 */

import {
  EditorRenderer,
  FreeLayoutEditorProvider,
  type FreeLayoutProps,
  useAutoLayout,
  useClientContext,
  usePlaygroundTools,
  type WorkflowNodeProps,
  WorkflowNodeRenderer,
} from "@flowgram.ai/free-layout-editor";
import "@flowgram.ai/free-layout-editor/index.css";
import { type JSX, type MutableRefObject, type ReactNode, useEffect, useMemo, useRef } from "react";

export interface WorkflowCanvasNode {
  id: string;
  type: string;
  meta: { position: { x: number; y: number } };
  data?: Record<string, unknown>;
}

export interface WorkflowCanvasEdge {
  sourceNodeID: string;
  targetNodeID: string;
  kind?: string;
  status?: string;
  data?: { status?: string; kind?: string };
}

export interface WorkflowCanvasDocument {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
}

export interface WorkflowLineColors {
  hidden: string;
  default: string;
  drawing: string;
  hovered: string;
  selected: string;
  error: string;
  flowing: string;
}

export interface WorkflowCanvasProps {
  document: WorkflowCanvasDocument;
  editable?: boolean;
  /** Fires after the mount-time layout, for a real edit. */
  onChange?: (document: WorkflowCanvasDocument) => void;
  renderNode: () => ReactNode;
  /** CSS class for one edge. Default `workflow-edge-<status>`. */
  edgeClassName?: (edge: { sourceId?: string; targetId?: string }) => string;
  /** True when the edge should animate. Default: status class ends with `-running`. */
  isFlowingLine?: (edge: { sourceId?: string; targetId?: string }) => boolean;
  lineColors?: WorkflowLineColors;
  className?: string;
}

const DEFAULT_LINE_COLORS: WorkflowLineColors = {
  hidden: "transparent",
  default: "var(--muted-foreground)",
  drawing: "var(--accent)",
  hovered: "var(--accent)",
  selected: "var(--accent)",
  error: "var(--status-failed)",
  flowing: "var(--status-running)",
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function endpoints(line: {
  from?: { id?: string };
  to?: { id?: string };
  info?: { from?: string; to?: string };
}): { sourceId?: string; targetId?: string } {
  return {
    sourceId: line.from?.id ?? line.info?.from,
    targetId: line.to?.id ?? line.info?.to,
  };
}

const AutoLayoutOnMount = ({ settledRef }: { settledRef: MutableRefObject<boolean> }): null => {
  const autoLayout = useAutoLayout();
  const autoLayoutRef = useRef(autoLayout);
  autoLayoutRef.current = autoLayout;
  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    let active = true;
    const run = async () => {
      try {
        await autoLayoutRef.current();
      } catch (err) {
        console.error("[workflow auto-layout]", err);
      }
    };
    const raf = requestAnimationFrame(() => {
      if (active) void run();
    });
    const retry = setTimeout(() => {
      if (active) {
        void run().finally(() => {
          settledRef.current = true;
        });
      }
    }, 250);
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      clearTimeout(retry);
    };
  }, [settledRef]);
  return null;
};

function CanvasButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-7 items-center justify-center rounded-control text-muted-foreground hover:bg-interactive hover:text-foreground"
    >
      {children}
    </button>
  );
}

const CanvasControls = ({ editable }: { editable: boolean }): JSX.Element => {
  const tools = usePlaygroundTools();
  const ctx = useClientContext();
  const easing = !prefersReducedMotion();
  const zoomPct = Math.round((tools.zoom ?? 1) * 100);
  return (
    <div className="absolute right-3 bottom-3 z-10 flex items-center gap-1 rounded-control border border-border bg-surface p-1">
      {editable ? (
        <>
          <CanvasButton label="Undo" onClick={() => ctx.history.undo()}>
            <UndoIcon />
          </CanvasButton>
          <CanvasButton label="Redo" onClick={() => ctx.history.redo()}>
            <RedoIcon />
          </CanvasButton>
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
        </>
      ) : null}
      <CanvasButton label="Zoom out" onClick={() => tools.zoomout(easing)}>
        <MinusIcon />
      </CanvasButton>
      <span aria-live="polite" className="min-w-[3.5ch] text-center text-micro text-muted-foreground tabular-nums">
        {zoomPct}%
      </span>
      <CanvasButton label="Zoom in" onClick={() => tools.zoomin(easing)}>
        <PlusIcon />
      </CanvasButton>
      <CanvasButton label="Fit to view" onClick={() => tools.fitView(easing)}>
        <FitIcon />
      </CanvasButton>
    </div>
  );
};

export function WorkflowCanvas({
  document,
  editable = false,
  onChange,
  renderNode,
  edgeClassName,
  isFlowingLine,
  lineColors = DEFAULT_LINE_COLORS,
  className,
}: WorkflowCanvasProps): JSX.Element {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const renderNodeRef = useRef(renderNode);
  renderNodeRef.current = renderNode;
  const edgeClassNameRef = useRef(edgeClassName);
  edgeClassNameRef.current = edgeClassName;
  const isFlowingRef = useRef(isFlowingLine);
  isFlowingRef.current = isFlowingLine;
  const settledRef = useRef(false);

  const editorProps = useMemo<FreeLayoutProps>(() => {
    const edgeClass = (line: Parameters<typeof endpoints>[0]): string => {
      const edge = endpoints(line);
      return edgeClassNameRef.current?.(edge) ?? "workflow-edge-pending";
    };
    return {
      background: true,
      readonly: !editable,
      initialData: document,
      nodeRegistries: [],
      lineColor: lineColors,
      isFlowingLine: (_ctx, line) => {
        const edge = endpoints(line);
        if (isFlowingRef.current) return isFlowingRef.current(edge);
        return edgeClass(line).endsWith("-running");
      },
      setLineClassName: (_ctx, line) => edgeClass(line),
      getNodeDefaultRegistry(type) {
        return { type, meta: {} };
      },
      materials: {
        renderDefaultNode: (props: WorkflowNodeProps) => {
          // A disposed render datum can ask for a body with no node entity.
          // WorkflowNodeRenderer then calls useNodeRender() and crashes on
          // `undefined.getData`.
          if (!props.node) return null;
          return (
            <WorkflowNodeRenderer node={props.node}>
              {renderNodeRef.current()}
            </WorkflowNodeRenderer>
          );
        },
      },
      ...(editable
        ? {
            nodeEngine: { enable: true },
            history: { enable: true },
            onContentChange(ctx) {
              if (!settledRef.current) return;
              onChangeRef.current?.(ctx.document.toJSON() as unknown as WorkflowCanvasDocument);
            },
          }
        : {}),
      onAllLayersRendered(ctx) {
        try {
          const nodes = ctx.document.getAllNodes().filter((node) => node != null);
          if (nodes.length === 0) return;
          ctx.document.fitView(false);
        } catch (err) {
          console.error("[workflow fit]", err);
        }
      },
    };
  }, [document, editable, lineColors]);

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      <FreeLayoutEditorProvider {...editorProps}>
        <EditorRenderer />
        <AutoLayoutOnMount settledRef={settledRef} />
        <CanvasControls editable={editable} />
      </FreeLayoutEditorProvider>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function UndoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M6 4 2.5 7.5 6 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7.5h6.5a3 3 0 0 1 0 6H8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M10 4l3.5 3.5L10 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 7.5H6.5a3 3 0 0 0 0 6H8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function FitIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
