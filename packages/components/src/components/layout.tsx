import * as React from "react"

import { cn } from "@repo/ui/lib/utils"

/*
 * Layout primitives: Container, Row, Column, Grid, Expanded, Spacer.
 *
 * Why the lookup tables below instead of `gap-${gap}`?
 * Tailwind only generates CSS for class names it can find written out in full
 * in your source files. A class built at runtime ("gap-" + 3) never appears in
 * the source, so it silently gets no styles. Every value is spelled out here.
 *
 * Every component still takes `className`, and `cn` (tailwind-merge) lets it
 * win over the props, so responsive tweaks like `sm:flex-nowrap` go there.
 *
 * No hooks, so these work in Server Components too.
 */

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** Which HTML element to render, so layout doesn't cost you semantics. */
type As =
  | "div"
  | "section"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "aside"
  | "article"
  | "form"
  | "ul"
  | "ol"
  | "li"
  | "span"

type LayoutProps = React.HTMLAttributes<HTMLElement> & {
  as?: As
  ref?: React.Ref<HTMLElement>
}

const GAP = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
} as const

/** Tailwind spacing steps (1 = 0.25rem = 4px). */
export type Gap = keyof typeof GAP

/* ------------------------------------------------------------------ */
/* Flex: Row and Column are presets of this                            */
/* ------------------------------------------------------------------ */

const DIRECTION = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
} as const

/** Cross axis (Flutter's crossAxisAlignment). */
const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const

/** Main axis (Flutter's mainAxisAlignment). */
const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const

export type FlexProps = LayoutProps & {
  direction?: keyof typeof DIRECTION
  gap?: Gap
  align?: keyof typeof ALIGN
  justify?: keyof typeof JUSTIFY
  /** Let children flow onto new lines instead of squeezing. */
  wrap?: boolean
}

export function Flex({
  as = "div",
  direction = "row",
  gap,
  align,
  justify,
  wrap,
  className,
  ...props
}: FlexProps) {
  const Comp = as as React.ElementType
  return (
    <Comp
      data-slot="flex"
      className={cn(
        "flex",
        DIRECTION[direction],
        gap !== undefined && GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  )
}

/**
 * Children side by side. Like Flutter, children are vertically centred by
 * default (`align="center"`); pass `align="start"` or `"stretch"` to change it.
 */
export function Row({ align = "center", ...props }: Omit<FlexProps, "direction">) {
  return <Flex data-slot="row" direction="row" align={align} {...props} />
}

/**
 * Children stacked top to bottom. Unlike Flutter, children stretch to full
 * width by default (the web's norm); pass `align="center"` to centre them.
 */
export function Column(props: Omit<FlexProps, "direction">) {
  return <Flex data-slot="column" direction="column" {...props} />
}

/**
 * Fills the leftover space in a Row/Column, like Flutter's Expanded.
 * `min-w-0` lets it shrink below its content's width, which is what makes
 * `truncate` work inside a Row (the web's version of a RenderFlex overflow).
 */
export function Expanded({ as = "div", className, ...props }: LayoutProps) {
  const Comp = as as React.ElementType
  return <Comp data-slot="expanded" className={cn("min-h-0 min-w-0 flex-1", className)} {...props} />
}

/** Empty flexible space that pushes siblings apart, like Flutter's Spacer. */
export function Spacer({ className }: { className?: string }) {
  return <div data-slot="spacer" aria-hidden="true" className={cn("flex-1", className)} />
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

const COLS = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6" },
} as const

type Breakpoint = keyof typeof COLS
type ColCount = keyof (typeof COLS)["base"]

export type GridProps = LayoutProps & {
  /** A fixed count (`cols={3}`) or per breakpoint (`cols={{ sm: 2, lg: 3 }}`).
   *  Anything below the smallest breakpoint you list gets 1 column. */
  cols?: ColCount | Partial<Record<Breakpoint, ColCount>>
  /** Instead of `cols`: fit as many columns as possible, each at least this
   *  wide (e.g. "240px"). Responsive with no breakpoints, like Flutter's
   *  SliverGridDelegateWithMaxCrossAxisExtent. */
  minItemWidth?: string
  gap?: Gap
}

function colClasses(cols: GridProps["cols"]) {
  if (cols === undefined) return COLS.base[1]
  if (typeof cols === "number") return COLS.base[cols]
  return [
    cols.base === undefined && COLS.base[1],
    ...(Object.keys(cols) as Breakpoint[]).map((bp) => {
      const n = cols[bp]
      return n !== undefined && COLS[bp][n]
    }),
  ]
}

export function Grid({
  as = "div",
  cols,
  minItemWidth,
  gap,
  className,
  style,
  ...props
}: GridProps) {
  const Comp = as as React.ElementType
  return (
    <Comp
      data-slot="grid"
      className={cn(
        "grid",
        // The class is static; the width arrives through a CSS variable,
        // which is the Tailwind-safe way to use a value chosen at runtime.
        // min(..., 100%) stops a single item overflowing very narrow screens.
        minItemWidth
          ? "grid-cols-[repeat(auto-fill,minmax(min(var(--grid-min-item),100%),1fr))]"
          : colClasses(cols),
        gap !== undefined && GAP[gap],
        className
      )}
      style={
        minItemWidth
          ? ({ "--grid-min-item": minItemWidth, ...style } as React.CSSProperties)
          : style
      }
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Container                                                           */
/* ------------------------------------------------------------------ */

const MAX_WIDTH = {
  sm: "max-w-3xl", // 768px
  md: "max-w-5xl", // 1024px
  lg: "max-w-6xl", // 1152px
  xl: "max-w-7xl", // 1280px
  full: "max-w-none",
} as const

export type ContainerProps = LayoutProps & {
  /** Max content width. Defaults to "lg" (max-w-6xl). */
  size?: keyof typeof MAX_WIDTH
}

/** Centred page-width wrapper with responsive side padding. */
export function Container({ as = "div", size = "lg", className, ...props }: ContainerProps) {
  const Comp = as as React.ElementType
  return (
    <Comp
      data-slot="container"
      className={cn("mx-auto w-full px-4 sm:px-6", MAX_WIDTH[size], className)}
      {...props}
    />
  )
}
