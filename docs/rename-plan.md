# molcrafts-design 命名与入口迁移

2026-10-10：用户确认三个 npm 包名和 MIT。仓库内名称、公开导入、依赖、Storybook、
Registry、消费者 fixture 与 portable Skill 已统一。外部 GitHub repository 尚未改名。

| Previous internal name | Canonical name | Source directory |
| --- | --- | --- |
| @molcrafts/tokens | @molcrafts/design-tokens | packages/tokens |
| @molcrafts/ui | @molcrafts/design | packages/ui |
| @molcrafts/web-components | @molcrafts/design-web-components | packages/web-components |
| skills/molcrafts-ui | skills/molcrafts-design | skills/molcrafts-design |

目录名称表达分层，不需要随着 npm name 复制或迁移源码。不存在旧包导出、npm aliases
或兼容 shim；产品直接更换 imports 与 CSS entries。以下名称尚未发布：

```tsx
import { Button, ThemeScope } from "@molcrafts/design";
import type { ProductTheme } from "@molcrafts/design-tokens";
import "@molcrafts/design/styles.css";
```

```ts
import { registerMolcraftsComponents } from "@molcrafts/design-web-components";
import "@molcrafts/design-web-components/theme.css";
```

纯 CSS 使用 `@molcrafts/design-tokens/runtime.css`。Registry setup/examples 引用同一包，
不是旧 core source items。普通应用暂通过 workspace 或本地 tarball 接入。

## 外部仓库改名时统一处理

目标 GitHub repository：`MolCrafts/molcrafts-design`，本次没有执行该外部改名。
准备实际改名 PR 时核对以下位置：

- 三个 manifests 的 repository URL/directory、homepage 和 bugs。
- registry.json 的 homepage 与实际 Registry hosting URL；不要假设已有新的 hosting。
- README、Skill、发布文档中的 GitHub links，以及 package README 的远程 docs links。
- Git remotes、CI 环境/权限、npm provenance/trusted-publisher 绑定与产品依赖记录。
- 各真实产品的新包安装、公开 imports、stylesheet 与锁文件；单独提交产品 PR。

包目录、CSS runtime token 名称、Fluent 原生标签及 registerMolcraftsComponents 函数不因
项目名变化而随意改名。历史 .claude specs 与 extraction matrix 保留历史名称，不能当作
当前指导。GitHub redirect 不替代产品 API 迁移或 npm 发布身份验证。

发布步骤与剩余条件见 [releasing](releasing.md)；当前仍 private，未发布。
