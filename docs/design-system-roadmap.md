# molcrafts-design 实施 Roadmap

日期：2026-10-10 · 当前阶段：P1 已合并（PR #6，ded1b1e）；P2 已合并（PR #7，3e1d2dc）；发布准备已合并（PR #8）；当前实施可选图表与 CI dashboard 迁移。
2026-10-10 用户要求不向后兼容，覆盖原 roadmap 中的兼容条款。
依据：[Refactoring Spec v1.0](design-system-refactoring-spec.md)。
本文件描述未来工作，未勾选事项不代表已经实现。阶段按依赖推进，不预设日期。
实施已授权；用户确认 @molcrafts/design 系列包名与 MIT。允许仓库内命名及发布准备；
不发布、不隐式修改外部资源；项目名称为 `molcrafts-design`。

## 当前准备交付 P0

- [x] 将用户规范和既有 Fluent 2 / 产品品牌 / 图标 / 原生实现要求统一成 spec。
- [x] 记录现有源码、构建、文档覆盖与迁移风险。
- [x] 建立 roadmap、根 AGENTS 和可移植 Skill。
- [x] 更新 README、CLAUDE 与旧规范入口，区分当前实现与目标架构。
- [x] 实施前重验类型、生成、原生包/测试与 Storybook baseline。
- [ ] 真实产品 API 使用与迁移验证仍待产品 PR。

文档交付不是 pnpm、React 包分发或产品兼容迁移的完成证据。

## PR 1 / P1 — Workspace 与包构建基础

**改什么**

- [x] 固定 pnpm，建立 workspace 和唯一 lockfile；同步 CI 安装方式。
- [x] 建立 tokens/ui 逻辑边界，将唯一实现迁移到 packages，更新内部 imports。
- [x] Rslib 输出 JS、公共类型和已编译 CSS，声明 exports/peers/files/sideEffects。
- [x] Storybook 移入 apps/storybook，通过公开入口消费，继续 Rsbuild/Rspack。
- [x] Web Components 改为依赖共享 tokens 资产，消除手工复制形成的独立真源。
- [x] 调整 Registry/同步脚本路径，并删除旧源码同步与兼容流程；不修改外部产品。

**原因**：建立可验证的模块与分发边界，暴露隐式 alias、依赖和源码扫描要求。

**后续影响**：新增共享实现只放 packages；应用和 stories 不再读内部源码。
消费方使用组件入口和编译 CSS，工具/图标继续留在组件包内部。

**退出条件**：干净安装、类型、包构建、生成一致性及 Storybook 通过；现有 stories 可渲染并完成已有 play，关键控件尺寸/主题/交互通过消费者检查；
导出与 CSS 入口可从独立进程解析。全量视觉回归仍待后续阶段。
不添加兼容 shim；旧入口、旧别名与产品专属扩展直接删除，提供新接入文档。

## PR 2 / P2 — 设计 tokens 与主题契约

- [x] 补齐 foundation/semantic 清单、说明、来源并移除废弃别名。
- [x] 固化 MolCrafts-owned 映射与上游版本审查流程，保持当前 Fluent 2 基线。
- [x] 分离纯 CSS runtime entry 与 Tailwind v4 integration。
- [x] 验证 light/dark、产品 primary/secondary、局部主题、portal 继承。
- [x] 清查原始色值、任意尺寸、品牌色与状态色混用；记录分批处理范围。
- [x] 验证 forced-colors、reduced-motion、状态与焦点对比度。

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
- [ ] 对破坏性 API/视觉变化提供前后示例、新入口与升级说明。
- [ ] 把 utils 中产品专有扩展与共享契约区分，删除产品专有扩展，产品自行迁移配置。

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

- [x] 独立 Rsbuild fixture 只使用构建 exports 和编译 CSS，无库源码扫描。
- [x] 本地 tarball 安装验证 JS、types、CSS、runtime dependencies 与 assets。
- [x] 非平凡交互/键盘/a11y 检查纳入 CI，明确关键视觉基线更新方式。
- [x] 继续维护 Web Components 原生 HTML、表单、注册与主题浏览器测试。
- [ ] 选定一个真实 MolCrafts 产品，在独立产品 PR 中验证功能兼容与迁移。
- [x] 记录新 imports/Registry 用法；旧入口不提供兼容窗口。

**原因与影响**：区分“仓库可运行”和“产品可消费”，在产品接入前发现遗漏。

**退出条件**：产物消费 CI 通过；真实产品有明确测试证据。产品 PR 尚未完成时，
库基础设施可以交付，但整个 refactor 的产品兼容验收保持未完成。

## P6 — molcrafts-design 命名与发布准备

- [x] 确定 npm scope、React/tokens/原生包名、subpaths 与版本起点。
- [x] 盘点 repository URL、Registry URL、CI/artifacts、文档与产品 imports。
- [x] 制定统一改名 PR，提供直接迁移说明，不假设 GitHub redirect 替代 API 迁移。
- [x] 编写 semver、changeset/changelog、升级、回退与可复现 release 文档。
- [x] 本地打包演练，确认 license、第三方归属和发布文件范围。

**原因与影响**：避免先发布旧名字再迁移；为消费者提供一致且可追踪的入口。

**退出条件**：改名方案和 release 产物可以审查。当前没有发布步骤，所有包保持
不可自动发布；真正发包、tag/release 和自动发布配置另行安排。

## 每批 PR 的实施纪律

写清已完成范围、API/样式变化、产品迁移影响、验证和未解决项。结构与视觉变更尽量
分开；按依赖顺序合并，绿 CI 不能替代公共契约和产品兼容证据。
不通过源码同步替代真实产品 PR，不把 Web Components 宣称为 React API 对等。

## P1 验证记录（2026-10-10）

本地：pnpm 安装与公共类型检查、Rslib 包构建、exports/module/CSS/SSR 检查、
独立 Rsbuild 及外部临时目录 tarball 构建通过；消费者浏览器检查通过，原生
5 项测试通过；全部 35 个现有 stories 的 render/play 和 Button Autodocs 通过。
P1 CI 通过并已合并 PR #6。没有发包、改名或修改外部产品。

同时提前落实少量后续基础：删除 deprecated token 别名、清除产品专有 cn scales、
生成组件目录、建立产物消费与 story smoke 门禁。P3/P4/P5 未整体完成，
P2 已补齐局部主题 portal 与首批 a11y/visual；完整 API/state、全库视觉覆盖与真实产品验收仍未完成。

## P2 验证范围（2026-10-10）

127 项 token 元数据与文档；ThemeScope 及 8 类浮层就近继承；原生嵌套明暗模式。
独立消费者 7 项测试覆盖键盘、axe 对比度、运行时品牌/尺寸、减少动画、高对比度
以及 3 张截图；原生 6 项测试。详见 [主题契约](theming.md) 与
[样式审计](style-audit.md)。构建、公开类型、外部 tarball、39 个 stories 的 render/play 与 Autodocs 本地通过；
P2 CI 全绿并已合并 PR #7。尚未验证真实产品，也没有发布或外部改名。

## 发包前准备范围（2026-10-10）

用户确认 @molcrafts/design 系列包名与 MIT，完成仓库内命名和直接迁移文档。
配置 Changesets 统一版本；在临时 workspace 演练 0.1.0-alpha.0 和 changelogs，
实际工作区版本仍为未发布 0.0.1，三个包保持 private。打包清单/exports/许可证/
依赖改写/校验和、仓库外三个 tarball 的类型和 React/原生 Rsbuild 消费纳入 CI。
见 [发布准备](releasing.md) 与 [命名计划](rename-plan.md)。外部仓库改名、npm
发布权限、组件验收范围、真实产品接入和实际候选发布仍未完成。

## 可选图表与首个真实消费者

依据：[图表架构](chart-architecture.md)。用户授权新增 Vega 组件库并迁移 CI dashboard。

- [x] 建立 design-vega / design-vega-lite，Runtime 与 Compiler 单向依赖。
- [x] Viewer 生命周期、主题、signals/data、SVG/Canvas 与导出契约及 stories。
- [x] 浏览器交互/主题/无障碍检查和 native-only 编译依赖隔离验证。
- [ ] 真实 CI 产品 PR 完成编译 CSS、public imports、图表和 Fluent 图标接入。
- [ ] 产品浏览器验收及两仓库精确提交 CI 完成。
- [ ] MolPlot 迁移与原生 Web Components 图表支持（后续任务）。

本次继续不发包；未发布阶段的固定 tarball 分发及校验见图表架构。
