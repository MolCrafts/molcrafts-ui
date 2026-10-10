# 实施前审计与准备清单

日期：2026-10-10 · 源码基线：`7c4d9be`（当前工作分支，含待合并 Web Components）。
这是仓库静态审计，不是外部产品 API 使用情况或全部质量验收。
目标与排期见 [spec](design-system-refactoring-spec.md) / [roadmap](design-system-roadmap.md)。

## 已有能力与实际缺口

| Area | Current evidence | Gap / next action |
| --- | --- | --- |
| Workspace | 根 package.json 使用 npm workspaces，只有原生包 | 尚无 pnpm workspace/lockfile、tokens/ui 包边界 |
| React | src/components/ui 的 30 个模块、3 个 blocks | 当前为源码/Registry 消费，尚无 React Rslib 产物和独立公共包入口 |
| Tokens | src/styles 的 5 个 CSS 文件及 build-design-tokens.mjs | 已有 Fluent 映射与明暗/品牌主题，尚未形成独立 tokens 包及完整契约目录 |
| Primitives | 根依赖中已有 Radix、cmdk、resizable panels | Base UI 尚未采用；新需求再评估，不能无理由替换 |
| Storybook | 根 .storybook、storybook-react-rsbuild、13 个 story 文件 | 尚未移入 apps，当前读源码；基础示例不等于所有组件状态/导出覆盖 |
| Registry | registry.json 35 items、scripts/build-registry.mjs、public/r | 当前主分发；迁移成可选入口并保持单一实现 |
| Web Components | packages/web-components；清单管理 13 个官方标签；Rslib 与 HTML browser tests | 当前共享 CSS 的生成副本需接入 tokens 边界；独立运行时且不宣称 React API 对等 |
| CI | 类型、生成一致性、原生构建/浏览器、Storybook | 尚缺 React 包、独立 Rsbuild/tarball 消费与持续关键视觉回归 |
| Products | extraction-matrix、sync-to-products 脚本记录旧路径 | 当前没有重新验证真实产品；需产品 PR，不能凭历史描述宣称兼容 |
| Release | 根包及原生包 private，未设置发布流程 | 本轮保持不发布；最终改名、license、exports 与版本流程以后落实 |

所有版本以 package.json/lockfile 为准，不将“latest”写成浮动依赖。
现有 README 的历史产品接入记录不能替代本次重构兼容验证。

## React 实现与同名 stories 清单

下表链接是当前源码入口，不是最终 npm import 合约。一个模块可能导出多个
公共组件；正式 catalog 必须按公共导出列出用途、import、示例与 API。
没有同名 story 不等于完全没有示例，例如 checkbox 在表单组合中出现；
有同名 story 也不等于 variants、states、themes 和可访问性覆盖完整。

| Module | Canonical source today | Colocated story evidence |
| --- | --- | --- |
| `edge-panel` | [`src/components/blocks/edge-panel.tsx`](../src/components/blocks/edge-panel.tsx) | 无同名独立 story，需检查组合覆盖 |
| `settings-section` | [`src/components/blocks/settings-section.tsx`](../src/components/blocks/settings-section.tsx) | [story](../src/components/blocks/settings-section.stories.tsx) |
| `settings-shell` | [`src/components/blocks/settings-shell.tsx`](../src/components/blocks/settings-shell.tsx) | 无同名独立 story，需检查组合覆盖 |
| `accordion` | [`src/components/ui/accordion.tsx`](../src/components/ui/accordion.tsx) | 无同名独立 story，需检查组合覆盖 |
| `alert-dialog` | [`src/components/ui/alert-dialog.tsx`](../src/components/ui/alert-dialog.tsx) | 无同名独立 story，需检查组合覆盖 |
| `badge` | [`src/components/ui/badge.tsx`](../src/components/ui/badge.tsx) | [story](../src/components/ui/badge.stories.tsx) |
| `button` | [`src/components/ui/button.tsx`](../src/components/ui/button.tsx) | [story](../src/components/ui/button.stories.tsx) |
| `card` | [`src/components/ui/card.tsx`](../src/components/ui/card.tsx) | [story](../src/components/ui/card.stories.tsx) |
| `checkbox` | [`src/components/ui/checkbox.tsx`](../src/components/ui/checkbox.tsx) | 无同名独立 story，需检查组合覆盖 |
| `code` | [`src/components/ui/code.tsx`](../src/components/ui/code.tsx) | 无同名独立 story，需检查组合覆盖 |
| `collapsible` | [`src/components/ui/collapsible.tsx`](../src/components/ui/collapsible.tsx) | 无同名独立 story，需检查组合覆盖 |
| `command` | [`src/components/ui/command.tsx`](../src/components/ui/command.tsx) | 无同名独立 story，需检查组合覆盖 |
| `context-menu` | [`src/components/ui/context-menu.tsx`](../src/components/ui/context-menu.tsx) | 无同名独立 story，需检查组合覆盖 |
| `dialog` | [`src/components/ui/dialog.tsx`](../src/components/ui/dialog.tsx) | [story](../src/components/ui/dialog.stories.tsx) |
| `dropdown-menu` | [`src/components/ui/dropdown-menu.tsx`](../src/components/ui/dropdown-menu.tsx) | 无同名独立 story，需检查组合覆盖 |
| `empty-state` | [`src/components/ui/empty-state.tsx`](../src/components/ui/empty-state.tsx) | [story](../src/components/ui/empty-state.stories.tsx) |
| `input` | [`src/components/ui/input.tsx`](../src/components/ui/input.tsx) | [story](../src/components/ui/input.stories.tsx) |
| `label` | [`src/components/ui/label.tsx`](../src/components/ui/label.tsx) | 无同名独立 story，需检查组合覆盖 |
| `number-field` | [`src/components/ui/number-field.tsx`](../src/components/ui/number-field.tsx) | [story](../src/components/ui/number-field.stories.tsx) |
| `popover` | [`src/components/ui/popover.tsx`](../src/components/ui/popover.tsx) | 无同名独立 story，需检查组合覆盖 |
| `progress-spinner` | [`src/components/ui/progress-spinner.tsx`](../src/components/ui/progress-spinner.tsx) | 无同名独立 story，需检查组合覆盖 |
| `resizable` | [`src/components/ui/resizable.tsx`](../src/components/ui/resizable.tsx) | [story](../src/components/ui/resizable.stories.tsx) |
| `scroll-area` | [`src/components/ui/scroll-area.tsx`](../src/components/ui/scroll-area.tsx) | 无同名独立 story，需检查组合覆盖 |
| `select` | [`src/components/ui/select.tsx`](../src/components/ui/select.tsx) | 无同名独立 story，需检查组合覆盖 |
| `separator` | [`src/components/ui/separator.tsx`](../src/components/ui/separator.tsx) | 无同名独立 story，需检查组合覆盖 |
| `sheet` | [`src/components/ui/sheet.tsx`](../src/components/ui/sheet.tsx) | 无同名独立 story，需检查组合覆盖 |
| `skeleton` | [`src/components/ui/skeleton.tsx`](../src/components/ui/skeleton.tsx) | 无同名独立 story，需检查组合覆盖 |
| `slider` | [`src/components/ui/slider.tsx`](../src/components/ui/slider.tsx) | 无同名独立 story，需检查组合覆盖 |
| `switch` | [`src/components/ui/switch.tsx`](../src/components/ui/switch.tsx) | 无同名独立 story，需检查组合覆盖 |
| `table` | [`src/components/ui/table.tsx`](../src/components/ui/table.tsx) | 无同名独立 story，需检查组合覆盖 |
| `tabs` | [`src/components/ui/tabs.tsx`](../src/components/ui/tabs.tsx) | [story](../src/components/ui/tabs.stories.tsx) |
| `textarea` | [`src/components/ui/textarea.tsx`](../src/components/ui/textarea.tsx) | 无同名独立 story，需检查组合覆盖 |
| `tooltip` | [`src/components/ui/tooltip.tsx`](../src/components/ui/tooltip.tsx) | 无同名独立 story，需检查组合覆盖 |

## 迁移风险与处理方案

| Risk | Preparation / mitigation |
| --- | --- |
| 移动源码打断 @ alias、Registry paths 和产品同步 | 先记录 imports，统一更新生成入口，校验产物；保留迁移说明 |
| tokens 参考上游变成隐式外部设计契约 | 固定版本、明确 owned 映射，视觉升级有审查和基线 |
| Tailwind 样式只在 Storybook 中存在 | Rslib/构建流程输出完整 CSS；独立消费者无源码扫描 |
| utils 的产品专有 class 合并扩展 | 记录现有依赖，在产品迁移前保持兼容，后续拆出产品配置 |
| scoped theme 丢失于 portal | 明确主题挂载/portal 策略并测试，不仅检查普通 DOM |
| 原生 CSS 副本漂移或 Tailwind reset 影响宿主 | 使用唯一 tokens 真源，保留 shadow/host reset 浏览器回归 |
| 一次性更改 API 与视觉难以判断回归 | 按阶段、批次与独立 PR 验证；breaking change 有升级路径 |
| 改名遗漏资源/导入且提前占用发布身份 | 改名清单统一实施；当前不修改 npm 名字、GitHub repo 或产品 imports |

## 实施启动前与命名准备

- [x] 权威规范、roadmap、仓库规则与可移植 Skill 已准备。
- [x] 当前实现目录、同名 stories、生成脚本和 CI 已盘点。
- [ ] 实施分支重新运行 baseline：typecheck、tokens、Registry、原生包及测试、Storybook。
- [ ] 记录每个产品当前使用的组件、props、variants、CSS entry 与 custom overrides。
- [ ] 确定首批兼容导出清单及源码移动后的 temporary compatibility 策略。
- [ ] 选定独立 Rsbuild fixture 与真实产品验收对象。
- [ ] 正式改名时确定 package scope/names、subpaths、repo/Registry/docs URLs、
  internal dependencies、CI/artifacts、旧 imports 迁移与 license/第三方归属。

这些待办是实施前或对应阶段的工作，文档提交不会自动满足它们。
本轮未运行跨产品同步，未重命名，未发包，未改变组件实现、主题或构建配置。
