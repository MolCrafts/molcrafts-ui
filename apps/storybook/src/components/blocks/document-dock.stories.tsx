import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import {
  DocumentDock,
  type DocumentMove,
  type DocumentPane,
  type DocumentTab,
} from "@molcrafts/ui";

const DOCS: DocumentTab[] = ["caffeine.ipynb", "quickstart.ipynb", "analysis.ipynb"].map(name => ({
  id: name,
  title: name,
}));

function movePanes(panes: DocumentPane[], documentId: string, target: DocumentMove): DocumentPane[] {
  const source = panes.find(pane => pane.tabs.some(tab => tab.id === documentId));
  const tab = source?.tabs.find(item => item.id === documentId);
  if (!source || !tab) return panes;
  const without = (pane: DocumentPane): DocumentPane => ({
    ...pane,
    tabs: pane.tabs.filter(item => item.id !== documentId),
    activeId: pane.activeId === documentId ? pane.tabs.find(item => item.id !== documentId)?.id ?? null : pane.activeId,
  });
  if ("newPane" in target) {
    if (source.tabs.length < 2) return panes;
    return [...panes.map(pane => pane.id === source.id ? without(pane) : pane).filter(pane => pane.tabs.length > 0), {
      id: `pane-${panes.length + 1}`,
      tabs: [tab],
      activeId: tab.id,
    }];
  }
  const destination = panes.find(pane => pane.id === target.paneId);
  if (!destination) return panes;
  if (destination.id === source.id) {
    const rest = source.tabs.filter(item => item.id !== documentId);
    rest.splice(Math.min(target.index, rest.length), 0, tab);
    return panes.map(pane => pane.id === source.id ? { ...pane, tabs: rest, activeId: tab.id } : pane);
  }
  const next = panes.map(pane => {
    if (pane.id === source.id) return without(pane);
    if (pane.id !== destination.id) return pane;
    const tabs = [...pane.tabs];
    tabs.splice(Math.min(target.index, tabs.length), 0, tab);
    return { ...pane, tabs, activeId: tab.id };
  });
  return next.filter(pane => pane.tabs.length > 0);
}

function DockStory({ initial }: { initial: DocumentPane[] }) {
  const [panes, setPanes] = useState(initial);
  return (
    <div className="h-[32rem] border border-border bg-background">
      <DocumentDock
        label="Notebooks"
        panes={panes}
        onActivate={(paneId, documentId) => setPanes(current => current.map(pane => pane.id === paneId ? { ...pane, activeId: documentId } : pane))}
        onMove={(documentId, target) => setPanes(current => movePanes(current, documentId, target))}
        onClose={documentId => setPanes(current => current.map(pane => ({
          ...pane,
          tabs: pane.tabs.filter(tab => tab.id !== documentId),
          activeId: pane.activeId === documentId ? pane.tabs.find(tab => tab.id !== documentId)?.id ?? null : pane.activeId,
        })).filter(pane => pane.tabs.length > 0))}
        renderDocument={documentId => <p className="p-6 font-mono text-body">{documentId}</p>}
      />
    </div>
  );
}

const meta = {
  title: "Blocks/DocumentDock",
  component: DocumentDock,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: 'import { DocumentDock } from "@molcrafts/ui". Drag a notebook tab to reorder it, onto another pane, or onto New pane. Arrow keys switch tabs. Ctrl+Shift+Arrow moves the tab to the neighboring pane.',
      },
    },
  },
  args: {
    label: "Notebooks",
    panes: [{ id: "pane-1", tabs: DOCS, activeId: DOCS[0].id }],
    onActivate: () => {},
    onMove: () => {},
    onClose: () => {},
    renderDocument: documentId => documentId,
  },
  render: () => <DockStory initial={[{ id: "pane-1", tabs: DOCS, activeId: DOCS[0].id }]} />,
} satisfies Meta<typeof DocumentDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoPanes: Story = {
  render: () => (
    <DockStory initial={[
      { id: "pane-1", tabs: [DOCS[0], DOCS[1]], activeId: DOCS[0].id },
      { id: "pane-2", tabs: [DOCS[2]], activeId: DOCS[2].id },
    ]} />
  ),
};
