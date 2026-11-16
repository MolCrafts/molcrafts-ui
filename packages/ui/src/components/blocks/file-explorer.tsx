/**
 * Files and notebooks in one tree.
 *
 * Create actions use the compact button size because they sit in the
 * explorer header, which is a single toolbar row. Delete asks first.
 * Rename asks for the new file name; the product joins it onto the path.
 */

import { useState, type JSX } from "react";

import { buildFileTree } from "../../lib/file-tree";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tree } from "../ui/tree";
import { ExplorerPanel } from "./explorer-panel";

export interface ExplorerFile {
  path: string;
  kind: "notebook" | "text";
}

export interface FileExplorerProps {
  files: readonly ExplorerFile[];
  selectedPath?: string | null;
  onSelect: (path: string) => void;
  onCreateNotebook: () => void;
  onCreateFile: () => void;
  /** `nextName` is the file name the user typed, not a full path. */
  onRename: (path: string, nextName: string) => void;
  onDelete: (path: string) => void;
}

export function FileExplorer({
  files,
  selectedPath = null,
  onSelect,
  onCreateNotebook,
  onCreateFile,
  onRename,
  onDelete,
}: FileExplorerProps): JSX.Element {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [nextName, setNextName] = useState("");
  const nodes = buildFileTree(files.map((file) => ({ name: fileName(file.path), relPath: file.path })));
  const selectedName = selectedPath ? fileName(selectedPath) : "";

  return (
    <>
      <ExplorerPanel
        title="Files"
        actions={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={onCreateNotebook}>
              Notebook
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCreateFile}>
              File
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!selectedPath}
              onClick={() => {
                setNextName(selectedName);
                setRenameOpen(true);
              }}
            >
              Rename
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={!selectedPath} onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </>
        }
        bodyClassName="p-0"
      >
        <Tree
          nodes={nodes}
          onSelect={(node) => {
            if (node.kind === "file") onSelect(node.path);
          }}
          renderNode={(node, row) => (
            <div className={node.path === selectedPath ? "bg-interactive" : undefined}>{row}</div>
          )}
        />
      </ExplorerPanel>
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
            <DialogDescription>Choose a new name for {selectedName}.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedPath || !nextName.trim()) return;
              onRename(selectedPath, nextName.trim());
              setRenameOpen(false);
            }}
          >
            <Input value={nextName} onChange={(event) => setNextName(event.target.value)} aria-label="New name" autoFocus />
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!nextName.trim()}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete file"
        description={selectedName ? `Delete ${selectedName}? This cannot be undone.` : "Delete this file?"}
        confirmLabel="Delete file"
        destructive
        onConfirm={() => {
          if (selectedPath) onDelete(selectedPath);
          setDeleteOpen(false);
        }}
      />
    </>
  );
}

function fileName(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}
