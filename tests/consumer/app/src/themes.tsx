import { useState } from "react";
import type { ProductTheme, ThemeMode } from "@molcrafts/design-tokens";
import {
  ThemeScope, Button, Badge, Input, ProgressSpinner,
  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription,
  Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel,
  Popover, PopoverTrigger, PopoverContent, Tooltip, TooltipTrigger, TooltipContent,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from "@molcrafts/design";

const purple: ProductTheme = {
  primary: { background: "#7b327e", hover: "#652669", pressed: "#4f1c53", foreground: "#ffffff", muted: "#f4e7f5", mutedForeground: "#652669", link: "#c98fce", linkHover: "#e3b7e6" },
  secondary: { background: "#735c0f", hover: "#614d0c", pressed: "#4d3d09", foreground: "#ffffff", muted: "#f8f0d4", mutedForeground: "#614d0c" },
};
const teal: ProductTheme = {
  primary: { background: "#00665e", hover: "#00574f", pressed: "#00473f", foreground: "#ffffff", muted: "#dcf3ee", mutedForeground: "#00574f", link: "#65dfcb", linkHover: "#8cf0df" },
  secondary: purple.secondary,
};

export function Themes() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [brand, setBrand] = useState<ProductTheme>(purple);
  const toggleTheme = () => setTheme(value => value === "dark" ? "light" : "dark");
  const changeBrand = () => setBrand(value => value === purple ? teal : purple);
  return <main>
    <h1>Scoped product themes</h1>
    <div className="theme-actions"><Button onClick={toggleTheme}>Toggle scope theme</Button><Button onClick={changeBrand}>Change scope brand</Button></div>
    <ThemeScope id="product-scope" theme={theme} brand={brand}>
      <h2>Product scope</h2>
      <div className="theme-actions">
        <Button id="scoped-primary">Scoped primary</Button><Button variant="secondary">Neutral action</Button>
        <Button disabled>Disabled action</Button>
        <Badge variant="success">Completed</Badge><Badge variant="warning">Warning</Badge><Badge variant="destructive">Failed</Badge>
        <ProgressSpinner label="Loading" />
      </div>
      <label htmlFor="scoped-name">Scoped name</label><Input id="scoped-name" defaultValue="Workspace" />
      <div className="theme-actions">
        <Dialog><DialogTrigger asChild><Button>Open scoped dialog</Button></DialogTrigger>
          <DialogContent><DialogTitle>Scoped dialog</DialogTitle><DialogDescription>Mode and brand follow the owning scope.</DialogDescription>
            <Button onClick={toggleTheme}>Toggle dialog theme</Button><Button onClick={changeBrand}>Change dialog brand</Button>
          </DialogContent>
        </Dialog>
        <Sheet><SheetTrigger asChild><Button variant="secondary">Open scoped sheet</Button></SheetTrigger>
          <SheetContent><SheetTitle>Scoped sheet</SheetTitle><SheetDescription>Inherited product theme.</SheetDescription></SheetContent>
        </Sheet>
        <AlertDialog><AlertDialogTrigger asChild><Button variant="secondary">Open scoped alert</Button></AlertDialogTrigger>
          <AlertDialogContent><AlertDialogTitle>Scoped alert</AlertDialogTitle><AlertDialogDescription>Review this action.</AlertDialogDescription><AlertDialogCancel>Cancel alert</AlertDialogCancel></AlertDialogContent>
        </AlertDialog>
        <Popover><PopoverTrigger asChild><Button variant="secondary">Open scoped popover</Button></PopoverTrigger>
          <PopoverContent aria-label="Scoped popover"><p>Product details</p></PopoverContent>
        </Popover>
        <Tooltip><TooltipTrigger asChild><Button variant="secondary">Scoped help</Button></TooltipTrigger><TooltipContent>Product help</TooltipContent></Tooltip>
        <Select defaultValue="one"><SelectTrigger aria-label="Choose scoped item"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="one">First item</SelectItem><SelectItem value="two">Second item</SelectItem></SelectContent>
        </Select>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary">Scoped menu</Button></DropdownMenuTrigger>
          <DropdownMenuContent><DropdownMenuItem>Run action</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
        <ContextMenu><ContextMenuTrigger asChild><Button variant="secondary">Context actions</Button></ContextMenuTrigger>
          <ContextMenuContent><ContextMenuItem>Inspect action</ContextMenuItem></ContextMenuContent>
        </ContextMenu>
      </div>
      <ThemeScope id="nested-light" theme="light">
        <h3>Independent light scope</h3><Button>Nested light primary</Button><Badge variant="success">Nested completed</Badge>
        <Dialog><DialogTrigger asChild><Button variant="secondary">Open nested dialog</Button></DialogTrigger>
          <DialogContent><DialogTitle>Nested light dialog</DialogTitle><DialogDescription>Nearest scope wins.</DialogDescription></DialogContent>
        </Dialog>
      </ThemeScope>
    </ThemeScope>
  </main>;
}
