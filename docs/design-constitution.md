# MolCrafts 设计宪法 · Fluent 2

版本：v1，2026-10-10。适用于 molexp、molvis、molhub 的共享基础 UI。

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

保留现有 React/Radix primitives 与 shadcn 源码分发方式。共享 UI 的视觉
规则由本宪法、生成的 tokens 和 Storybook 示例共同定义。

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

所有组件使用语义 slots，明暗模式由同一套官方别名映射。默认 scaffold
使用 Fluent Web 蓝色；各产品可以整体重绑定品牌 slots。

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
| 主要行动 | `accent` / `accent-hover` / `accent-pressed` | `colorBrandBackground` 系列 |
| 选中背景 / 文字 | `accent-muted` / `accent-muted-foreground` | `colorBrandBackground2` / `colorBrandForeground2` |
| 链接 | `link` / `link-hover` | `colorBrandForegroundLink` 系列 |

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

现有 Lucide outline 图标保持统一，大小采用 16 / 20 / 24px；同一语境保持
相同线条与尺寸。只含图标的按钮必须有可访问名称。不能混用 emoji、填充
图标和不同笔画来表达同一类操作。

正常正文对比度至少 4.5:1，大字至少 3:1。可辨识的控件边界和焦点指示器
至少 3:1。键盘焦点使用 `.mol-focus` 的内外双色指示器；高对比度系统
采用系统颜色。所有行为能用键盘完成，焦点返回触发控件。

文案使用明确的动作和对象。帮助信息解释用户能完成什么，错误说明如何
恢复。字体、主题和透明度不能成为唯一的信息编码。

## 9. 权威文件与生成流程

| 文件 | 责任 |
|---|---|
| `scripts/build-design-tokens.mjs` | 官方 tokens → 稳定的 MolCrafts 语义映射 |
| `fluent-theme.css` | 生成的明暗表面、行动与焦点颜色 |
| `fluent-foundation.css` | 生成的共享状态、动效和阴影颜色 |
| `constitution-theme.css` | 生成的字体、圆角、控件尺寸 |
| `constitution-base.css` | 共享行为、状态柔和背景、焦点、动画与阴影结构 |
| `tokens.css` | 完整导入入口与 Tailwind 语义映射 |
| Storybook `Foundations/Constitution` | 可以实际交互的视觉对照 |

运行 `npm run build:tokens` 更新生成文件，再运行 `npm run build:registry`。
CI 校验生成结果与提交文件一致。生成的三个文件不手动修改。

更新官方版本时，固定 `@fluentui/react-theme` 的具体版本，重新生成，
核对明暗主题与组件交互，记录版本和日期；不使用浮动 `latest` 依赖。

## 10. 产品接入与变更验收

新消费方导入 `tokens.css`，再叠加产品品牌映射。已经维护产品表面映射的
应用导入 `constitution-base.css` 和 `constitution-theme.css`，并提供新的
`surface`、`link`、`accent-pressed`、`accent-muted`、focus、disabled 等
语义 slots。base 相邻目录必须有 `fluent-foundation.css`。同步脚本会一起
复制该文件。Registry 的 tokens item 包含完整的五个 CSS 文件。

此次视觉调整：控件圆角 6→4px、正文 13→14px、大控件 36→40px、弹窗
圆角 10→8px、badge 默认改为柔和填充、tabs 默认改为线形指示器。组件
props 保持兼容。产品升级时检查工具栏密度、卡片间距、表格换行和自定义
主题，避免保留与新 tokens 冲突的旧值。

PR 验收：类型检查、tokens 再生成、registry 再生成、Storybook 构建；
明暗模式与高对比度模式；键盘焦点、弹窗关闭、表单错误、加载和空状态；
正文与状态对比度；至少在桌面和窄屏检查一次。

各产品页面的实际迁移通过独立产品 PR 完成。本仓提供共享基线和迁移契约。
