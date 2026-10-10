# Tokens 与主题契约

Contract v1 · 2026-10-10。完整默认值见 [生成 token catalog](token-catalog.md)。
CSS Custom Properties 是运行时真源，metadata 描述默认值；React 类型不依赖具体应用。
MolCrafts 拥有语义名称、映射、默认值与升级决策。Fluent 2 是固定版本的参考输入。

## 入口与分层

| Entry | Purpose |
| --- | --- |
| `@molcrafts/design-tokens/runtime.css` | 扁平纯 CSS：颜色、字体、几何、状态、focus、motion、elevation |
| `@molcrafts/design-tokens/tailwind.css` | 可选 Tailwind v4 映射，消费同一运行时变量 |
| `@molcrafts/design-tokens` | 框架无关 ProductTheme/BrandPalette/ThemeMode 类型及 tokenContract 元数据 |
| `@molcrafts/design-tokens/contract.json` | 构建出的 machine-readable 默认 token 清单 |
| `@molcrafts/design/styles.css` | tokens、全部 React utility 和 preflight；React 消费方通常只需该入口 |

Foundation 包括 Segoe UI 字体栈、字号/行高/字重、4px spacing unit、语义 control/
layout sizes、border/focus 宽度与 offset、圆角、阴影和 motion。Semantic roles 包括
background/surface/foreground/border、完整 primary/secondary、neutral/muted、status、
hover/pressed/disabled/focus。颜色角色按用途使用，不能把品牌色替换为状态色。
Tailwind geometry 与 typography utilities 读取实际 CSS 变量，而不是把默认值烘焙进 utility。

## Plain CSS 与作用域

```html
<section data-mol-theme="dark" class="mol-product-theme">
  <!-- plain HTML / Web Components -->
  <section data-mol-theme="light">独立浅色区域</section>
</section>
```

`.dark` 可选择全局暗色；`data-mol-theme="light|dark"` 在任意根、容器或原生 host
选择完整主题。显式模式重置该作用域的默认品牌、状态与 foundation，支持 light-in-dark
及 dark-in-light。省略模式属性继承父级。CSS 中对状态 alias、阴影和 motion 的衍生值
在主题/产品作用域重新绑定，不继承上层已计算的柔和背景。

纯 CSS 主题不能自动搬运到外部 DOM。原生浮层若挂到作用域外，需要产品在其目标
上选择同一主题。共享 Web Components 当前使用自己的 Shadow DOM，官方 camelCase
与 MolCrafts roles 在主题/产品作用域绑定；不要求 Tailwind 或 React。

## React ThemeScope

```tsx
import { ThemeScope, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Button } from "@molcrafts/design";
import type { ProductTheme, ThemeMode } from "@molcrafts/design-tokens";
import "@molcrafts/design/styles.css";

// lightBrand/darkBrand are the product's complete, contrast-checked ProductTheme objects.
function ProductArea({ mode, lightBrand, darkBrand }: {
  mode: ThemeMode; lightBrand: ProductTheme; darkBrand: ProductTheme;
}) {
  return <ThemeScope theme={mode} brand={mode === "dark" ? darkBrand : lightBrand}>
    <Dialog><DialogTrigger asChild><Button>Open details</Button></DialogTrigger>
      <DialogContent><DialogTitle>Details</DialogTitle><DialogDescription>Product-themed content.</DialogDescription></DialogContent>
    </Dialog>
  </ThemeScope>;
}
```

- `theme?: "light" | "dark"` 是受控模式；省略时继承周围 CSS，组件不管理业务状态。
- `brand?: ProductTheme` 包含两个完整品牌族。显式模式且未传 brand 时使用该模式的
  默认 Fluent 预览品牌；需要保留产品品牌时显式传对应的品牌对象。
- 支持 div 原生属性、React 19 ref、children、className 与 style。style 可定制有文档的
  语义 slots；产品数据和验证逻辑不属于 ThemeScope。
- 子组件的 dialog/alert-dialog/sheet/popover/tooltip/select/dropdown/context-menu portal
  默认挂到最近 scope 的专用 host，自动继承完整 tokens 与用户 CSS overrides。
  外层无 ThemeScope 时保持默认 document body 挂载。
- host 不参与布局；SSR 只输出主题与普通子内容，portal 等待 client host 挂载，不访问
  document、读 computed styles 或同步复制主题。首次渲染不短暂挂到错误的 body 主题。
- Modal 的键盘关闭、focus trap/return 与既有成熟 primitives 继续负责。
- Portal 保留 DOM scope，因此 scope 祖先的 transform、contain、overflow 等 CSS 仍可能
  改变浮层定位/裁剪。将 ThemeScope 放在这些容器之外；不要用大幅 DOM selectors 修补。
  显式使用底层 portal container 时，消费方负责目标的主题及定位。

## 产品色组

| CSS family | Typed field | Role |
| --- | --- | --- |
| `--primary`, `--secondary` | background | 实心品牌行动/表达 |
| `--*-hover`, `--*-pressed` | hover / pressed | 交互状态 |
| `--*-foreground` | foreground | 实心背景上的文字/图标 |
| `--*-muted`, `--*-muted-foreground` | muted / mutedForeground | 柔和选中及品牌提示 |
| `--primary-link`, `--primary-link-hover` | primary.link / linkHover | 与实心背景分离的可读链接 |

`ProductTheme.primary` 为 PrimaryPalette，`secondary` 为 BrandPalette，所有列出的
fields 必须提供；不会猜测缺失色阶。明暗品牌对象可以有不同值，产品负责 hover、pressed、
link、muted 等实际组合的对比度。Brand 只改变品牌族；neutral actions 和 success/warning/
danger/info 保持共享。Button variant="secondary" 是中性次要行动，不等于第二品牌色按钮。

文本通常至少 4.5:1，较大文本 3:1，焦点/必要控件边界 3:1；不能只用颜色表达状态。
icon-only 行动有准确名称和可见说明。没有旧 accent/link、stock radius 或产品私有 cn 别名。

## 环境状态与定制边界

`prefers-reduced-motion` 禁用共享 spinner/overlay/accordion 动画并把交互 duration
降到 0，仍保留可访问状态。`forced-colors` 使用系统 Highlight/ButtonText 等，而不是
强制保持品牌色。焦点的 focus-width/offset、ring/focus-inner 共同建立指示器。

默认 control 为 32px、compact 28px、comfortable 40px、touch target 至少 44px；
默认 control radius 4px、panel/overlay 8px、checkbox 2px。改变 foundation 会影响所有
依赖它的组件，属于受版本管理的样式契约；不是随页面任意改变控件密度的建议。
组件 variants/slots 优先于广泛 DOM overrides；不要随意增加单组件 token。

## 上游升级与验证

`packages/tokens/reference.json` 记录参考 package/version。生成器会拒绝依赖版本与
记录不一致的升级。修改 owned mappings 或上游版本时：

1. 核对稳定版与变化，更新固定依赖和 reference 记录，说明接受/拒绝的视觉变化。
2. `pnpm build:tokens` / `pnpm build:packages` 更新 CSS、catalog 和原生映射。
3. 验证 nested light/dark、完整品牌、所有 overlay families、键盘、forced-colors 和 reduced-motion。
4. `pnpm build:consumer && pnpm test:consumer` 检查 a11y/contrast 与截图；再运行 Storybook 与原生测试。
5. 如有预期视觉变更，在 Linux 上使用 lockfile 对应 Playwright Chromium 更新截图并审查。
   CI 不自动更新基线；不能为让测试通过而跳过颜色或 axe 规则。

原始 token 数值只出现在 tokens 真源或已文档化的衍生规则中。CSS metadata 不引入 React、
primitives、Fluent runtime dependency，也不要求主题切换时重新编译。
