import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `wide` is the default editorial canvas; `narrow` for forms and reading. */
  size?: "wide" | "default" | "narrow" | "prose";
  as?: keyof JSX.IntrinsicElements;
}

const sizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  wide: "max-w-[1600px]",
  default: "max-w-[1280px]",
  narrow: "max-w-[960px]",
  prose: "max-w-[720px]",
};

export function Container({ size = "wide", as: Tag = "div", className, ...props }: ContainerProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12", sizes[size], className)}
      {...props}
    />
  );
}
