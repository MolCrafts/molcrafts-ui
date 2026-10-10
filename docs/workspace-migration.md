# Workspace 与消费入口迁移

2026-10-10：用户明确要求不向后兼容。项目未来名称为 `molcrafts-design`，
目前逻辑包仍使用 spec 中的内部名称，全部 private；没有发包或外部资源改名。

## 新入口

```tsx
import { Button, Input, Dialog, DialogContent, DialogTitle } from "@molcrafts/ui";
import "@molcrafts/ui/styles.css";
```

所有组件从根公开入口导入，`cn` 也可从 `@molcrafts/ui/utils` 导入。
不要引用 packages 内部实现，也不要把组件源码再复制进产品。
CSS 包含默认 tokens、组件全部 utility 和 preflight，不要求产品安装 Tailwind
或扫描库源码。Tailwind 应用如需自己的 utilities，可额外导入 tokens 的
`tailwind.css`；纯 CSS 用 `runtime.css`。应用自己控制页面布局与产品主题。

## 已删除的旧契约

| Old | New |
| --- | --- |
| 根 `src/components`、`src/hooks`、`src/lib` | 唯一实现位于 packages/ui；消费方用公开 exports |
| 根 `src/styles` 与独立 constitution CSS 导入 | tokens/runtime.css 或 UI/styles.css |
| `--accent-*`、`--link-*` | `--primary-*`、`--primary-link` / `--primary-link-hover` |
| `rounded-sm/md/lg/xl` 的 MolCrafts 别名 | 使用 control/panel/overlay/checkbox 等角色；Tailwind stock 值仍由 Tailwind 定义 |
| utils 中产品私有尺寸/字体/container scales | 产品自己配置；共享 cn 只识别 MolCrafts-owned scales |
| 35 个核心源码 Registry items | setup 与 button-example 引用 canonical packages |
| sync:products / 源码复制脚本 | 产品仓库通过独立 PR 接入包 |
| npm lockfile / 根 Storybook 配置 | pnpm workspace lockfile / apps/storybook |

没有旧入口 re-export、alias 适配器或双组件实现。正常工作的 Radix 行为仍保留；
无需为删除兼容层而重写全部行为。此次组件外观仍以既有 Fluent 2 基线为准。

## 验证与当前限制

- Rslib 输出完整 ESM 模块树及 declarations；package exports 不依赖源码 alias。
- 独立 Rsbuild fixture 无 Tailwind/source alias，浏览器验证尺寸、主题、交互与 portal。
- 本地 tarball 在临时外部目录安装并构建，不依赖 workspace 链接。
- 原生包的 standalone theme.css 从同一 tokens 构建，源码不再保存共享 tokens 副本。
- Storybook 使用构建后的公共 API；全部现有 stories 执行，完整 API/state 覆盖仍待补。
- 没有修改 molexp/molvis/molhub；真实产品功能验收仍待对应产品 PR。

主题所有权、API 规范、a11y/视觉覆盖和未来改名/发布依照 roadmap 分批落实。
