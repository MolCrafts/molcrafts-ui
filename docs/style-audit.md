# P2 样式审计

2026-10-10，canonical source 为 packages/ui 与 packages/tokens。用户要求不向后兼容；
旧色彩 alias、源码复制及产品私有 merge scales 已在 P1 删除。

## 已落实

- React 组件未发现 hex/rgb 颜色、默认 red/blue/slate/zinc/gray utility 色阶或新的图标库。
- 共享颜色使用 MolCrafts semantic roles；品牌、中性行动与状态族分离。
- geometry/type utility 现在读运行时 CSS，支持 scope 下的 foundation 变化。
- 全部 8 类浮层挂到最近 ThemeScope，模式/品牌变更在打开状态下立即生效。
- 明暗状态 alias 在局部作用域重新绑定；原生官方映射也支持同一 data-mol-theme 属性。
- tokens 补充 border/focus/spacing/font-weight foundation，并生成 machine-readable catalog。

## 需要在 P3 按组件继续处理

| Pattern | Assessment / next action |
| --- | --- |
| `top-1/2`、translate、Radix available-height/transform-origin、drag pixel values | 行为/定位数据，不当作任意设计色值；保留成熟 primitive 与布局行为 |
| Sheet 的 w-3/4/max-w-sm、Dialog 的 sm:max-w-lg、Popover 的 w-72 | 当前仍是通用 Tailwind 布局，后续 formal size variants 应统一其公开尺寸契约 |
| Switch/Slider/Checkbox 的 size 与 spacing units | 共享 spacing 已归 MolCrafts；后续验证尺寸、touch hit area 和状态契约 |
| disabled opacity、部分 hover alpha/ring alpha | 不同控件状态仍需在 P3 统一，不以 P2 的主题测试替代组件状态完整验收 |
| spinner ring 尺寸与 overlay scale 的 CSS 常量 | 目前位于共享 CSS；若作为组件 customization contract 暴露，需随 P3 正式说明 |
| 原生上游 CSS 中的内部数值 | 属于成熟独立运行时；只通过公开 slots/parts 与共享 tokens 管理，不声称 React API/视觉全面对等 |

P2 验证范围是主题/关键组合与基础质量门禁，并未完成全部 33 个组件的公开契约、
所有交互状态或完整视觉基线。完整进度见 roadmap。
