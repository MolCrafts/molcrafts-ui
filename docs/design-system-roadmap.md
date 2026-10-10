# molcrafts-design 实施 Roadmap

日期：2026-10-10 · 当前阶段：实施前准备。
依据：[Refactoring Spec v1.0](design-system-refactoring-spec.md)。
本文件描述未来工作，未勾选事项不代表已经实现。阶段按依赖推进，不预设日期。
本轮不改包名、不迁移运行时代码、不发布；未来项目名称为 `molcrafts-design`。

## 当前准备交付 P0

- [x] 将用户规范和既有 Fluent 2 / 产品品牌 / 图标 / 原生实现要求统一成 spec。
- [x] 记录现有源码、构建、文档覆盖与迁移风险。
- [x] 建立 roadmap、根 AGENTS 和可移植 Skill。
- [x] 更新 README、CLAUDE 与旧规范入口，区分当前实现与目标架构。
- [ ] 正式实施时先在目标分支重验 baseline，并记录产品正在使用的具体 API。

文档交付不是 pnpm、React 包分发或产品兼容迁移的完成证据。

## PR 1 / P1 — Workspace 与包构建基础

**改什么**

- [ ] 固定 pnpm，建立 workspace 和唯一 lockfile；同步 CI 安装方式。
- [ ] 建立 tokens/ui 逻辑边界，将唯一实现迁移到 packages，更新内部 imports。
- [ ] Rslib 输出 JS、公共类型和已编译 CSS，声明 exports/peers/files/sideEffects。
- [ ] Storybook 移入 apps/storybook，通过公开入口消费，继续 Rsbuild/Rspack。
- [ ] Web Components 改为依赖共享 tokens 资产，消除手工复制形成的独立真源。
- [ ] 调整 Registry/同步脚本路径，并保留兼容；不实际运行跨产品写入。

**原因**：建立可验证的模块与分发边界，暴露隐式 alias、依赖和源码扫描要求。

**后续影响**：新增共享实现只放 packages；应用和 stories 不再读内部源码。
消费方使用组件入口和编译 CSS，工具/图标继续留在组件包内部。

**退出条件**：干净安装、类型、包构建、生成一致性及 Storybook 通过；原有组件
行为和视觉没有因搬目录发生变化；导出与 CSS 入口可从独立进程解析。
回退以本 PR 为单位，不同时进行视觉重设计或删除旧入口。

## PR 2 / P2 — 设计 tokens 与主题契约

- [ ] 补齐 foundation/semantic 清单、说明、来源与废弃别名。
- [ ] 固化 MolCrafts-owned 映射与上游版本审查流程，保持当前 Fluent 2 基线。
- [ ] 分离纯 CSS runtime entry 与 Tailwind v4 integration。
- [ ] 验证 light/dark、产品 primary/secondary、局部主题、portal 继承。
- [ ] 清查原始色值、任意尺寸、品牌色与状态色混用；记录分批处理范围。
- [ ] 验证 forced-colors、reduced-motion、状态与焦点对比度。

**原因**：使所有运行时共享设计契约，产品只提供自己的品牌与主题配置。

**后续影响**：组件新样式优先使用语义角色；产品不需要覆盖内部 DOM。
新增 token 需要表达可复用语义或明确定制契约。

**退出条件**：tokens 无 React/primitive/application 依赖；主题无需重建；同一
品牌主题在 React 与已有原生控件中一致生效；视觉变化有独立记录。

## PR 3+ / P3 — 分批组件所有权

批次可按审计结果调整，每批单独完成 API、stories、相关测试与迁移说明。

| Batch | Initial scope | Why / downstream impact |
| --- | --- | --- |
| A | Button、Badge、Input、Label、Textarea、Card | 固定基本尺寸、状态、品牌与 icon-only 规范，供后续组合复用 |
| B | Checkbox、Switch、Select、NumberField、Slider | 稳定表单受控/非受控、invalid、disabled、ref 与键盘契约 |
| C | Dialog、AlertDialog、Sheet、Popover、Tooltip、menus | 验证焦点管理、portal、主题与关闭行为，保留有效 Radix |
| D | Tabs、Accordion、Collapsible、Command、其余 primitives/blocks | 在基础契约稳定后处理组合、布局与遗留产品耦合 |

- [ ] 按公共导出清单记录 props、variants、sizes、slots 和实现细节泄漏。
- [ ] 样式迁移到 MolCrafts 语义 tokens；保留可预测 className 合并。
- [ ] 复杂新交互按需求评估 Base UI；不为了统一替换有效 Radix。
- [ ] 对破坏性 API/视觉变化提供前后示例、兼容方案与升级说明。
- [ ] 把 utils 中产品专有扩展与共享契约区分，避免直接删除影响已有产品。

**退出条件**：每批公开导出有契约和 stories；相关类型、键盘、交互、a11y 与
关键视觉验证通过；未迁移组件明确标记，不宣称全库完成。

## PR 4 / P4 — 文档、Agent 与覆盖检查

该阶段可随 P3 逐批交付，最终集中检查遗漏。

- [ ] 完整组件目录：名称、用途、公开 import、最小示例、状态、story。
- [ ] 已迁移公共组件覆盖默认/变体/尺寸/主题/状态/组合/重要 a11y 行为。
- [ ] Autodocs 与公共类型一致，示例不导入内部实现。
- [ ] AGENTS/Skill 使用最终 workspace 命令和包名，不保留过时引导。
- [ ] 可选 Registry 项引用 canonical packages，保持单一实现。

**原因与影响**：开发者与 Agent 可以先发现再复用；共享组件修改同步更新文档。

**退出条件**：从仓库文档可完成查找、接入、主题配置和常见组合；按公共导出
检查覆盖，不能仅统计 story 文件数量。

## PR 5 / P5 — 独立消费与质量门禁

- [ ] 独立 Rsbuild fixture 只使用构建 exports 和编译 CSS，无库源码扫描。
- [ ] 本地 tarball 安装验证 JS、types、CSS、runtime dependencies 与 assets。
- [ ] 非平凡交互/键盘/a11y 检查纳入 CI，明确关键视觉基线更新方式。
- [ ] 继续维护 Web Components 原生 HTML、表单、注册与主题浏览器测试。
- [ ] 选定一个真实 MolCrafts 产品，在独立产品 PR 中验证功能兼容与迁移。
- [ ] 记录兼容窗口、旧 imports/Registry 路径和 source-sync 的退出策略。

**原因与影响**：区分“仓库可运行”和“产品可消费”，在产品接入前发现遗漏。

**退出条件**：产物消费 CI 通过；真实产品有明确测试证据。产品 PR 尚未完成时，
库基础设施可以交付，但整个 refactor 的产品兼容验收保持未完成。

## P6 — molcrafts-design 改名与发布准备（后续）

- [ ] 确定 npm scope、React/tokens/原生包名、subpaths 与版本起点。
- [ ] 盘点 repository URL、Registry URL、CI/artifacts、文档与产品 imports。
- [ ] 制定统一改名 PR，保留必要兼容说明，不假设 GitHub redirect 替代 API 迁移。
- [ ] 编写 semver、changeset/changelog、升级、回退与可复现 release 文档。
- [ ] 本地打包演练，确认 license、第三方归属和发布文件范围。

**原因与影响**：避免先发布旧名字再迁移；为消费者提供一致且可追踪的入口。

**退出条件**：改名方案和 release 产物可以审查。当前没有发布步骤，所有包保持
不可自动发布；真正发包、tag/release 和自动发布配置另行安排。

## 每批 PR 的实施纪律

写清已完成范围、API/样式变化、兼容影响、验证和未解决项。结构与视觉变更尽量
分开；按依赖顺序合并，绿 CI 不能替代公共契约和产品兼容证据。
不运行 `sync:products` 来替代真实产品 PR，不把 Web Components 宣称为 React API 对等。
