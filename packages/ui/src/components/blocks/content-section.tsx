/**
 * Content section: a titled group on an operational page, without card chrome.
 *
 * Domain-free block. Products own the content and actions; this block owns the
 * heading association, spacing, and the title, description, and body hierarchy.
 */

import { type JSX, type ReactNode, useId } from "react";
import { cn } from "../../lib/utils";

export interface ContentSectionProps {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right of the title: a count, a link, a small action. */
  action?: ReactNode;
  /** Heading level inside the page outline. Default 2. */
  level?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function ContentSection({
  id,
  title,
  description,
  action,
  level = 2,
  children,
  className,
  bodyClassName,
}: ContentSectionProps): JSX.Element {
  const generatedId = useId();
  const headingId = id ? `${id}-heading` : `content-section-${generatedId}`;
  const Heading = `h${level}` as const;

  return (
    <section id={id} aria-labelledby={headingId} data-slot="content-section" className={cn("space-y-3", className)}>
      <header className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <Heading id={headingId} className="text-body-lg font-semibold text-foreground">
            {title}
          </Heading>
          {description ? <p className="text-label text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0 text-label text-muted-foreground">{action}</div> : null}
      </header>
      <div className={cn("min-w-0", bodyClassName)}>{children}</div>
    </section>
  );
}
