/**
 * Inspector section: a collapsible group in a narrow side panel.
 *
 * Domain-free block. Accordion unmounts closed content and has no subtitle
 * or badge. This section can stay controlled, show a badge, and keep its
 * body mounted after the first open.
 */

import type { JSX, ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { ChevronDownRegular } from "@fluentui/react-icons";
import { cn } from "../../lib/utils";

export interface InspectorSectionProps {
  title: string;
  /** Free-form, so a caller can set an identifier in a code face. */
  subtitle?: ReactNode;
  badge?: string;
  /** Uncontrolled initial open state. Ignored when `open` is set. */
  defaultOpen?: boolean;
  /**
   * Controlled open state. When provided with `onOpenChange`, the section
   * becomes controlled — used by exclusive-accordion panels.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Keep children mounted after first open (collapse is visual only).
   * Use for panels that hold form state across accordion switches.
   * Closed content is `display: none` so it never peeks under the header.
   */
  keepMounted?: boolean;
  children: ReactNode;
  className?: string;
  /** Extra classes on the inner content wrapper (e.g. to make it flex-1). */
  contentClassName?: string;
}

export function InspectorSection({
  title,
  subtitle,
  badge,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  keepMounted = false,
  children,
  className,
  contentClassName,
}: InspectorSectionProps): JSX.Element {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [everOpened, setEverOpened] = useState(open);
  const contentId = useId();

  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  const setOpen = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
      onOpenChange?.(next);
    }
  };

  // keepMounted: stay in the DOM after the first open, hide with `hidden` when closed.
  // otherwise: only mount while open.
  const showBody = open || (keepMounted && everOpened);

  return (
    <section
      data-slot="inspector-section"
      className={cn(
        // Default stacked-list rule. A className replaces it, so a caller can
        // switch the section to card borders or a flex column.
        !className && "border-b border-border/70",
        open && contentClassName?.includes("flex-1") && "flex min-h-0 flex-col",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full shrink-0 items-center justify-between gap-2 px-2 py-2 text-left transition-colors duration-(--motion-fast) ease-standard hover:bg-interactive"
        onClick={() => setOpen(!open)}
      >
        <div className="min-w-0">
          <div className="text-micro font-semibold uppercase leading-none tracking-wide text-muted-foreground">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 truncate text-micro text-subtle-foreground">{subtitle}</div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {badge ? (
            <span className="rounded-control border border-border bg-muted px-2 py-0 text-micro font-medium text-muted-foreground">
              {badge}
            </span>
          ) : null}
          <ChevronDownRegular
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-(--motion-fast) ease-standard",
              !open && "-rotate-90",
            )}
          />
        </div>
      </button>

      {showBody ? (
        <div
          id={contentId}
          aria-hidden={!open}
          inert={open ? undefined : true}
          // `hidden` is the reliable collapse for keepMounted bodies. A
          // grid-template-rows transition still leaked custom elements
          // under the header.
          className={cn(
            "min-h-0 overflow-hidden",
            open ? contentClassName?.includes("flex-1") && "flex flex-1 flex-col" : "hidden",
          )}
        >
          <div
            className={cn(
              "min-h-0 min-w-0 space-y-2 overflow-hidden px-2 pb-2",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      ) : null}
    </section>
  );
}
