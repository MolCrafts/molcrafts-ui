# React 组件目录

由 `pnpm build:catalog` 生成。当前包名为未发布的内部名称，后续随 molcrafts-design 统一改名。
唯一实现位于 packages/ui，所有列出的组件通过 `@molcrafts/design` 根入口消费。

```tsx
import { Button } from "@molcrafts/design";
import "@molcrafts/design/styles.css";
<Button size="icon" aria-label="Add item">{/* official Fluent icon */}</Button>
```

完整用法查看链接的 TypeScript API 与 stories。无专用 story 的组件仍待后续补齐；有 story 不代表状态覆盖完整。

| Module / purpose | Exported values | API source | Story |
| --- | --- | --- | --- |
| accordion：可展开的分组内容 | `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger` | [source](../packages/ui/src/components/ui/accordion.tsx) | 待补专用 story |
| alert-dialog：需要明确确认的阻断对话框 | `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger` | [source](../packages/ui/src/components/ui/alert-dialog.tsx) | 待补专用 story |
| badge：非交互状态标签 | `Badge`, `badgeVariants` | [source](../packages/ui/src/components/ui/badge.tsx) | [story](../apps/storybook/src/components/ui/badge.stories.tsx) |
| button：操作按钮、链接与图标按钮 | `Button`, `buttonVariants` | [source](../packages/ui/src/components/ui/button.tsx) | [story](../apps/storybook/src/components/ui/button.stories.tsx) |
| card：信息容器与分组 | `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` | [source](../packages/ui/src/components/ui/card.tsx) | [story](../apps/storybook/src/components/ui/card.stories.tsx) |
| checkbox：多选及不确定状态 | `Checkbox` | [source](../packages/ui/src/components/ui/checkbox.tsx) | 待补专用 story |
| code：代码文本展示 | `Code`, `codeVariants` | [source](../packages/ui/src/components/ui/code.tsx) | 待补专用 story |
| collapsible：单个可折叠区域 | `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` | [source](../packages/ui/src/components/ui/collapsible.tsx) | 待补专用 story |
| command：可搜索的命令选择 | `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut` | [source](../packages/ui/src/components/ui/command.tsx) | 待补专用 story |
| context-menu：上下文操作菜单 | `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger` | [source](../packages/ui/src/components/ui/context-menu.tsx) | 待补专用 story |
| dialog：模态对话框 | `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger` | [source](../packages/ui/src/components/ui/dialog.tsx) | [story](../apps/storybook/src/components/ui/dialog.stories.tsx) |
| dropdown-menu：触发式操作菜单 | `DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger` | [source](../packages/ui/src/components/ui/dropdown-menu.tsx) | 待补专用 story |
| empty-state：空内容与行动提示 | `EmptyState` | [source](../packages/ui/src/components/ui/empty-state.tsx) | [story](../apps/storybook/src/components/ui/empty-state.stories.tsx) |
| input：单行文本输入 | `Input` | [source](../packages/ui/src/components/ui/input.tsx) | [story](../apps/storybook/src/components/ui/input.stories.tsx) |
| label：表单标签 | `Label` | [source](../packages/ui/src/components/ui/label.tsx) | 待补专用 story |
| number-field：草稿编辑与数值提交 | `NumberField` | [source](../packages/ui/src/components/ui/number-field.tsx) | [story](../apps/storybook/src/components/ui/number-field.stories.tsx) |
| popover：锚定浮层 | `Popover`, `PopoverAnchor`, `PopoverContent`, `PopoverTrigger` | [source](../packages/ui/src/components/ui/popover.tsx) | 待补专用 story |
| progress-spinner：加载进度提示 | `ProgressSpinner` | [source](../packages/ui/src/components/ui/progress-spinner.tsx) | 待补专用 story |
| resizable：可调整大小的面板 | `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup` | [source](../packages/ui/src/components/ui/resizable.tsx) | [story](../apps/storybook/src/components/ui/resizable.stories.tsx) |
| scroll-area：可滚动内容区域 | `ScrollArea`, `ScrollBar` | [source](../packages/ui/src/components/ui/scroll-area.tsx) | 待补专用 story |
| select：单选下拉列表 | `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue` | [source](../packages/ui/src/components/ui/select.tsx) | 待补专用 story |
| separator：内容分隔线 | `Separator` | [source](../packages/ui/src/components/ui/separator.tsx) | 待补专用 story |
| sheet：侧边模态面板 | `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetOverlay`, `SheetPortal`, `SheetTitle`, `SheetTrigger` | [source](../packages/ui/src/components/ui/sheet.tsx) | 待补专用 story |
| skeleton：加载占位 | `Skeleton` | [source](../packages/ui/src/components/ui/skeleton.tsx) | 待补专用 story |
| slider：范围数值选择 | `Slider` | [source](../packages/ui/src/components/ui/slider.tsx) | 待补专用 story |
| switch：即时开关 | `Switch` | [source](../packages/ui/src/components/ui/switch.tsx) | 待补专用 story |
| table：表格结构 | `Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow` | [source](../packages/ui/src/components/ui/table.tsx) | 待补专用 story |
| tabs：标签页导航 | `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `tabsListVariants` | [source](../packages/ui/src/components/ui/tabs.tsx) | [story](../apps/storybook/src/components/ui/tabs.stories.tsx) |
| textarea：多行文本输入 | `Textarea` | [source](../packages/ui/src/components/ui/textarea.tsx) | 待补专用 story |
| tooltip：操作补充说明 | `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` | [source](../packages/ui/src/components/ui/tooltip.tsx) | 待补专用 story |
| edge-panel：边缘拖拽展开面板 | `EdgePanel` | [source](../packages/ui/src/components/blocks/edge-panel.tsx) | 待补专用 story |
| settings-section：设置字段与分组 | `SettingsSection`, `SettingsRow` | [source](../packages/ui/src/components/blocks/settings-section.tsx) | [story](../apps/storybook/src/components/blocks/settings-section.stories.tsx) |
| settings-shell：设置导航与内容组合 | `SettingsShell` | [source](../packages/ui/src/components/blocks/settings-shell.tsx) | 待补专用 story |

[ThemeScope](../packages/ui/src/theme/theme-scope.tsx) 从 `@molcrafts/design` 导入：受控模式、完整品牌组与 scoped portal。
[主题 stories](../apps/storybook/src/theme/theme-scope.stories.tsx) / [主题契约](theming.md)。

`cn` 通过 `@molcrafts/design` 或 `@molcrafts/design/utils` 导入；只识别共享设计 scales。

Web Components 使用独立包/API，清单及接入方式见 [原生包文档](../packages/web-components/README.md)。
