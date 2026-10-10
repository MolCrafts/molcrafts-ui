# MolCrafts Design System Refactoring Spec

Version: 1.0 · Status: Implementation authorized; incremental delivery
Date: 2026-10-10 · Scope: current `MolCrafts/molcrafts-ui` repository
Future project name: **molcrafts-design**

本规范整理用户提供的 v1.0，并纳入此前确认的 Fluent 2、产品品牌色、图标及
Web Components 要求。2026-10-10 用户随后授权实施，并明确要求不向后兼容；该决定覆盖原始 v1.0
的 Preserve compatibility 要求。实际完成范围以 roadmap 为准，未发包。
实现顺序见 [roadmap](design-system-roadmap.md)，现状见
[实施前审计](design-system-readiness.md)。

## 1. Vision and ownership

把 shadcn 派生组件集合演进为独立、可复用、Agent 友好的 React Design System。
MolCrafts 拥有视觉语言、tokens、主题、公共 API、样式契约和版本流程。
跨产品共享基础 UI，不依赖单个产品的布局、数据模型或业务逻辑。
原则：Own the design, reuse the infrastructure。

[设计宪法](design-constitution.md) 是具体视觉契约；本文件定义工程与分发边界。
旧 Registry 规范保留为历史记录，其 Registry 优先、npm 可选的方向由本规范取代。
不保留旧导入、旧源码分发、旧 token 别名或同步适配器；产品直接迁移到新入口。

## 2. Technology decisions

| Layer | Technology | Contract |
| --- | --- | --- |
| UI | React + TypeScript | MolCrafts 拥有公共组件 API |
| Styling | Tailwind CSS v4 | 构建时生成 CSS，消费方无需扫描库源码 |
| New complex interactions | Base UI | 优先采用成熟无头行为，按需求引入 |
| Existing interactions | Radix UI | 保留工作正常的实现，逐步迁移 |
| Tokens / themes | CSS Custom Properties | 框架无关，运行时主题来源 |
| Library build | Rslib | JS、类型声明、CSS 资产与明确 exports |
| Development / documentation | Rsbuild + Storybook Rsbuild | 使用 Rspack 生态 |
| Workspace | pnpm | 固定版本与单一 workspace lockfile |
| Future primary distribution | npm-compatible versioned packages | 本次不发布 |
| Agent / optional source integration | Skills + shadcn Registry | 静态发现与集成脚手架 |

组件库不引入 Next.js、Vite 或其他应用框架。不为统一而替换所有 Radix 组件，
也不为架构完整性添加暂时没有使用场景的依赖。

## 3. Architecture and dependency rules

目录边界（已建立，具体组件所有权仍分批实施）：

```text
packages/tokens/           # CSS、主题、Tailwind 集成
packages/ui/               # React 组件、变体、公共 API
packages/web-components/   # 已有独立原生实现，与 React 共享 tokens
apps/storybook/            # 组件开发与文档
registry/                 # 可选配置、示例和集成入口
skills/molcrafts-ui/       # 可移植 Agent 指引
docs/                     # 规范、决策、迁移与组件目录
```

逻辑包角色暂用用户规范的 `@molcrafts/tokens`、`@molcrafts/ui`；这些名称在最终
改名前只作规划标识。`molcrafts-design` 是确定的未来项目名，npm scope、包名、
子路径、域名与 Registry 标识需在改名阶段统一核对，不能假定它们已确定。
不要提前改 GitHub repository、npm 身份或产品导入路径。

1. tokens 不依赖 React、Base UI、Radix 或应用。
2. ui 可以依赖 tokens、无头 primitives 和必要的运行时工具。
3. 应用通过公共包入口消费组件，不导入实现源码。
4. packages 不导入消费应用，不依赖应用级 alias、Tailwind 扫描或隐式全局配置。
5. 禁止循环依赖；工具、图标和组件分类暂不拆包。
6. Web Components 具有独立运行时和分发边界，可以独立保留；不引用 React 实现。

## 4. Design tokens and Fluent 2 themes

采用当前稳定的 Fluent 2 Web 视觉风格，使用官方 Fluent Icons。
“latest”表示定期核对稳定版并审查升级，不表示依赖使用浮动 `latest`。
官方 tokens 是参考与生成输入；MolCrafts 的 CSS slots、映射、默认值及升级
决策是自己的设计契约，不能让上游更新未经验证直接改变产品视觉。

Foundation tokens 覆盖颜色、字体、间距、尺寸、边框、圆角、阴影、层级、
动效时长与曲线、焦点指示器和交互状态。Semantic tokens 覆盖背景、表面、
前景、边框、primary、secondary、muted、accent、success、warning、danger、
info，以及 hover、active/pressed、disabled、focus。

- CSS Custom Properties 是运行时来源；Tailwind v4 通过 `@theme` 映射消费。
- 组件主要引用语义 tokens，不写默认 shadcn 色值或任意视觉常量。
- 首阶段支持 light/dark；主题独立于业务逻辑，切换无需重新构建。
- 支持局部产品主题。每个产品拥有完整 primary / secondary 色组及明暗状态。
- 中性次要操作与第二品牌色分开，状态色不被品牌色覆盖。
- 局部主题的 portal 浮层必须保留正确作用域，在 Storybook 中验证。
- 不任意制造组件专属 tokens；例外需为可复用概念或已文档化定制契约。
- 保留 reduced-motion、forced-colors、文本/控件/焦点对比度要求。

工具栏等熟悉操作优先使用 icon-only 按钮；必须提供可访问名称和可见提示。
难辨认操作、破坏性确认及关键提交保留文字。统一官方 Fluent 图标，React
使用 React icons，原生实现使用对应 SVG icons，不另拆图标包。

## 5. Component contracts

每个公共组件说明明确 TypeScript props、variants、sizes、相关受控/非受控行为、
键盘与可访问性、loading/disabled/invalid 等状态、ref 和原生属性支持。
简单组件采用直接 props，复杂组件采用可组合 API。
不把不必要的 Base UI/Radix 细节变成长期公共 API 承诺；已有暴露逐项评估，不以兼容为由保留不必要的 API。

组件视觉样式属于组件库。支持可预测的 className 合并和有目的的 variants、slots
及 tokens 扩展，避免要求消费方靠内部 DOM selectors 大幅覆盖。
必要时采用标准 CSS；避免不必要的运行时 CSS-in-JS。
结构迁移尽量避免无关行为和视觉变化；删除旧契约不提供兼容层，变化明确记录。

## 6. Distribution, naming and releases

目标主分发是版本化 npm-compatible packages。Rslib 构建 React ESM、类型声明和
CSS；显式声明 exports、React peer dependencies、files 和 CSS entry。
验证 CSS import closure、tree shaking 与注册/CSS 等实际 side effects。
消费方不得编译库的 Tailwind 源码，也不得依赖源码 alias。

本轮仅准备本地构建/打包验证与版本、changelog、升级、release 流程。
**不执行 npm publish，不创建发布 tag/release，不配置自动发布，不提前改名。**
正式改名需统一核对 repository、package manifests/exports、内部依赖、文档示例、
Registry URLs、CI/artifact 名称及旧导入迁移方案，然后再安排首次发布。
API、tokens 和样式契约按 semver 管理；改名不等同于允许行为破坏。

Registry 不是核心组件的主分发机制。可保留配置、示例、模板、组合与 Agent
脚手架，优先引用 canonical packages。不维护 npm 与 Registry 的独立组件实现。
删除核心源码 Registry items，仅保留包配置与示例；记录新的接入方式。

## 7. Agent-native development

维护根 `AGENTS.md`、可移植 `skills/molcrafts-ui/SKILL.md`、基于 TS/Storybook
的文档，以及包含名称、用途、imports、示例和状态的组件目录。
Agent 工作流：先查现有组件，再读公共 API 与 stories，优先复用；采用语义 tokens
及既有组合方式；新 UI 依赖或 shadcn 默认样式需要合理依据；共享变更同步
更新 stories/docs；验证类型、构建、交互与视觉。

以版本控制中的静态文件和 CLI 为主。不建立自定义索引服务或 MCP server。
Storybook MCP 可以以后评估，不成为基础工作流前提。

## 8. Storybook and quality gates

Storybook 是主要开发环境。每个已迁移公共组件都有默认、全部支持的变体/尺寸、
light/dark、相关状态、可访问性行为和典型组合 stories；适合时启用 Autodocs。

质量检查覆盖类型与公共类型 exports、复杂行为的单元/interaction 测试、键盘、
可访问性、关键组件视觉回归、包构建和消费者接入。
独立 Rsbuild fixture 仅导入构建产物与已编译 CSS，不扫描库源码；另外通过本地
tarball 安装验证 exports/files/依赖闭包。真实产品验证另行以产品 PR 提供证据，
fixture 不能替代真实产品兼容验收。原生实现继续使用独立 HTML/浏览器验证。

## 9. Migration strategy

1. Audit and foundation：组件/API/依赖/token 审计，pnpm boundaries，Rslib，
   语义主题；移除旧入口，不加入兼容适配。
2. Component ownership：分批建立契约，迁移语义样式，保留有效 Radix，按需求
   采用 Base UI，一致 variants 与扩展点。
3. Documentation and Agent support：迁移 Storybook 入口，补 stories/catalog、
   AGENTS/Skill，建立 a11y/visual checks。
4. Distribution and integration：验证产物、独立 Rsbuild、真实产品迁移，准备版本
   与升级流程。实际发布放在未来改名及发布安排之后，不在当前授权范围。

具体 PR 顺序、原因、开发影响、退出条件见 roadmap。

## 10. Non-goals

不一次重设计所有组件；不替换全部 Radix；不新增样式框架；不自建 Registry
engine、MCP 或索引；不放产品路由、认证、SSR 或业务逻辑；不尝试跨运行时
渲染 React。Web Components 是已有独立实现，共用 tokens，不要求功能对等。

## 11. Acceptance criteria and evidence

| # | Criterion | Required evidence |
| --- | --- | --- |
| 1 | MolCrafts 拥有 tokens、主题、样式与 API | 宪法、tokens 契约、公共导出文档 |
| 2 | 迁移组件脱离默认 shadcn 设计约定 | 组件审查与明暗视觉对照 |
| 3 | 运行时主题一致且无需重建 | 全局/局部/portal/品牌切换 stories 与测试 |
| 4 | UI packages 经 Rslib 构建 | CI 产物、类型、CSS 与 exports 检查 |
| 5 | 独立 Rsbuild 消费无需源码扫描 | 构建产物及 tarball 消费验证 |
| 6 | 全部迁移公共组件有 Storybook 文档 | 按导出清单逐项覆盖，不以 story 总数替代 |
| 7 | Agent 无须了解 shadcn 就能发现 API | AGENTS、Skill、目录及可执行示例 |
| 8 | 相关类型、交互、a11y、视觉检查通过 | 对应批次的 CI 与基线证据 |
| 9 | 产品完成新入口迁移后功能正确 | 真实产品迁移 PR 与兼容检查；当前尚未验证 |
| 10 | 版本与升级流程可复现 | release/rename 文档及本地演练；不要求本轮发布 |

## 12. Implementation principles

Own the design. Reuse behavior. Use explicit migrations without compatibility shims. Publish once.
Keep Agents informed. Avoid premature infrastructure. Keep the system product-independent.
每批迁移必须记录完成范围与未完成项，不能以基础构建通过宣称全部重构完成。
