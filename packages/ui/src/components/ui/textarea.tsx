import type * as React from "react";

import { cn } from "../../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full field-sizing-content rounded-control border border-input border-b-input-bottom bg-surface hover:border-input-hover px-3 py-2 text-body outline-none transition-colors duration-(--motion-fast) ease-standard placeholder:text-muted-foreground mol-focus focus-visible:border-b-primary aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
