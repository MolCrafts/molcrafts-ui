import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
export interface NativeSelectProps extends ComponentPropsWithoutRef<"select"> {
  sizeVariant?: "default" | "compact";
}
/** Native mobile picker, type-ahead and form behavior with owned Fluent styling. */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect({ className, sizeVariant = "default", ...props }, ref) {
  return <select {...props} ref={ref} className={cn("mol-focus min-w-0 rounded-control border border-input border-b-input-bottom bg-card px-2 text-body text-foreground hover:border-input-hover disabled:border-disabled-border disabled:bg-disabled-background disabled:text-disabled-foreground disabled:cursor-not-allowed aria-invalid:border-destructive", sizeVariant === "compact" ? "h-control-compact text-label" : "h-control", className)} />;
});
