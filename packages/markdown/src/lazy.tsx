import { type JSX, lazy, Suspense } from "react";

import type { MarkdownContentProps } from "./markdown";

let pending: Promise<typeof import("./markdown")> | undefined;

const load = (): Promise<typeof import("./markdown")> => {
  pending ??= import("./markdown");
  return pending;
};

const MarkdownContentImpl = lazy(() => load().then((mod) => ({ default: mod.MarkdownContent })));

/** Start loading KaTeX and remark before the first paint of a markdown body. */
export const prefetchMarkdown = (): void => {
  void load();
};

const Fallback = ({ text }: { text: string }): JSX.Element => (
  <p className="whitespace-pre-wrap text-body-lg leading-relaxed text-foreground [overflow-wrap:anywhere]">
    {text}
  </p>
);

/**
 * Same body as {@link MarkdownContent}, but the KaTeX/remark stack loads on
 * first use. Until that chunk arrives, the source text is shown.
 */
export const MarkdownContent = ({ text, ...rest }: MarkdownContentProps): JSX.Element => (
  <Suspense fallback={<Fallback text={text} />}>
    <MarkdownContentImpl text={text} {...rest} />
  </Suspense>
);

export type { MarkdownContentProps };
