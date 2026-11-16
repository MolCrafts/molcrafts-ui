/**
 * Minimal shape needed to place a file in the tree. Mirrors the fields the
 * server returns per discovered file (`relPath` is the run-relative POSIX
 * path; `name` is the basename).
 */
export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  kind: "file" | "folder";
  children?: FileTreeNode[];
  metadata?: Record<string, unknown>;
}

export interface FlatFile {
  name: string;
  relPath: string;
  size?: number | null;
}

const compareNodes = (a: FileTreeNode, b: FileTreeNode): number => {
  // Folders first, then files, each alphabetical — matches the server's
  // `(p.is_file(), p.name)` ordering so the tree reads the same as on disk.
  if (a.kind !== b.kind) {
    return a.kind === "folder" ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
};

const sortTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
  for (const node of nodes) {
    if (node.children) {
      sortTree(node.children);
    }
  }
  nodes.sort(compareNodes);
  return nodes;
};

/**
 * Build a hierarchical {@link FileTreeNode} forest from a flat list of files
 * keyed by their run-relative path. Intermediate directories are synthesised
 * as folder nodes so a recursively-discovered file like
 * ``executions/exec-1/traj.lammpstrj`` keeps its full path in the UI instead
 * of collapsing to an ambiguous basename.
 *
 * Node ids are the path (folder) or relPath (file), both unique within a run.
 */
export const buildFileTree = (files: FlatFile[]): FileTreeNode[] => {
  const root: FileTreeNode[] = [];
  const folders = new Map<string, FileTreeNode>();

  const ensureFolder = (path: string, name: string, siblings: FileTreeNode[]): FileTreeNode => {
    const existing = folders.get(path);
    if (existing) {
      return existing;
    }
    const folder: FileTreeNode = { id: path, name, path, kind: "folder", children: [] };
    folders.set(path, folder);
    siblings.push(folder);
    return folder;
  };

  for (const file of files) {
    const segments = file.relPath.split("/").filter(Boolean);
    let siblings = root;
    let prefix = "";
    for (let i = 0; i < segments.length - 1; i += 1) {
      prefix = prefix ? `${prefix}/${segments[i]}` : segments[i];
      const folder = ensureFolder(prefix, segments[i], siblings);
      // children is always initialised on folder nodes above.
      siblings = folder.children as FileTreeNode[];
    }
    siblings.push({
      id: file.relPath,
      name: file.name,
      path: file.relPath,
      kind: "file",
      metadata: { size: file.size ?? null },
    });
  }

  return sortTree(root);
};

/** Collect every folder node id, for expand-all default state. */
export const collectFolderIds = (nodes: FileTreeNode[]): Set<string> => {
  const ids = new Set<string>();
  const walk = (list: FileTreeNode[]): void => {
    for (const node of list) {
      if (node.kind === "folder") {
        ids.add(node.id);
        if (node.children) {
          walk(node.children);
        }
      }
    }
  };
  walk(nodes);
  return ids;
};
