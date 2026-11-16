import type * as React from "react";
import { cn } from "../../lib/utils";

/** A flat list of navigation targets. Put it inside a labelled `<nav>`. */
function NavList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="nav-list" className={cn("flex flex-col gap-1", className)} {...props} />;
}

export interface NavListItemProps extends Omit<React.ComponentProps<"button">, "type"> {
  /** The item the surrounding view currently shows. Sets aria-current. */
  current?: boolean;
}

/** One target. A 44px touch target with body-large text; long labels truncate. */
function NavListItem({ current = false, className, children, ...props }: NavListItemProps) {
  return (
    <li data-slot="nav-list-item">
      <button
        type="button"
        aria-current={current ? "page" : undefined}
        className={cn(
          "mol-focus min-h-touch-target w-full truncate rounded-control px-3 py-2 text-left text-body-lg transition-colors duration-(--motion-fast) ease-standard",
          current
            ? "bg-primary-muted font-semibold text-primary-muted-foreground"
            : "text-foreground hover:bg-interactive active:bg-interactive-pressed",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </li>
  );
}

export { NavList, NavListItem };
