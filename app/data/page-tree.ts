// Page Tree — Hierarchical data structure for the page builder
// Page → Section → Row → Column → Element

export interface PageNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: PageNode[];
  parentId: string | null;
}

export interface PageTree {
  id: string;
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  globalStyles: Record<string, unknown>;
  nodes: PageNode[];
  createdAt: string;
  updatedAt: string;
}

// ── ID Generator ──
let counter = 0;
export function generateNodeId(prefix = "node"): string {
  counter++;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── Create empty page tree ──
export function createPageTree(title = "Untitled Page"): PageTree {
  const now = new Date().toISOString();
  return {
    id: generateNodeId("page"),
    title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    seoTitle: title, seoDescription: "",
    globalStyles: {
      fontFamily: "'Inter', sans-serif",
      primaryColor: "#10B981",
      secondaryColor: "#0F172A",
      bodyColor: "#64748B",
      headingColor: "#1E293B",
      backgroundColor: "#FFFFFF",
      maxWidth: 1200,
    },
    nodes: [],
    createdAt: now, updatedAt: now,
  };
}

// ── Create a node ──
export function createNode(type: string, props: Record<string, unknown> = {}, parentId: string | null = null): PageNode {
  return { id: generateNodeId(type), type, props: { ...props }, children: [], parentId };
}

// ── Find node by ID (recursive) ──
export function findNode(nodes: PageNode[], id: string): PageNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

// ── Find parent of a node ──
export function findParent(nodes: PageNode[], childId: string): PageNode | null {
  for (const node of nodes) {
    if (node.children.some((c) => c.id === childId)) return node;
    const found = findParent(node.children, childId);
    if (found) return found;
  }
  return null;
}

// ── Insert node at position ──
export function insertNode(tree: PageTree, node: PageNode, parentId: string | null, index?: number): PageTree {
  const newTree = deepClone(tree);
  node.parentId = parentId;
  if (!parentId) {
    const idx = index ?? newTree.nodes.length;
    newTree.nodes.splice(idx, 0, node);
  } else {
    const parent = findNode(newTree.nodes, parentId);
    if (parent) {
      const idx = index ?? parent.children.length;
      parent.children.splice(idx, 0, node);
    }
  }
  newTree.updatedAt = new Date().toISOString();
  return newTree;
}

// ── Remove node by ID ──
export function removeNode(tree: PageTree, nodeId: string): PageTree {
  const newTree = deepClone(tree);
  newTree.nodes = filterNodes(newTree.nodes, nodeId);
  newTree.updatedAt = new Date().toISOString();
  return newTree;
}

function filterNodes(nodes: PageNode[], removeId: string): PageNode[] {
  return nodes
    .filter((n) => n.id !== removeId)
    .map((n) => ({ ...n, children: filterNodes(n.children, removeId) }));
}

// ── Move node to new parent/position ──
export function moveNode(tree: PageTree, nodeId: string, newParentId: string | null, newIndex: number): PageTree {
  let newTree = deepClone(tree);
  const node = findNode(newTree.nodes, nodeId);
  if (!node) return newTree;
  const nodeCopy = deepClone(node);
  newTree = removeNode(newTree, nodeId);
  nodeCopy.parentId = newParentId;
  return insertNode(newTree, nodeCopy, newParentId, newIndex);
}

// ── Duplicate node ──
export function duplicateNode(tree: PageTree, nodeId: string): PageTree {
  const newTree = deepClone(tree);
  const node = findNode(newTree.nodes, nodeId);
  if (!node) return newTree;

  const clone = deepCloneWithNewIds(node);
  clone.parentId = node.parentId;

  if (!node.parentId) {
    const idx = newTree.nodes.findIndex((n) => n.id === nodeId);
    newTree.nodes.splice(idx + 1, 0, clone);
  } else {
    const parent = findNode(newTree.nodes, node.parentId);
    if (parent) {
      const idx = parent.children.findIndex((n) => n.id === nodeId);
      parent.children.splice(idx + 1, 0, clone);
    }
  }
  newTree.updatedAt = new Date().toISOString();
  return newTree;
}

// ── Update node props ──
export function updateNodeProps(tree: PageTree, nodeId: string, props: Record<string, unknown>): PageTree {
  const newTree = deepClone(tree);
  const node = findNode(newTree.nodes, nodeId);
  if (node) {
    node.props = { ...node.props, ...props };
  }
  newTree.updatedAt = new Date().toISOString();
  return newTree;
}

// ── Get flat list of all nodes ──
export function flattenNodes(nodes: PageNode[]): PageNode[] {
  const result: PageNode[] = [];
  for (const node of nodes) {
    result.push(node);
    result.push(...flattenNodes(node.children));
  }
  return result;
}

// ── Get node depth ──
export function getNodeDepth(tree: PageTree, nodeId: string): number {
  let depth = 0;
  let current = findNode(tree.nodes, nodeId);
  while (current?.parentId) {
    depth++;
    current = findNode(tree.nodes, current.parentId);
  }
  return depth;
}

// ── Reorder children of a parent ──
export function reorderChildren(tree: PageTree, parentId: string | null, fromIndex: number, toIndex: number): PageTree {
  const newTree = deepClone(tree);
  const children = parentId ? findNode(newTree.nodes, parentId)?.children : newTree.nodes;
  if (!children || fromIndex < 0 || toIndex < 0) return newTree;
  const [moved] = children.splice(fromIndex, 1);
  children.splice(toIndex, 0, moved);
  newTree.updatedAt = new Date().toISOString();
  return newTree;
}

// ── Deep clone utility ──
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepCloneWithNewIds(node: PageNode): PageNode {
  return {
    ...node,
    id: generateNodeId(node.type),
    children: node.children.map((child) => {
      const cloned = deepCloneWithNewIds(child);
      cloned.parentId = node.id;
      return cloned;
    }),
  };
}

// ── Serialize / Deserialize ──
export function serializeTree(tree: PageTree): string {
  return JSON.stringify(tree);
}

export function deserializeTree(json: string): PageTree {
  return JSON.parse(json);
}

// ── Create default page structure ──
export function createDefaultPage(title: string): PageTree {
  const tree = createPageTree(title);

  // Create default hero section
  const heroSection = createNode("section", {
    fullWidth: true, backgroundColor: "#0F172A", paddingTop: 80, paddingBottom: 80, maxWidth: 1200,
  });

  const heroRow = createNode("row", { columns: "2", gap: 48, alignItems: "center" }, heroSection.id);

  const leftCol = createNode("column", { width: "auto", verticalAlign: "center" }, heroRow.id);
  const rightCol = createNode("column", { width: "auto", verticalAlign: "center" }, heroRow.id);

  const heading = createNode("heading", {
    text: "Build Something Amazing", tag: "h1", fontSize: 48, fontWeight: "800",
    color: "#FFFFFF", textAlign: "left", lineHeight: 1.1, letterSpacing: "-0.03em",
  }, leftCol.id);

  const subtext = createNode("paragraph", {
    text: "Create stunning pages that convert visitors into customers. No coding required.",
    fontSize: 18, color: "rgba(255,255,255,0.7)", textAlign: "left", lineHeight: 1.7,
  }, leftCol.id);

  const cta = createNode("button", {
    text: "Get Started", url: "/collections/all", backgroundColor: "#10B981",
    textColor: "#FFFFFF", fontSize: 16, fontWeight: "700", paddingX: 32, paddingY: 14,
    borderRadius: 8,
  }, leftCol.id);

  const heroImage = createNode("image", {
    src: "", alt: "Hero Image", width: "100%", height: "400px",
    objectFit: "cover", borderRadius: 12,
  }, rightCol.id);

  leftCol.children = [heading, subtext, cta];
  rightCol.children = [heroImage];
  heroRow.children = [leftCol, rightCol];
  heroSection.children = [heroRow];

  tree.nodes = [heroSection];
  return tree;
}

// ── History management ──
export interface TreeHistory {
  past: PageTree[];
  future: PageTree[];
}

export function createHistory(): TreeHistory {
  return { past: [], future: [] };
}

export function pushToHistory(history: TreeHistory, tree: PageTree, maxSteps = 50): TreeHistory {
  const past = [...history.past, deepClone(tree)];
  if (past.length > maxSteps) past.shift();
  return { past, future: [] };
}

export function undo(history: TreeHistory, current: PageTree): { history: TreeHistory; tree: PageTree } | null {
  if (history.past.length === 0) return null;
  const previous = history.past[history.past.length - 1];
  return {
    history: { past: history.past.slice(0, -1), future: [deepClone(current), ...history.future] },
    tree: previous,
  };
}

export function redo(history: TreeHistory, current: PageTree): { history: TreeHistory; tree: PageTree } | null {
  if (history.future.length === 0) return null;
  const next = history.future[0];
  return {
    history: { past: [...history.past, deepClone(current)], future: history.future.slice(1) },
    tree: next,
  };
}
