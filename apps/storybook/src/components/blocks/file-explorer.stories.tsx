import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { FileExplorer, type ExplorerFile } from "@molcrafts/ui";

const initial: ExplorerFile[] = [
  { path: "caffeine.ipynb", kind: "notebook" },
  { path: "data/smiles.txt", kind: "text" },
];

function ExplorerStory() {
  const [files, setFiles] = useState(initial);
  const [selectedPath, setSelectedPath] = useState<string | null>(initial[0].path);
  return (
    <div className="h-96 w-80 border-r border-border">
      <FileExplorer
        files={files}
        selectedPath={selectedPath}
        onSelect={setSelectedPath}
        onCreateNotebook={() => {
          const path = `Untitled-${files.length}.ipynb`;
          setFiles((current) => [...current, { path, kind: "notebook" }]);
          setSelectedPath(path);
        }}
        onCreateFile={() => {
          const path = `notes-${files.length}.txt`;
          setFiles((current) => [...current, { path, kind: "text" }]);
          setSelectedPath(path);
        }}
        onRename={(path, nextName) => {
          const parent = path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "";
          const next = `${parent}${nextName}`;
          setFiles((current) => current.map((file) => file.path === path ? { ...file, path: next } : file));
          setSelectedPath(next);
        }}
        onDelete={(path) => {
          setFiles((current) => current.filter((file) => file.path !== path));
          setSelectedPath(null);
        }}
      />
    </div>
  );
}

const meta = {
  title: "Blocks/FileExplorer",
  component: FileExplorer,
  parameters: { layout: "fullscreen", docs: { description: { component: 'import { FileExplorer } from "@molcrafts/ui". A file tree with create, rename, and a delete confirmation. The product owns the paths.' } } },
  args: {
    files: initial,
    onSelect: () => {},
    onCreateNotebook: () => {},
    onCreateFile: () => {},
    onRename: () => {},
    onDelete: () => {},
  },
  render: () => <ExplorerStory />,
} satisfies Meta<typeof FileExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
