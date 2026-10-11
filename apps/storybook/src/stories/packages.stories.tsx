import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Code } from "@molcrafts/ui";

function Packages() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-heading font-semibold">Use the public packages</h1>
        <p className="max-w-[65ch] text-body text-muted-foreground">
          Storybook renders the same entries a product imports. The packages stay private until a later release. Migration of molexp, molvis, and molhub is still unverified.
        </p>
      </header>
      <section className="space-y-3">
        <h2 className="text-title font-semibold">React</h2>
        <Code variant="block" wrap="anywhere">{`import { Button, ThemeScope } from "@molcrafts/ui";
import "@molcrafts/ui/styles.css";`}</Code>
      </section>
      <section className="space-y-3">
        <h2 className="text-title font-semibold">Tokens</h2>
        <Code variant="block" wrap="anywhere">{`import "@molcrafts/ui-tokens/runtime.css";
/* Tailwind v4 apps use this instead */
import "@molcrafts/ui-tokens/tailwind.css";`}</Code>
      </section>
      <section className="space-y-3">
        <h2 className="text-title font-semibold">Web components</h2>
        <Code variant="block" wrap="anywhere">{`import { registerMolcraftsComponents } from "@molcrafts/ui-web-components";
import "@molcrafts/ui-web-components/theme.css";

await registerMolcraftsComponents();`}</Code>
      </section>
      <section className="space-y-3">
        <h2 className="text-title font-semibold">Theme scope</h2>
        <p className="max-w-[65ch] text-body text-muted-foreground">
          Wrap a region in ThemeScope. Pass theme="light" or "dark", and a brand with both complete families. Overlays portal into that scope.
        </p>
        <Code variant="block" wrap="anywhere">{`<ThemeScope theme="light" brand={brand}>
  <Button>Primary action</Button>
</ThemeScope>`}</Code>
      </section>
    </main>
  );
}

const meta = {
  title: "Foundations/Packages",
  component: Packages,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Packages>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Install: Story = {};
