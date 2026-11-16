import "katex/dist/katex.min.css";
import type { JSX, ReactNode } from "react";
import ReactMarkdown, { type Components, defaultUrlTransform } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "./cn";
import { prepareMarkdownMath } from "./markdown-math";

/**
 * Token-styled markdown body for product prose (answers, notes, summaries).
 *
 * Math goes through remark-math and KaTeX. `prepareMarkdownMath` rewrites
 * LaTeX delimiters (`\(...\)` / `\[...\]`) and whole-line `$$…$$` into the
 * fences remark-math treats as display math. KaTeX runs with `strict: "ignore"`
 * so Unicode inside formulas (σ, ε, Å) still renders.
 *
 * Pass `components` to replace the default link or image renderer. Pass
 * `urlTransform` to keep a product scheme (it runs before the default
 * sanitizer, and a returned string is used as-is).
 */

const MARKDOWN_CLASS = [
  "text-body-lg leading-relaxed text-foreground [overflow-wrap:anywhere]",
  "[&_p]:my-2 [&_>*:first-child]:mt-0 [&_>*:last-child]:mb-0",
  "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold",
  "[&_h2]:mt-4 [&_h2]:mb-1 [&_h2]:text-body-lg [&_h2]:font-semibold",
  "[&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-body-lg [&_h3]:font-semibold",
  "[&_h4]:mt-3 [&_h4]:mb-1 [&_h4]:text-body-lg [&_h4]:font-medium",
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-1 [&_li_>_ul]:my-1 [&_li_>_ol]:my-1",
  "[&_:not(pre)>code]:rounded-control [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1",
  "[&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-label",
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-control [&_pre]:border",
  "[&_pre]:border-border/60 [&_pre]:bg-muted/50 [&_pre]:px-3 [&_pre]:py-3",
  "[&_pre]:font-mono [&_pre]:text-label [&_pre]:leading-relaxed",
  "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80",
  "[&_blockquote]:my-2 [&_blockquote]:border-l [&_blockquote]:border-border",
  "[&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
  "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_table]:text-label",
  "[&_th]:border [&_th]:border-border/60 [&_th]:bg-muted/40 [&_th]:px-2 [&_th]:py-1",
  "[&_th]:text-left [&_th]:font-medium",
  "[&_td]:border [&_td]:border-border/60 [&_td]:px-2 [&_td]:py-1 [&_td]:tabular-nums",
  "[&_hr]:my-3 [&_hr]:border-border [&_strong]:font-semibold",
  "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-control [&_img]:border [&_img]:border-border/60",
  "[&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden",
  "[&_.katex-display]:py-1 [&_.katex]:text-title",
].join(" ");

const DefaultLink = ({ href, children }: { href?: string; children?: ReactNode }): JSX.Element =>
  href?.startsWith("/") ? (
    <a href={href}>{children}</a>
  ) : (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );

const DefaultImage = ({ src, alt }: { src?: string; alt?: string }): JSX.Element => {
  const s = src ?? "";
  const ok =
    s.startsWith("data:") ||
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("/api/");
  if (ok && s) {
    return (
      <img src={s} alt={alt ?? ""} className="my-2 max-w-full rounded-control border border-border/60" />
    );
  }
  return (
    <div className="my-2 rounded-control border border-border/60 bg-muted/40 px-3 py-2 text-label text-muted-foreground">
      <p className="font-medium text-foreground">{alt?.trim() || "Chart"} (image not embedded)</p>
      {s ? <p className="mt-1 font-mono text-micro">{s}</p> : null}
    </div>
  );
};

export interface MarkdownContentProps {
  text: string;
  className?: string;
  /** Replace the default link or image renderer. Other elements stay default. */
  components?: Components;
  /**
   * Product URL scheme. Return a string to keep that URL; return undefined
   * to fall through to the default sanitizer.
   */
  urlTransform?: (url: string) => string | undefined;
}

export const MarkdownContent = ({
  text,
  className,
  components,
  urlTransform,
}: MarkdownContentProps): JSX.Element => (
  <div className={cn(MARKDOWN_CLASS, className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[[rehypeKatex, { strict: "ignore" }]]}
      urlTransform={(url) => urlTransform?.(url) ?? defaultUrlTransform(url)}
      components={{ a: DefaultLink, img: DefaultImage, ...components }}
    >
      {prepareMarkdownMath(text)}
    </ReactMarkdown>
  </div>
);
