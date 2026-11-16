import { ChevronDownRegular, ChevronUpRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import {
  Button, EmptyState, ExplorerPanel, MetaStrip, NavList, NavListItem, Tabs, TabsContent, TabsList, TabsTrigger,
  ThemeToggle, WorkSurface, WorkbenchHeader, WorkbenchShell, useWorkbenchDock, type ThemeMode,
} from "@molcrafts/ui";

function Dock() {
  const { collapsed, toggle } = useWorkbenchDock();
  return (
    <Tabs defaultValue="log" className="min-h-0 flex-1 gap-0">
      <div className="flex shrink-0 items-center border-b border-border px-2">
        <TabsList className="h-11"><TabsTrigger value="log">Log</TabsTrigger><TabsTrigger value="problems">Problems</TabsTrigger></TabsList>
        <span className="flex-1" />
        <Button variant="ghost" size="icon-sm" aria-expanded={!collapsed} aria-label={collapsed ? "Expand panel" : "Collapse panel"} title={collapsed ? "Expand panel" : "Collapse panel"} onClick={toggle}>
          {collapsed ? <ChevronUpRegular /> : <ChevronDownRegular />}
        </Button>
      </div>
      <TabsContent value="log"><EmptyState title="Nothing published yet" density="inline" className="px-3 py-2" /></TabsContent>
      <TabsContent value="problems"><EmptyState title="No problems" density="inline" className="px-3 py-2" /></TabsContent>
    </Tabs>
  );
}

function Workbench() {
  const [project, setProject] = useState("molrs");
  const [theme, setTheme] = useState<ThemeMode>("light");
  return (
    <WorkbenchShell
      storageKey="storybook.workbench"
      labels={{ navigator: "Projects", main: "Records", dock: "Operations" }}
      header={<WorkbenchHeader title="MolCrafts CI" breadcrumb={[project, "Overview"]} actions={<ThemeToggle theme={theme} onThemeChange={setTheme} />} />}
      navigator={
        <ExplorerPanel title="Projects">
          <NavList>{["molcrafts-ci", "molrs", "molpy"].map(id => <NavListItem key={id} current={id === project} onClick={() => setProject(id)}>{id}</NavListItem>)}</NavList>
        </ExplorerPanel>
      }
      dock={<Dock />}
    >
      <WorkSurface><MetaStrip facts={[{ label: "Records", value: 6 }, { label: "Last published", value: "2 h ago" }]} /></WorkSurface>
    </WorkbenchShell>
  );
}

const meta = {
  title: "Blocks/WorkbenchShell",
  component: WorkbenchShell,
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "560px" }, description: { component: 'import { WorkbenchShell, WorkbenchHeader, useWorkbenchDock } from "@molcrafts/ui". Header, resizable navigator, work surface, and a dock that opens collapsed. Sizes persist under storageKey. The product names each landmark.' } } },
  args: { header: null, navigator: null, children: null, labels: { navigator: "Projects", main: "Records", dock: "Operations" }, storageKey: "storybook.workbench" },
  render: () => <Workbench />,
} satisfies Meta<typeof WorkbenchShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
