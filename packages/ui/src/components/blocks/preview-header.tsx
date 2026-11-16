/**
 * The MolCrafts preview header and notice: the one bar MolPlot charts,
 * MolVis viewers and sketch boards show when a report frames them.
 *
 * Built from IconAction, Tooltip, Separator and DropdownMenu, so it is the
 * same control set as the products' own toolbars. Density is compact on
 * purpose: an embedded figure is the content, the bar is not.
 */

import {
  ArrowDownloadRegular,
  ArrowRedoRegular,
  ArrowUndoRegular,
  BroomRegular,
  CubeRegular,
  CubeRotateRegular,
  FullScreenMaximizeRegular,
  FullScreenMinimizeRegular,
  InfoRegular,
  MoleculeRegular,
  MoreHorizontalRegular,
  TableRegular,
  TargetRegular,
  WarningRegular,
  ZoomInRegular,
  ZoomOutRegular,
} from "@fluentui/react-icons";
import { Fragment, type JSX, type KeyboardEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  type PreviewAction,
  type PreviewGroup,
  type PreviewHeaderOptions,
  type PreviewIconName,
  type PreviewMenuAction,
  type PreviewState,
  previewActions,
} from "../../lib/preview";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconAction } from "../ui/icon-action";
import { ProgressSpinner } from "../ui/progress-spinner";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ICONS: Record<PreviewIconName, ReactNode> = {
  "reset-view": <TargetRegular />,
  "zoom-in": <ZoomInRegular />,
  "zoom-out": <ZoomOutRegular />,
  fullscreen: <FullScreenMaximizeRegular />,
  "exit-fullscreen": <FullScreenMinimizeRegular />,
  table: <TableRegular />,
  projection: <CubeRegular />,
  spin: <CubeRotateRegular />,
  style: <MoleculeRegular />,
  export: <ArrowDownloadRegular />,
  undo: <ArrowUndoRegular />,
  redo: <ArrowRedoRegular />,
  clear: <BroomRegular />,
};

/** inspect and export fold into More when the bar is too narrow. */
const COLLAPSIBLE: ReadonlySet<PreviewGroup> = new Set(["inspect", "export"]);
/** Room the identity keeps before actions fold: enough to read a title. */
const IDENTITY_MIN_PX = 260;

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || target.matches("input, textarea, select"));
}

function StateLine({ state }: { state: Exclude<PreviewState, { kind: "ready" }> }): JSX.Element {
  const message = state.kind === "loading" ? (state.message ?? "Loading…") : state.message;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        state.kind === "error" && "text-status-failed-foreground",
      )}
    >
      {state.kind === "loading" ? (
        <ProgressSpinner label={message} className="shrink-0" />
      ) : state.kind === "error" ? (
        <WarningRegular className="size-3.5 shrink-0" aria-hidden />
      ) : (
        <InfoRegular className="size-3.5 shrink-0" aria-hidden />
      )}
      <span className="truncate">{message}</span>
    </span>
  );
}

function MenuAction({ action }: { action: PreviewMenuAction }): JSX.Element {
  const radio = action.items.some((item) => item.checked !== undefined);
  const value = action.items.find((item) => item.checked)?.id ?? "";
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={action.label}
              disabled={action.disabled}
              data-preview-control={action.id}
              className="size-control-compact [&_svg]:size-4"
            >
              {ICONS[action.icon]}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">{action.label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{action.label}</DropdownMenuLabel>
        {radio ? (
          <DropdownMenuRadioGroup value={value}>
            {action.items.map((item) => (
              <DropdownMenuRadioItem key={item.id} value={item.id} onSelect={() => item.run()}>
                {item.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        ) : (
          action.items.map((item) => (
            <DropdownMenuItem key={item.id} onSelect={() => item.run()}>
              {item.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActionControl({ action }: { action: PreviewAction }): JSX.Element {
  if (action.kind === "menu") return <MenuAction action={action} />;
  const pressed = action.kind === "toggle" ? action.pressed : undefined;
  return (
    <IconAction
      icon={ICONS[action.icon]}
      label={action.label}
      shortcut={action.shortcut}
      selected={pressed}
      disabled={action.disabled}
      data-preview-control={action.id}
      onClick={() => (action.kind === "toggle" ? action.onToggle(!action.pressed) : action.run())}
    />
  );
}

/** inspect and export, flattened into one menu for a narrow bar. */
function MoreMenu({ actions }: { actions: readonly PreviewAction[] }): JSX.Element {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="More actions"
              data-preview-control="more"
              className="size-control-compact [&_svg]:size-4"
            >
              <MoreHorizontalRegular />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">More actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <Fragment key={action.id}>
            {index > 0 && actions[index - 1]?.group !== action.group && <DropdownMenuSeparator />}
            {action.kind === "toggle" ? (
              <DropdownMenuCheckboxItem
                checked={action.pressed}
                disabled={action.disabled}
                onCheckedChange={(next) => action.onToggle(next === true)}
              >
                {action.label}
              </DropdownMenuCheckboxItem>
            ) : action.kind === "menu" ? (
              action.items.map((item) => (
                <DropdownMenuItem key={item.id} disabled={action.disabled} onSelect={() => item.run()}>
                  {action.label}: {item.label}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled={action.disabled} onSelect={() => action.run()}>
                {action.label}
              </DropdownMenuItem>
            )}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type PreviewHeaderProps = PreviewHeaderOptions & { className?: string };

/**
 * Product mark, what the figure shows, one reading or the current state,
 * then grouped icon actions. Read-only drops every action marked `mutates`.
 * The toolbar is one tab stop; arrow keys, Home and End move within it.
 */
export function PreviewHeader({ mode, product, title, meta, state = { kind: "ready" }, actions, className }: PreviewHeaderProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fullWidth = useRef(0);
  const [compact, setCompact] = useState(false);
  const visible = previewActions(mode, actions);
  const inline = compact ? visible.filter((action) => !COLLAPSIBLE.has(action.group)) : visible;
  const folded = compact ? visible.filter((action) => COLLAPSIBLE.has(action.group)) : [];

  // Fold when the actions would crowd the identity; measure while unfolded.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const toolbar = toolbarRef.current;
    if (!root || !toolbar) return;
    const measure = () => {
      if (!compact) fullWidth.current = toolbar.scrollWidth;
      const next = root.clientWidth > 0 && root.clientWidth < fullWidth.current + IDENTITY_MIN_PX;
      if (next !== compact) setCompact(next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  });

  // One tab stop for the toolbar.
  useEffect(() => {
    const controls = Array.from(toolbarRef.current?.querySelectorAll<HTMLElement>("[data-preview-control]") ?? []);
    const active = controls.find((control) => control.tabIndex === 0 && controls.indexOf(control) >= 0) ?? controls[0];
    for (const control of controls) control.tabIndex = control === active ? 0 : -1;
  });

  // One-key shortcuts while focus is not in a text field.
  useEffect(() => {
    const doc = rootRef.current?.ownerDocument;
    if (!doc) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      const action = visible.find((item) => item.shortcut?.toLowerCase() === event.key.toLowerCase());
      if (!action || action.disabled || action.kind === "menu") return;
      if (action.kind === "toggle") action.onToggle(!action.pressed);
      else action.run();
      event.preventDefault();
    };
    doc.addEventListener("keydown", onKey);
    return () => doc.removeEventListener("keydown", onKey);
  });

  const onToolbarKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-preview-control]"));
    const index = controls.indexOf(event.target as HTMLElement);
    if (index < 0) return;
    const next =
      event.key === "ArrowRight" ? controls[(index + 1) % controls.length]
      : event.key === "ArrowLeft" ? controls[(index - 1 + controls.length) % controls.length]
      : event.key === "Home" ? controls[0]
      : event.key === "End" ? controls[controls.length - 1]
      : undefined;
    if (!next) return;
    event.preventDefault();
    for (const control of controls) control.tabIndex = control === next ? 0 : -1;
    next.focus();
  };

  const groups: PreviewAction[][] = [];
  for (const action of inline) {
    const last = groups[groups.length - 1];
    if (last && last[0]?.group === action.group) last.push(action);
    else groups.push([action]);
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={[product, title].filter(Boolean).join(": ")}
      data-mode={mode}
      data-compact={compact ? "" : undefined}
      className={cn(
        "flex h-toolbar-compact shrink-0 items-center justify-between gap-3 border-b border-border bg-background pr-1.5 pl-3 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline gap-2 overflow-hidden whitespace-nowrap">
        <span className="shrink-0 text-label font-semibold text-muted-foreground">{product}</span>
        {title && (
          <span className="min-w-0 truncate text-body font-semibold" title={title}>
            {title}
          </span>
        )}
        {/* A reading stays whole and the title truncates; a state message truncates itself. */}
        <span
          className={cn(
            "text-label text-muted-foreground tabular-nums",
            state.kind === "ready" ? "shrink-0" : "min-w-0",
            // A folded bar keeps the title; the reading returns when there is room.
            compact && state.kind === "ready" && "hidden",
          )}
          aria-live="polite"
        >
          {state.kind === "ready" ? meta : <StateLine state={state} />}
        </span>
      </div>
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label={`${title ?? product} actions`}
        onKeyDown={onToolbarKey}
        className="flex shrink-0 items-center gap-0.5"
      >
        {groups.map((group, index) => (
          <div key={group[0]?.group} className="flex items-center gap-0.5" data-group={group[0]?.group}>
            {index > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}
            {group.map((action) => (
              <ActionControl key={action.id} action={action} />
            ))}
          </div>
        ))}
        {folded.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <MoreMenu actions={folded} />
          </>
        )}
      </div>
    </div>
  );
}

/** The same state, centered over the canvas while there is nothing to look at. */
export function PreviewNotice({ state, className }: { state: PreviewState; className?: string }): JSX.Element | null {
  if (state.kind === "ready") return null;
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 grid place-items-center bg-surface p-6 text-center font-sans text-body text-muted-foreground",
        className,
      )}
    >
      <div className="max-w-dialog-md">
        <StateLine state={state} />
      </div>
    </div>
  );
}
