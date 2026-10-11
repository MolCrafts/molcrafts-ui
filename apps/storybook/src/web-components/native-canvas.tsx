import { useEffect, useRef } from "react";
import { expect, waitFor } from "storybook/test";
import { registerMolcraftsComponents } from "@molcrafts/design-web-components";
import "@molcrafts/design-web-components/theme.css";

/** Storybook host for one managed custom element. React only mounts the canvas. */
export function NativeCanvas({
  label,
  markup,
  onReady,
}: {
  label: string;
  markup: string;
  onReady?: (node: HTMLElement) => void | (() => void);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;
    let cleanup: void | (() => void);
    void registerMolcraftsComponents().then(() => {
      if (cancelled || !node.isConnected) return;
      node.innerHTML = markup;
      cleanup = onReadyRef.current?.(node);
      node.dataset.ready = "true";
    });
    return () => {
      cancelled = true;
      cleanup?.();
      node.replaceChildren();
      delete node.dataset.ready;
    };
  }, [markup]);
  return (
    <section aria-label={label} className="grid w-[28rem] max-w-full gap-3 text-body">
      <div ref={ref} className="grid gap-3" />
    </section>
  );
}

export async function expectNative(canvasElement: HTMLElement, tag: string) {
  await waitFor(() => expect(canvasElement.querySelector("[data-ready='true']")).not.toBeNull());
  const host = canvasElement.querySelector(tag);
  await expect(host, tag).not.toBeNull();
  await expect(host?.shadowRoot, tag).toBeTruthy();
}
