"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "../../lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    data-slot="switch"
    className={cn(
      "mol-focus peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border border-input-bottom transition-colors duration-(--motion-fast) ease-standard outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-transparent",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block size-3.5 rounded-full bg-input-bottom ring-0 transition-transform duration-(--motion-fast) ease-standard data-[state=checked]:translate-x-6 data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0.5",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
