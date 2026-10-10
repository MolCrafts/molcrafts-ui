import { readdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
const root = new URL("../", import.meta.url);
const purposes = {
  accordion: "可展开的分组内容", "alert-dialog": "需要明确确认的阻断对话框", badge: "非交互状态标签",
  button: "操作按钮、链接与图标按钮", card: "信息容器与分组", checkbox: "多选及不确定状态", code: "代码文本展示",
  collapsible: "单个可折叠区域", command: "可搜索的命令选择", "context-menu": "上下文操作菜单", dialog: "模态对话框",
  "dropdown-menu": "触发式操作菜单", "empty-state": "空内容与行动提示", input: "单行文本输入", label: "表单标签",
  "number-field": "草稿编辑与数值提交", popover: "锚定浮层", "progress-spinner": "加载进度提示",
  resizable: "可调整大小的面板", "scroll-area": "可滚动内容区域", select: "单选下拉列表", separator: "内容分隔线",
  sheet: "侧边模态面板", skeleton: "加载占位", slider: "范围数值选择", switch: "即时开关", table: "表格结构",
  tabs: "标签页导航", textarea: "多行文本输入", tooltip: "操作补充说明", "settings-section": "设置字段与分组",
  "settings-shell": "设置导航与内容组合", "edge-panel": "边缘拖拽展开面板",
};
const lines = ["# React 组件目录", "", "由 `pnpm build:catalog` 生成。当前包名为未发布的内部名称，后续随 molcrafts-design 统一改名。",
  "唯一实现位于 packages/ui，所有列出的组件通过 `@molcrafts/ui` 根入口消费。", "",
  "```tsx", 'import { Button } from "@molcrafts/ui";', 'import "@molcrafts/ui/styles.css";', '<Button size="icon" aria-label="Add item">{/* official Fluent icon */}</Button>', "```", "",
  "完整用法查看链接的 TypeScript API 与 stories。无专用 story 的组件仍待后续补齐；有 story 不代表状态覆盖完整。", "",
  "| Module / purpose | Exported values | API source | Story |", "| --- | --- | --- | --- |"];
for (const group of ["ui", "blocks"]) {
  const directory = new URL(`packages/ui/src/components/${group}/`, root);
  for (const file of (await readdir(directory)).filter(name => name.endsWith(".tsx")).sort()) {
    const source = ts.createSourceFile(file, await readFile(new URL(file, directory), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const names = [];
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        names.push(...statement.exportClause.elements.filter(item => !statement.isTypeOnly && !item.isTypeOnly).map(item => item.name.text));
      }
      if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
        if (ts.isFunctionDeclaration(statement) && statement.name) names.push(statement.name.text);
        if (ts.isVariableStatement(statement)) names.push(...statement.declarationList.declarations.map(item => item.name.getText(source)));
      }
    }
    const name = file.slice(0, -4);
    const storyPath = `apps/storybook/src/components/${group}/${name}.stories.tsx`;
    let story = "待补专用 story";
    try { await readFile(new URL(storyPath, root)); story = `[story](../${storyPath})`; } catch {}
    lines.push(`| ${name}：${purposes[name]} | ${names.map(name => `\`${name}\``).join(", ")} | [source](../packages/ui/src/components/${group}/${file}) | ${story} |`);
  }
}
lines.push("", "`cn` 通过 `@molcrafts/ui` 或 `@molcrafts/ui/utils` 导入；只识别共享设计 scales。", "",
  "Web Components 使用独立包/API，清单及接入方式见 [原生包文档](../packages/web-components/README.md)。", "");
await writeFile(new URL("docs/component-catalog.md", root), lines.join("\n"));
