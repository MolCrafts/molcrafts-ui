# MolCrafts Design：发包前准备与发布流程

2026-10-10 · 当前状态：仅本地演练，三个包仍为 private，未发布、未创建 tag/release。
用户已选择 `@molcrafts/design` 系列包名与 MIT。GitHub 仓库仍是
[MolCrafts/molcrafts-ui](https://github.com/MolCrafts/molcrafts-ui)，外部改名另行处理。
机器可读计划见 [release/plan.json](../release/plan.json)。

## 包与发布边界

| Package | Content | Public entries |
| --- | --- | --- |
| `@molcrafts/design-tokens` | 框架无关 tokens、类型与元数据 | root、runtime.css、tailwind.css、contract.json |
| `@molcrafts/design` | React 19 组件与已编译 CSS | root、utils、styles.css |
| `@molcrafts/design-web-components` | 独立原生组件、注册、CSS、manifest 与 browser bundle | root、register、theme.css、custom-elements.json、browser.js |

root、Storybook 与消费者 fixture 不发布。三个分发包暂用统一版本，确保共享主题
契约可以按同一版本整组接入；Changesets fixed group 管理这一规则，apps 被排除。
包都是 ESM；React 为 peer dependency。消费者无需构建库的 Tailwind 源码。
原生 entry 在浏览器中加载，不承诺 Node/SSR 直接执行或 React API 对等。

当前工作区版本是未发布的 `0.0.1`。首发计划是 `0.1.0-alpha.0`、npm `alpha` channel，
不是 stable/latest。本次没有改变实际版本，也没有进入工作区 prerelease 模式。
alpha 表示 API/样式仍在逐批完善；P3/P4 与真实产品验证没有因打包通过而完成。

## 当前可重复演练

使用 Node 24+、pnpm 11.25.0 和 frozen lockfile：

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm release:status
pnpm prepare:release
pnpm build:consumer
pnpm exec playwright install chromium
pnpm test:consumer
pnpm test:web-components
pnpm build:storybook
pnpm test:storybook
```

`prepare:release` 构建三个包并验证 exports/CSS/SSR，然后执行以下步骤：

1. 在临时 workspace 中调用官方 Changesets CLI，演练 `pre enter alpha` 与 `version`。
   核对三个 alpha 版本、生成 changelogs、apps 不升版；不修改当前版本，不创建 tags。
2. 用 `pnpm pack` 生成三个真实 tarball，解包检查 files/exports、许可证、来源元数据、
   dependency rewriting，并记录 SHA-256 与文件清单。
3. 在仓库外临时目录安装三个 tarball，使用其公开类型和 CSS，执行 TypeScript
   及 React/原生两个 Rsbuild entry 构建；没有库源码访问或 Tailwind 配置。

`release-artifacts/` 被 gitignore，包含 `report.json`、`version-plan.json`、三个 tarball
以及 `changelogs/` 预览。**当前 tarball 仍是 0.0.1 演练产物，不能当作 alpha 发布候选。**
报告记录提交与工作区是否 dirty。CI 上传对应提交的演练产物，不执行 publishing。
独立消费需要 npm 网络读取既有外部依赖，但不会写 npm registry 或读取发布凭据。

## 修改与版本记录

共享 API、token/样式契约或分发文件变更时运行 `pnpm changeset`，描述具体行为
和消费方影响。文档/开发工具等不影响分发契约的修改不强制制造包版本。
`pnpm release:status` 使用 `origin/main` 的提交历史进行只读检查；浅克隆应先补齐历史，
CI 使用完整 fetch。`pnpm release:version` 会改 manifests 和各包 CHANGELOG，
只在实际 release branch 使用。不要为本次准备执行它。

稳定版本遵循 semver：破坏性公共 API/样式契约改变 major，新能力 minor，修复 patch。
在 0.x 阶段，破坏性变化至少提高 minor 并记录直接迁移方法；alpha 每次发布也必须
记录变化。没有旧包名、旧 token 或源码同步的兼容 shim，不复用旧包名发布同一实现。
初始 changeset 描述已完成的基础，不宣称全部组件契约或产品接入已验收。

## 授权与第三方来源

根与三个包携带 MIT LICENSE；MolCrafts 授权不覆盖第三方版权。
React NOTICE 保留 shadcn/ui 衍生来源及 Microsoft Fluent attribution；tokens NOTICE
保留官方 token 来源；原生 NOTICE 与 THIRD_PARTY_NOTICES 包含官方 tokens/icons、
Fluent/FAST 与保守依赖闭包的授权文本，包括 Apache-2.0、0BSD 条款。
`pnpm build:notices` 从安装的固定依赖生成完整文本；缺失未知来源授权会使生成失败。
React JS 的 npm runtime dependencies 不被打包，仍携带自身上游授权。
不分发 Segoe 字体文件；字体栈只使用已安装系统字体，官方字体/assets 条款仍适用。

## 尚未完成的发布条件

- 首发所选公共组件的 API、states、stories 和升级说明完成审查；其余范围明确标记。
- 至少一个真实 MolCrafts 产品使用新 imports/CSS，并有功能验证证据。
- 在明确的发布任务中核对 npm scope 所有权、三个名称与发布账号权限；选包名不等于取得权限。
- 确认 GitHub 外部改名时间，统一 repository/homepage/bugs、Registry URL、docs 与产品链接。
- 审查真实 alpha manifests/changelogs 和干净提交上的候选 tarball；确认发布内容、channel 与来源。

这些是 [roadmap](design-system-roadmap.md) 中未完成的事项，不在本次演练中自动跳过。

## 后续实际发布任务

以下步骤描述未来流程，不是本次授权的动作：

1. 从全绿 main 建立 release branch，确认首发范围和渠道；用 Changesets `pre enter alpha`
   与 `release:version` 生成实际版本/changelogs，更新 lockfile。
2. 仅把三个分发包的 private 改为 false；root/apps 保持 private。准备期的
   `prepare:release` 会拒绝非 private 包，应在 release PR 将检查升级为明确的 candidate
   检查，而不是跳过 exports、许可证、依赖或消费验证。
3. 完成候选构建、公开类型、a11y/视觉、原生、tarball、真实产品检查；review 并合并 release PR。
4. 发布操作者确认精确提交、版本与 alpha tag。先发布 tokens，再发布 React 与原生包。
   发布后以 registry 上的实际版本重新安装验证，不以本地 workspace 代替。
5. 验证后记录发布 tag/release、changelog 与包链接。未来可另行配置 npm Trusted Publishing；
   当前没有 publish command、发布 workflow、token secret 或自动 tag/release。

已发布版本不能覆盖重发。失败时记录已成功的包与版本，完成其余包或发布修复版本，
不要修改既有 tarball。产品回退到上一组明确版本；存在严重问题时由发布操作者审查
调整 dist-tag 或 deprecate。首发没有上一个稳定组，不承诺自动回滚至旧源码。
