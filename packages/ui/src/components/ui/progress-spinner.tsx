/** Pure CSS progress indicator. Reduced motion keeps a static ring and its accessible name. */

import type { JSX } from "react";
import { cn } from "../../lib/utils";

export const ProgressSpinner = ({
  className,
  size = "sm",
  label = "Loading",
}: {
  className?: string;
  size?: "sm" | "md";
  /** Accessible name when the parent does not already label the busy state. */
  label?: string;
}): JSX.Element => (
  <span
    role="status"
    aria-label={label}
    className={cn(
      "mol-progress-spinner",
      size === "md" ? "mol-progress-spinner-md" : "mol-progress-spinner-sm",
      className,
    )}
  />
);
