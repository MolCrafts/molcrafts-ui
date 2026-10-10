# Design token catalog

由 `pnpm build:tokens` 从实际 runtime CSS 生成。CSS Custom Properties 是运行时真源，
catalog 仅描述默认值，不在运行时写入主题。产品定制、状态与升级规则见 [主题契约](theming.md)。

固定 Fluent 参考：@fluentui/react-theme 9.2.2；MolCrafts contract v1。

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--background` | semantic colors | `#fafafa` | `#1f1f1f` |
| `--foreground` | semantic colors | `#242424` | `#ffffff` |
| `--surface` | semantic colors | `#ffffff` | `#292929` |
| `--card` | semantic colors | `#ffffff` | `#292929` |
| `--card-foreground` | semantic colors | `#242424` | `#ffffff` |
| `--popover` | semantic colors | `#ffffff` | `#292929` |
| `--popover-foreground` | semantic colors | `#242424` | `#ffffff` |
| `--muted` | semantic colors | `#f5f5f5` | `#141414` |
| `--muted-foreground` | semantic colors | `#424242` | `#d6d6d6` |
| `--subtle-foreground` | semantic colors | `#616161` | `#adadad` |
| `--border` | semantic colors | `#e0e0e0` | `#525252` |
| `--input` | semantic colors | `#d1d1d1` | `#666666` |
| `--input-bottom` | semantic colors | `#616161` | `#adadad` |
| `--input-hover` | semantic colors | `#c7c7c7` | `#757575` |
| `--neutral` | semantic colors | `#ffffff` | `#292929` |
| `--neutral-foreground` | semantic colors | `#242424` | `#ffffff` |
| `--interactive` | semantic colors | `#f5f5f5` | `#3d3d3d` |
| `--interactive-pressed` | semantic colors | `#e0e0e0` | `#1f1f1f` |
| `--interactive-foreground` | semantic colors | `#242424` | `#ffffff` |
| `--primary` | semantic colors | `#0f6cbd` | `#115ea3` |
| `--primary-hover` | semantic colors | `#115ea3` | `#0f6cbd` |
| `--primary-pressed` | semantic colors | `#0c3b5e` | `#0c3b5e` |
| `--primary-foreground` | semantic colors | `#ffffff` | `#ffffff` |
| `--primary-muted` | semantic colors | `#ebf3fc` | `#082338` |
| `--primary-muted-foreground` | semantic colors | `#115ea3` | `#62abf5` |
| `--primary-link` | semantic colors | `#115ea3` | `#479ef5` |
| `--primary-link-hover` | semantic colors | `#0f548c` | `#62abf5` |
| `--secondary` | semantic colors | `#5c2e91` | `#9470bd` |
| `--secondary-muted` | semantic colors | `#c6b1de` | `#341a51` |
| `--secondary-muted-foreground` | semantic colors | `#341a51` | `#c6b1de` |
| `--ring` | border / focus | `#000000` | `#ffffff` |
| `--focus-inner` | border / focus | `#ffffff` | `#000000` |
| `--disabled-background` | semantic colors | `#f0f0f0` | `#141414` |
| `--disabled-foreground` | semantic colors | `#bdbdbd` | `#5c5c5c` |
| `--disabled-border` | semantic colors | `#e0e0e0` | `#424242` |
| `--tooltip-background` | semantic colors | `#292929` | `#ffffff` |
| `--tooltip-foreground` | semantic colors | `#ffffff` | `#242424` |
| `--overlay-scrim` | semantic colors | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.5)` |
| `--secondary-foreground` | semantic colors | `#ffffff` | `#000000` |
| `--secondary-hover` | semantic colors | `color-mix(in srgb, var(--secondary), black 10%)` | `color-mix(in srgb, var(--secondary), white 10%)` |
| `--secondary-pressed` | semantic colors | `color-mix(in srgb, var(--secondary), black 20%)` | `color-mix(in srgb, var(--secondary), white 20%)` |
| `--spacing` | spacing / sizing | `0.25rem` | `0.25rem` |
| `--border-width-default` | border / focus | `1px` | `1px` |
| `--focus-width` | border / focus | `2px` | `2px` |
| `--focus-offset` | border / focus | `2px` | `2px` |
| `--font-weight-normal` | typography | `400` | `400` |
| `--font-weight-semibold` | typography | `600` | `600` |
| `--font-sans` | typography | `'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif` | `'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif` |
| `--font-mono` | typography | `ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace` | `ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace` |
| `--text-micro` | typography | `10px` | `10px` |
| `--text-micro--line-height` | typography | `14px` | `14px` |
| `--text-label` | typography | `12px` | `12px` |
| `--text-label--line-height` | typography | `16px` | `16px` |
| `--text-body` | typography | `14px` | `14px` |
| `--text-body--line-height` | typography | `20px` | `20px` |
| `--text-body-lg` | typography | `16px` | `16px` |
| `--text-body-lg--line-height` | typography | `22px` | `22px` |
| `--text-title` | typography | `20px` | `20px` |
| `--text-title--line-height` | typography | `28px` | `28px` |
| `--text-heading` | typography | `24px` | `24px` |
| `--text-heading--line-height` | typography | `32px` | `32px` |
| `--text-display` | typography | `32px` | `32px` |
| `--text-display--line-height` | typography | `40px` | `40px` |
| `--radius-control` | radius | `4px` | `4px` |
| `--radius-panel` | radius | `8px` | `8px` |
| `--radius-overlay` | radius | `8px` | `8px` |
| `--radius-checkbox` | radius | `2px` | `2px` |
| `--spacing-control-compact` | spacing / sizing | `1.75rem` | `1.75rem` |
| `--spacing-control` | spacing / sizing | `2.5rem` | `2.5rem` |
| `--spacing-control-comfortable` | spacing / sizing | `3rem` | `3rem` |
| `--spacing-toolbar-compact` | spacing / sizing | `2.5rem` | `2.5rem` |
| `--spacing-toolbar` | spacing / sizing | `3rem` | `3rem` |
| `--spacing-statusbar` | spacing / sizing | `1.75rem` | `1.75rem` |
| `--spacing-touch-target` | spacing / sizing | `2.75rem` | `2.75rem` |
| `--spacing-menu` | spacing / sizing | `8rem` | `8rem` |
| `--spacing-dialog-sm` | spacing / sizing | `24rem` | `24rem` |
| `--spacing-dialog-md` | spacing / sizing | `30rem` | `30rem` |
| `--spacing-dialog-lg` | spacing / sizing | `34rem` | `34rem` |
| `--spacing-dialog-scroll` | spacing / sizing | `80vh` | `80vh` |
| `--spacing-overlay-viewport` | spacing / sizing | `calc(100% - 2rem)` | `calc(100% - 2rem)` |
| `--ease-standard` | motion | `var(--motion-ease)` | `var(--motion-ease)` |
| `--motion-fast` | motion | `100ms` | `100ms` |
| `--motion-base` | motion | `150ms` | `150ms` |
| `--motion-slow` | motion | `200ms` | `200ms` |
| `--motion-ease` | motion | `cubic-bezier(0.33,0,0.67,1)` | `cubic-bezier(0.33,0,0.67,1)` |
| `--motion-enter` | motion | `cubic-bezier(0,0,0,1)` | `cubic-bezier(0,0,0,1)` |
| `--motion-exit` | motion | `cubic-bezier(1,0,1,1)` | `cubic-bezier(1,0,1,1)` |
| `--neutral-shadow-ambient` | elevation | `rgba(0,0,0,0.12)` | `rgba(0,0,0,0.24)` |
| `--neutral-shadow-key` | elevation | `rgba(0,0,0,0.14)` | `rgba(0,0,0,0.28)` |
| `--status-draft` | status | `#616161` | `#adadad` |
| `--status-ready` | status | `#424242` | `#d6d6d6` |
| `--status-queued` | status | `#004377` | `#a9d3f2` |
| `--status-running` | status | `#0078d4` | `#5caae5` |
| `--status-completed` | status | `#107c10` | `#107c10` |
| `--status-failed` | status | `#d13438` | `#d13438` |
| `--status-failed-hover` | status | `#bc2f32` | `#bc2f32` |
| `--status-cancelled` | status | `#616161` | `#adadad` |
| `--status-cached` | status | `#341a51` | `#c6b1de` |
| `--status-warning` | status | `#fde300` | `#fde300` |
| `--status-ready-foreground` | status | `#424242` | `#d6d6d6` |
| `--status-running-foreground` | status | `#004377` | `#a9d3f2` |
| `--status-completed-foreground` | status | `#0e700e` | `#54b054` |
| `--status-failed-foreground` | status | `#bc2f32` | `#e37d80` |
| `--status-warning-foreground` | status | `#817400` | `#feee66` |
| `--constitution-surface` | semantic colors | `var(--card, var(--background, #ffffff))` | `var(--card, var(--background, #ffffff))` |
| `--motion-progress-spin` | motion | `850ms` | `850ms` |
| `--motion-progress-pulse` | motion | `1200ms` | `1200ms` |
| `--default-transition-duration` | motion | `var(--motion-base)` | `var(--motion-base)` |
| `--default-transition-timing-function` | motion | `var(--motion-ease)` | `var(--motion-ease)` |
| `--status-running-soft` | status | `color-mix(in srgb, var(--status-running) 12%, var(--constitution-surface))` | `color-mix(in srgb, var(--status-running) 12%, var(--constitution-surface))` |
| `--status-completed-soft` | status | `color-mix(in srgb, var(--status-completed) 12%, var(--constitution-surface))` | `color-mix(in srgb, var(--status-completed) 12%, var(--constitution-surface))` |
| `--status-failed-soft` | status | `color-mix(in srgb, var(--status-failed) 10%, var(--constitution-surface))` | `color-mix(in srgb, var(--status-failed) 10%, var(--constitution-surface))` |
| `--status-warning-soft` | status | `color-mix(in srgb, var(--status-warning) 14%, var(--constitution-surface))` | `color-mix(in srgb, var(--status-warning) 14%, var(--constitution-surface))` |
| `--destructive` | status | `var(--status-failed)` | `var(--status-failed)` |
| `--destructive-foreground` | status | `#ffffff` | `#ffffff` |
| `--success` | status | `var(--status-completed)` | `var(--status-completed)` |
| `--success-foreground` | status | `var(--status-completed-foreground)` | `var(--status-completed-foreground)` |
| `--success-soft` | status | `var(--status-completed-soft)` | `var(--status-completed-soft)` |
| `--warning` | status | `var(--status-warning)` | `var(--status-warning)` |
| `--warning-foreground` | status | `var(--status-warning-foreground)` | `var(--status-warning-foreground)` |
| `--warning-soft` | status | `var(--status-warning-soft)` | `var(--status-warning-soft)` |
| `--info` | status | `var(--status-running)` | `var(--status-running)` |
| `--info-foreground` | status | `var(--status-running-foreground)` | `var(--status-running-foreground)` |
| `--info-soft` | status | `var(--status-running-soft)` | `var(--status-running-soft)` |
| `--elevation-card` | elevation | `0 0 2px var(--neutral-shadow-ambient), 0 2px 4px var(--neutral-shadow-key)` | `0 0 2px var(--neutral-shadow-ambient), 0 2px 4px var(--neutral-shadow-key)` |
| `--elevation-popup` | elevation | `0 0 2px var(--neutral-shadow-ambient), 0 4px 8px var(--neutral-shadow-key)` | `0 0 2px var(--neutral-shadow-ambient), 0 4px 8px var(--neutral-shadow-key)` |
| `--elevation-dialog` | elevation | `0 0 8px var(--neutral-shadow-ambient), 0 32px 64px var(--neutral-shadow-key)` | `0 0 8px var(--neutral-shadow-ambient), 0 32px 64px var(--neutral-shadow-key)` |

媒体查询中的 reduced-motion 与 forced-colors 覆盖见纯 CSS runtime；不得用 catalog 默认值覆盖环境偏好。
