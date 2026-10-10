# @molcrafts/design-web-components

MolCrafts 的框架无关 Fluent 2 入口。基于官方 `@fluentui/web-components` **3.1.3**，
采用 FAST Web Components；不依赖 React 或 Tailwind。与 React primitives 共用
设计宪法、产品 primary / secondary、明暗与无障碍验收规则。

此包目前通过 workspace 或构建后的 tarball 使用，尚未发布到 npm。

```bash
pnpm build:web-components              # 在仓库根目录运行，Rslib / Rspack
pnpm --filter @molcrafts/design-web-components pack
# 在消费项目安装生成的 tarball，然后导入以下入口
```

```ts
import '@molcrafts/design-web-components/theme.css';
import { registerMolcraftsComponents } from '@molcrafts/design-web-components';
await registerMolcraftsComponents();
```

或使用自动注册入口 `import '@molcrafts/design-web-components/register'`。
注册是异步的，重复调用安全；同页面存在其他版本的同名 Fluent 元素会明确
报错。保留官方 `fluent-*` 标签与属性/API，避免重复实现键盘、表单和 ARIA。

原生 HTML 可复制 `dist/` 到静态资源目录，直接加载，不需要 import map：

```html
<link rel="stylesheet" href="/ui/theme.css">
<script type="module" src="/ui/browser/browser.js"></script>
<fluent-button appearance="primary" type="button">Save changes</fluent-button>
<fluent-text-input name="name" required>Name</fluent-text-input>
```

ESM package 入口由消费方打包；`browser.js` 是包含运行时依赖的独立 ESM 包。
两种入口均以浏览器为运行环境。SSR 应在客户端挂载阶段动态导入和注册，
服务端只输出标签；不要在服务端执行包入口。

## 纳管范围

`components.json` 是组件和图标清单。当前管理 13 个标签：button、badge、
checkbox、switch、text-input、textarea、label、field、divider、spinner、
tab、tablist、tooltip（均为 `fluent-` 前缀）。清单生成注册表、TypeScript
标签类型、官方 API 的 Custom Elements Manifest 和构建资产。

这是一套独立的 Web Components API；React 的 `variant`、`onCheckedChange`
等 props 不直接映射到原生元素。使用官方 `appearance` 属性、元素属性和
原生 `input` / `change` / `click` 事件。尚未列入清单的组件不承诺与 React
registry 对等；扩展需补齐 Storybook、manifest 和浏览器验收。

## 主题和图标

`theme.css` 是普通 CSS，不含 Tailwind 指令。它导入共享颜色与状态，并把
primary、neutral、disabled、focus 映射到官方 camelCase tokens，让颜色
继承进入 Shadow DOM。生成的官方宿主样式保护控件不受页面 reset 影响，
Shadow DOM 内部样式仍由官方组件管理。产品在根元素或 `.mol-product-theme` 容器覆盖完整的
primary / secondary 明暗色组；具体契约见仓库的设计宪法。无须调用官方
`setTheme()`，避免它覆盖统一的主题契约。

`fluentIcons` 提供清单内官方 `@fluentui/svg-icons` **1.1.344** 的 Regular SVG
字符串，按生成流程内联分发，无 React 依赖。字符串包含 `aria-hidden` 和
`currentColor`，适合装饰性按钮图标。更多图标加入清单，重新生成。

```ts
import { fluentIcons } from '@molcrafts/design-web-components';
const add = document.createElement('fluent-button');
add.appearance = 'primary';
add.type = 'button';
add.iconOnly = true;
add.id = 'add-item';
add.setAttribute('aria-label', 'Add item');
add.innerHTML = fluentIcons.add; // 仅使用包提供的固定 SVG；用户内容使用 textContent。
document.body.append(add);
```

关联 `<fluent-tooltip anchor="add-item">Add item</fluent-tooltip>` 提供悬停和
键盘提示。工具栏优先纯图标操作；表单确认和含义不明确的行动保留文字。
标准高度 32px，small 适配 28px，large 40px；触屏命中区域至少 44px。
CSS tokens 不应依赖访问内部 Shadow DOM；使用公开属性与 `::part`。

文本输入框用默认 slot 提供标签：`<fluent-text-input>Name</fluent-text-input>`；
textarea 使用 `<span slot="label">Notes</span>`。只在宿主设置 `aria-label`
不能保证内部原生输入框获得名称。textarea 初始内容放在默认 slot，后续值
通过元素的 `value` 属性设置。`fluent-label` 提供视觉样式，不等同于原生 label。

## 框架接入

Vue 在构建配置中将 `fluent-` 标签视为自定义元素，例如：

```ts
// Vue 编译器 / vue-loader 的 compilerOptions（例如 Rsbuild 的 Vue 插件）
isCustomElement: (tag: string) => tag.startsWith('fluent-')
```

```vue
<fluent-text-input name="name" @input="onInput">Name</fluent-text-input>
```

Angular 在消费组件的 `schemas` 添加 `CUSTOM_ELEMENTS_SCHEMA`，使用原生
事件和 property binding；双向表单需消费方的 ControlValueAccessor 适配。
React 19 支持自定义元素，可用 `createElement('fluent-button', props)` 或消费方
自己的 JSX 声明；复杂原生事件用 ref / addEventListener 接入并清理监听器。
Svelte 和原生 HTML 直接使用标签。以上框架共用同一浏览器注册入口。

浏览器须支持 Custom Elements、Shadow DOM、ElementInternals / 表单关联元素；
tooltip 还使用现代 Popover / CSS anchor 能力，兼容回退由官方实现管理。

## 开发验收

```bash
pnpm generate:web-components
pnpm typecheck
pnpm build:web-components
pnpm exec playwright install chromium
pnpm test:web-components
pnpm build:storybook
```

Storybook 的 `Web Components/Foundations` 展示真实原生元素，React 仅作为现有
Storybook 的宿主。CI 验证生成文件、ESM 包、独立 HTML 包、重复注册、键盘
与 Tooltip、禁用、原生 FormData/提交、品牌色穿透、明暗、减少动画和高对比度。
构建导出 `custom-elements.json`，供 IDE 和其他 Web Components 工具消费。

共享颜色、几何与行为源位于 `packages/tokens`；构建时将其独立 runtime CSS
整合进本包 `theme.css`，不再维护共享 tokens 的源码副本。

MIT licensed. See LICENSE, NOTICE.md and THIRD_PARTY_NOTICES.md included in this archive.
Release preparation: https://github.com/MolCrafts/molcrafts-ui/blob/main/docs/releasing.md
