# 基线审计与当前实施状态

日期：2026-10-10。基线为 `7c4d9be`；当前完成范围见 [roadmap](design-system-roadmap.md)。
用户随后明确要求不向后兼容；本文件不再把旧 API 保留作为实施约束。

## 基线与当前边界

| Area | Audited baseline | Current implementation / remaining work |
| --- | --- | --- |
| Workspace | npm workspaces，仅有原生包 | pnpm 11.25.0、6 个 workspace projects、唯一 lockfile，依赖按 package 声明 |
| React | 根 src 下 30 primitives、3 blocks，源码分发 | 唯一实现迁移到 packages/ui；Rslib ESM、types、编译 CSS 和公开 exports；细化公共契约仍待逐批完成 |
| Tokens | 根 5 个 CSS 文件，Fluent 2 生成映射 | packages/tokens，独立纯 CSS runtime 与 Tailwind 入口；127 项生成 token 清单、类型/元数据、嵌套主题和浮层继承已实现 |
| Storybook | 根 .storybook，13 个 story 文件 | apps/storybook 通过构建后的公开包入口消费；33 个模块并非都有独立 stories |
| Registry | 35 个核心源码 items | 删除旧 items，仅 setup 与 button-example；引用 canonical packages |
| Web Components | 13 标签，独立构建、类型与浏览器测试 | 保留独立运行时；共享 CSS 从 tokens 生成，不再提交 tokens 副本 |
| Consumer | 未建立独立 React 产物消费验证 | 无 Tailwind 配置的 Rsbuild fixture；本地 tarball 在外部临时目录安装/构建 |
| Quality | 类型、生成一致性、原生浏览器、Storybook 构建 | 增加 exports/CSS/SSR、消费者行为与所有现有 stories 的 CI；加入主题页/浮层 axe、键盘、forced-colors/reduced-motion 与 3 张视觉基线；全库覆盖仍待逐批完成 |
| Products | 历史 extraction matrix 与源码同步路径 | 同步脚本已删除；没有修改或重验真实产品，需要产品迁移 PR |
| Release | private、无发布流程 | 三个包改为确认的 design 系列名称，MIT、Changesets、tarball/版本演练已配置；仍 private，无发布/外部改名/自动发布 |

React 源码、用途、exports 和 stories 链接见 [生成组件目录](component-catalog.md)。
13 个 story 文件包含基础组合示例，不能用文件数量证明公开 API/state 覆盖完整。
原生清单/API 与 React 不要求功能对等，见 [原生包文档](../packages/web-components/README.md)。

## 已处理风险与剩余事项

| Risk | Result / follow-up |
| --- | --- |
| Rslib 非 bundle 模式 flatten 目录或 JSX runtime 缺失 | 显式 outBase 与 React plugin，模块闭包和 SSR 检查覆盖 |
| CSS 只存在于 Storybook 编译 | UI 输出完整 CSS；独立消费者不配置 Tailwind、不扫描源码 |
| tokens 引用上游形成隐式设计依赖 | 固定输入版本并保留 owned 映射，reference.json 固定输入；生成元数据/清单；升级需审查 owned 映射与截图 |
| Registry/npm 两份组件实现 | 删除核心源码分发与旧 sync，Registry 只提供包配置/组合 |
| utils 依赖产品私有 scales | 删除产品专有扩展；产品自行迁移，不保留兼容 shim |
| 局部主题丢失于 portal | ThemeScope 为 8 类 React 浮层提供就近 host；嵌套模式/品牌热切换已验证；注意祖先 transform/overflow 限制 |
| 原生 CSS 副本漂移 | 共享 runtime 由 tokens 构建到 standalone theme.css；保留 reset/shadow/form 测试 |
| 真实产品迁移失败 | 本仓 fixture 不能证明真实产品接入，产品 PR 与测试仍待完成 |
| 改名遗漏入口或提前发布 | 最终包名/URL/版本/license 审核在后续阶段，当前不发布或重命名 |

## 下一阶段准备

- [x] 完整 foundation/semantic token 契约与主题/portal 验证。
- [ ] 首批组件 props、variants、sizes、states、refs 与扩展契约。
- [ ] 全部公共组件 stories/state coverage、a11y 和关键视觉回归。
- [ ] 至少一个真实产品的新入口接入与功能验证。
- [x] 确认 npm names/subpaths、MIT/第三方归属、alpha 版本方案和本地发布演练。
- [ ] 实际 npm 权限、外部仓库 URLs 改名和正式候选发布。

使用新入口见 [迁移说明](workspace-migration.md)；不提供旧源码、旧 CSS 别名或同步兼容层。
