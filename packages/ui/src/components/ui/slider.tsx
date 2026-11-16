import * as SliderPrimitive from "@radix-ui/react-slider";
import type * as React from "react";

import { cn } from "../../lib/utils";

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Accessible name per thumb, e.g. `["Minimum", "Maximum"]` for a range. */
  thumbLabels?: readonly string[];
}

/**
 * One thumb per value: pass two values for a range. Vertical with
 * `orientation="vertical"`. The rail is the neutral accessible stroke and
 * the filled part is the brand color; disabled uses the disabled slots.
 * Each 16px thumb has a 44px touch target.
 */
function Slider({ className, thumbLabels, ...props }: SliderProps) {
  const thumbs = Math.max(1, (props.value ?? props.defaultValue ?? []).length);
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex touch-none select-none items-center data-[disabled]:cursor-not-allowed",
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-32 data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-input-bottom data-[disabled]:bg-disabled-border data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary data-[disabled]:bg-disabled-foreground data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, index) => (
        <SliderPrimitive.Thumb
          // Thumbs are positional; Radix keys them by index too.
          key={index}
          aria-label={thumbLabels?.[index]}
          data-slot="slider-thumb"
          className={cn(
            "relative block size-4 rounded-full border-2 border-primary bg-surface outline-none transition-colors duration-(--motion-fast) ease-standard",
            "after:absolute after:-inset-3.5 after:rounded-full after:content-['']",
            "hover:border-primary-hover active:border-primary-pressed mol-focus",
            "data-[disabled]:border-disabled-foreground data-[disabled]:bg-disabled-background",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider, type SliderProps };
