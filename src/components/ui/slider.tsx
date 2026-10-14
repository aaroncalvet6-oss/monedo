"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The accessible name and value text belong to the thumb (role="slider"), not to the root:
 * aria-label, aria-labelledby and aria-valuetext are forwarded there.
 */
export function Slider({
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-valuetext": ariaValueText,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = (props.value ?? props.defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center py-2 select-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border-strong">
        <SliderPrimitive.Range className="absolute h-full bg-brand" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={ariaValueText}
          className={cn(
            "touch-hit block size-5 cursor-grab rounded-full border-2 border-brand bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.15)]",
            "transition-transform duration-(--duration-fast) hover:scale-110 active:cursor-grabbing",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            "data-disabled:cursor-not-allowed",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
