# MolCrafts 设计宪法 · Fluent 2

版本：v1.4，2026-10-10。适用于 molexp、molvis、molhub 的共享基础 UI。

## 1. 设计基线与来源

以 **当前发布的 Fluent UI React v9 / Fluent 2 Web** 为基线。核对版本：
`@fluentui/react-components` **9.74.9**；本仓用于生成 CSS 的官方
`@fluentui/react-theme` 固定为 **9.2.2**。采用其 `webLightTheme`、
`webDarkTheme` 的颜色、字体、圆角、阴影和动效 tokens。

参考：[Fluent 2](https://fluent2.microsoft.design/)、
[官方 tokens](https://github.com/microsoft/fluentui/tree/master/packages/tokens)、
[字体](https://fluent2.microsoft.design/typography)、
[层级](https://fluent2.microsoft.design/elevation)、
[动效](https://fluent2.microsoft.design/motion)。

保留工作正常的 React/Radix primitives。目标以版本化包为主分发，Registry
保留为可选集成入口；旧源码分发与同步流程已删除，不提供兼容层。工程边界遵循
[重构规范](design-system-refactoring-spec.md) 与 [roadmap](design-system-roadmap.md)。
共享 UI 的视觉规则由本宪法、MolCrafts-owned tokens 和 Storybook 示例共同定义。
上游 Fluent tokens 是审查后的参考输入，不替代 MolCrafts 对视觉契约的所有权。

原则：阅读优先、控件克制、层级明确、状态可辨。用中性色承载信息，品牌色
用于主要行动与选中指示。科学数据的可视化配色由产品单独管理。

## 2. 字体与信息密度

采用官方 Segoe UI 字体栈，平台原生字体作为回退；等宽字体采用 Consolas。
不从网络加载专有字体。中文由系统字体回退，必须保留清晰的混排与行高。

| 角色 | CSS 工具类 | 字号 / 行高 | 用途 |
|---|---|---|---|
| 次要元信息 | `text-micro` | 10 / 14px | 非必要的辅助元信息 |
| 辅助说明 | `text-label` | 12 / 16px | 字段说明、快捷键、badge |
| 正文 | `text-body` | 14 / 20px | 控件文字、表格、导航、段落 |
| 分组标题 | `text-body-lg` | 16 / 22px | 卡片、设置分组 |
| 弹窗标题 | `text-title` | 20 / 28px | 弹窗与主面板标题 |
| 页面标题 | `text-heading` | 24 / 32px | 页面主标题 |
| 展示标题 | `text-display` | 32 / 40px | 低密度介绍页 |

正文使用 400，标题和行动文字使用 600。必要信息至少 12px；设置标签和
导航采用 14px。标题行高跟随 tokens，不额外压成 `leading-none`。
采用句式大小写，左对齐正文，数字列右对齐并使用 `tabular-nums`。

| 密度 | 高度 | 约束 |
|---|---|---|
| Compact | 28px | MolCrafts 科学工作台的明确适配，仅用于高密度桌面工具栏 |
| Default | 32px | 默认按钮、输入、选择器，对齐 Fluent medium |
| Comfortable | 40px | 大按钮，对齐 Fluent large |
| Touch target | ≥44px | 触屏点击区域，必要时扩大命中区域 |

同一行控件保持同一密度。不要通过减小正文或压缩行高获得更高密度。

## 3. 布局、间距与形状

4px 为基础布局单位；2px 只用于紧凑内边距、描边和指示器。常用间距为
4、8、12、16、20、24、32px。相关控件之间 8px，字段组之间 16px，
页面区块之间 24px；卡片默认 16px 内边距，弹窗 24px。

| 角色 | Token | 圆角 |
|---|---|---|
| checkbox | `rounded-checkbox` | 2px |
| 按钮、输入、菜单项、tooltip | `rounded-control` | 4px |
| 卡片、面板 | `rounded-panel` | 8px |
| 弹窗、浮层 | `rounded-overlay` | 8px |
| 状态点、switch thumb、头像 | `rounded-full` | 圆形 |

使用 1px 边框建立结构。圆角不能随页面任意变化；组件覆盖应使用语义角色。
保留完整表头、表单标签和合理的滚动区域；宽度不足时重排布局。

## 4. 颜色与主题

所有组件使用语义 slots，明暗模式由同一套官方别名映射。**各产品独立拥有
primary 与 secondary 两组品牌色**，产品仓库分别提供明暗主题。默认 scaffold
以 Fluent Web 蓝色作为 primary、官方紫色 palette 作为 secondary；默认值
只是共享组件的预览基线，不替 molexp、molvis、molhub 决定品牌色。

| 角色 | MolCrafts slot | 官方来源 |
|---|---|---|
| 应用画布 | `background` | `colorNeutralBackground2` |
| 卡片、输入表面 | `surface` / `card` | `colorNeutralBackground1` |
| 浮层表面 | `popover` | `colorNeutralBackground1` |
| 主文字 | `foreground` | `colorNeutralForeground1` |
| 次要文字 | `muted-foreground` | `colorNeutralForeground2` |
| 辅助文字 | `subtle-foreground` | `colorNeutralForeground3` |
| 结构边框 | `border` | `colorNeutralStroke2` |
| 控件边框 / 底边 | `input` / `input-bottom` | `colorNeutralStroke1` / `colorNeutralStrokeAccessible` |
| 主要行动 | `primary` / `primary-hover` / `primary-pressed` | `colorBrandBackground` 系列 |
| 选中背景 / 文字 | `primary-muted` / `primary-muted-foreground` | `colorBrandBackground2` / `colorBrandForeground2` |
| 链接 | `primary-link` / `primary-link-hover` | `colorBrandForegroundLink` 系列 |
| 第二品牌色 | `secondary` / `secondary-muted` / `secondary-muted-foreground` | 默认官方 purple palette，产品独立覆盖 |
| 中性次要行动 | `neutral` / `neutral-foreground` | `colorNeutralBackground1` / `colorNeutralForeground1` |

每组品牌色提供实心背景、hover、pressed、实心背景上的 foreground、muted
背景和 muted-foreground；primary 另提供 link / link-hover。CSS 名称均以
`--` 开头，如 `--primary-hover`、`--secondary-foreground`。通过完整色阶
定义状态，不能只更换一个基础色后继续使用默认蓝色 hover 或白色文字。

primary 承载主要行动、选中和品牌链接；secondary 用于辅助品牌表达和产品
识别，不覆盖成功、失败、警告等语义色。`Button variant="secondary"` 仍表示
**中性次要行动**，使用 neutral slots，并不等于第二品牌色按钮。旧 accent / link 别名已删除；组件直接使用 primary 系列及 primary-link。

在产品根元素覆盖完整的 primary / secondary slots；局部主题容器使用
`className="mol-product-theme"`。React 直接读取当前作用域的语义 tokens，原生
控件在该作用域绑定官方 camelCase tokens。明暗选择器由产品维护。Storybook `Foundations/Product themes` 演示明暗
两套独立色组；其中自定义配色仅为示例。

品牌实心背景和链接文字是不同角色，尤其在暗色模式下必须分别映射。
不得使用浅色主题的色值覆盖暗色主题。不要在组件中写 hex 或任意透明度
来模拟选中状态；使用已有的 hover、pressed、selected slots。

## 5. 控件状态与交互

每个交互控件必须定义 default、hover、pressed、focus-visible、disabled。
表单还需要 invalid，选择控件还需要 checked/selected/indeterminate。

- 主要按钮：实心品牌色、白色文字；次要按钮：中性表面与清晰边框；ghost
  用于工具栏。一个行动区默认只有一个主要按钮。
- 输入框：中性表面、细边框和更清晰的底边，焦点时底边使用品牌色。
- 导航和 tabs：默认使用线形指示器；选中不只靠改变文字颜色。需要分段
  控件时显式选择 `TabsList variant="default"`。
- Badge 用于状态信息，不表现为可点击按钮；默认柔和填充，语义状态使用
  `success` / `warning` / `info` / `destructive`。
- 弹窗、菜单、popover 保留 Radix 的键盘交互、焦点管理和关闭行为。
  关闭按钮使用完整的控件命中区域，不把点击目标缩成图标大小。

## 6. 状态语义

状态词汇固定：draft、ready、queued、running、completed、failed、cancelled、
cached、warning。运行中采用蓝色，完成采用绿色，失败采用红色，警告采用
黄色；这些语义角色不能被产品品牌色重绑定。

使用淡色背景配可读的前景 tokens。状态必须同时有文字，必要时增加图标。
禁用态采用官方 disabled slots；禁用控件不触发行动。验证错误要提供文本
说明，并用 `aria-invalid` / `aria-describedby` 关联字段。

## 7. 层级与动效

| 层级 | 工具类 | Fluent token |
|---|---|---|
| 普通画布、分隔区 | 无阴影 | 表面与边框 |
| 卡片 | `shadow-card` | `shadow4` |
| 菜单、popover、tooltip | `shadow-popup` | `shadow8` |
| 弹窗、sheet | `shadow-overlay` | `shadow64` |

阴影由 ambient 与 key 两层组成，暗色模式使用官方更深的阴影颜色。
不要在每个区块上叠加相同的大阴影。弹窗遮罩使用 `overlay-scrim`。

hover/pressed 100ms，浮层进入 150ms，sheet 200ms。交互颜色采用官方
`curveEasyEase`，进入/退出采用官方减速/加速曲线。浮层只使用轻微缩放
与透明度，不使用弹跳。尊重 `prefers-reduced-motion`，减少动态效果时
关闭浮层、accordion、spinner 动画。加载仍通过可见文字表达。

## 8. 图标、内容与可访问性

统一使用微软官方 **`@fluentui/react-icons`**，本次核对并固定最新发布版本
**2.0.344**。操作图标默认采用 `Regular`，大小采用 16 / 20 / 24px；选中态
或状态点确有需要时使用对应 `Filled`，同一语境保持相同尺寸和视觉重量。
不混用 Lucide、emoji 或其他图标库。Registry 中使用图标的组件声明该依赖。

**纯图标按钮优先于带文字按钮**：工具栏、面板操作、常见新增/搜索/设置/
关闭操作默认使用 `Button size="icon"`（紧凑场景用 `icon-sm`）。每个按钮
必须有准确的 `aria-label`，图标设为 `aria-hidden`，并用 Tooltip 提供可见
说明；Tooltip 在悬停和键盘焦点时都能显示，不能作为唯一的可访问名称。
图标尺寸与按钮命中区域分别定义，触屏命中区域至少 44px。

难以用熟悉图标表达的操作、破坏性确认和需要明确结果的表单提交保留文字，
如“永久删除”“保存更改”“取消”。纯图标是优先规则，不以牺牲可理解性为代价。

正常正文对比度至少 4.5:1，大字至少 3:1。可辨识的控件边界和焦点指示器
至少 3:1。键盘焦点使用 `.mol-focus` 的内外双色指示器；高对比度系统
采用系统颜色。所有行为能用键盘完成，焦点返回触发控件。

文案使用明确的动作和对象。帮助信息解释用户能完成什么，错误说明如何
恢复。字体、主题和透明度不能成为唯一的信息编码。

## 9. 权威文件与生成流程

| 文件 | 责任 |
|---|---|
| `scripts/build-design-tokens.mjs` | 固定官方参考输入 → MolCrafts-owned 语义映射 |
| `fluent-theme.css` | 生成的明暗表面、行动与焦点颜色 |
| `fluent-foundation.css` | 生成的共享状态、动效和阴影颜色 |
| `constitution-theme.css` | 生成的字体、圆角、控件尺寸 |
| `constitution-base.css` | 共享行为、状态柔和背景、焦点、动画与阴影结构 |
| `packages/tokens/src/tokens.css` | Tailwind 语义映射 |
| Storybook `Foundations/Constitution` | 可以实际交互的视觉对照 |
| Storybook `Foundations/Product themes` | 产品 primary / secondary 色组与中性、状态色隔离 |

运行 `pnpm build:tokens` 更新生成文件；共享源位于 `packages/tokens/src`，
纯 CSS runtime 与 Tailwind 集成作为不同入口构建。React CSS 由 `pnpm build:ui` 编译。
CI 校验生成结果与提交文件一致。生成的三个文件不手动修改。

更新官方版本时，固定 `@fluentui/react-theme` 的具体版本，重新生成，
核对明暗主题与组件交互，记录版本和日期；不使用浮动 `latest` 依赖。

## 10. 产品接入与变更验收

React 消费方导入 `@molcrafts/ui/styles.css`，包含默认 tokens、编译 utility 和
preflight，无需扫描库源码。框架无关 CSS 使用 `@molcrafts/tokens/runtime.css`，
应用自有 Tailwind utility 可用 `@molcrafts/tokens/tailwind.css`。
产品提供完整 primary / secondary 品牌组；中性行动使用 neutral，状态色独立。
用户要求不向后兼容：旧 src 路径、单独 constitution CSS 公共入口、accent/link
别名、stock radius 别名、产品私有 cn 扩展与源码同步流程均已删除。
产品直接迁移到新入口，具体清单见 [迁移说明](workspace-migration.md)。

默认视觉保持已有 Fluent 2 基线：4px 控件圆角、14px 控件文字、40px 大控件、
8px 面板/弹窗、柔和状态 badge 和线形 tabs。API 所有权仍按 roadmap 分批落实。

PR 验收：类型检查、tokens 再生成、registry 再生成、Storybook 构建；
明暗模式与高对比度模式；键盘焦点、弹窗关闭、表单错误、加载和空状态；
正文与状态对比度；至少在桌面和窄屏检查一次。
此外检查两组品牌色的明暗状态、纯图标按钮的名称/Tooltip/键盘操作，以及
产品配色改变后中性次要行动和语义状态色保持一致。

Registry 只提供包样式接入与组合示例，不再分发核心源码。包显式声明图标依赖；
产品自行使用官方图标时也须在产品依赖中声明。

各产品页面的实际迁移通过独立产品 PR 完成。本仓提供共享基线和迁移契约。

## 11. Web Components 同源管理

`packages/web-components` 是框架无关的共享入口，基于核对时最新稳定的官方
`@fluentui/web-components` **3.1.3**。React 与 Web Components 服从同一宪法、
primary / secondary 色组、中性次要行动、Fluent 图标和可访问性规则。

Web Components 使用普通 CSS 和官方 camelCase token 映射，产品色组必须
能够继承进入 Shadow DOM；不要求消费方配置 Tailwind。图标采用官方
`@fluentui/svg-icons` **1.1.344**，与 React 图标保持同一 Regular 视觉语言。
减少动画须在 Shadow DOM 内生效，不能只修改宿主页面样式。

组件范围由 `components.json` 管理；生成类型、注册表与 Custom Elements
Manifest；Rslib/Rspack 构建 ESM 和独立浏览器包。新增组件应更新清单、文档、
Storybook 和浏览器验证。现阶段纳管 13 个官方标签，未纳管组件不得声称与
React registry 已达到功能对等。公开 API 遵循原生事件、属性和官方 slots/parts。

验收同时覆盖普通 HTML 的独立消费、异步重复注册、键盘操作和 Tooltip、
禁用、原生表单提交、品牌色/明暗、高对比度和减少动画。框架集成与 SSR
接入约束见 [Web Components 文档](../packages/web-components/README.md)。

## 运行时契约（P2）

CSS Custom Properties 是运行时真源；Tailwind 只映射同一份契约。
完整清单见 [token catalog](token-catalog.md)，主题 API 与作用域规则见
[theming](theming.md)，剩余组件样式工作见 [style audit](style-audit.md)。
React 使用 ThemeScope 管理模式、完整品牌与浮层目标；原生组件使用同一
`data-mol-theme` 模式。显式嵌套模式重置默认值，产品需要传入对应模式的品牌。
上游参考版本变更必须审查 owned 映射和视觉差异，不自动套用新版本。
