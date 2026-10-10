import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { AddRegular, SettingsRegular, CheckmarkCircleRegular, WarningRegular } from "@fluentui/react-icons";
import { Button } from "@molcrafts/design";
import { Badge } from "@molcrafts/design";
import { Input } from "@molcrafts/design";
import { Label } from "@molcrafts/design";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@molcrafts/design";
import { Card, CardContent, CardHeader, CardTitle } from "@molcrafts/design";
import { Checkbox } from "@molcrafts/design";
import { Switch } from "@molcrafts/design";
import { ProgressSpinner } from "@molcrafts/design";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@molcrafts/design";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@molcrafts/design";
import { Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/design";

function ConstitutionPreview() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-label text-muted-foreground">MolCrafts design system · Fluent 2</p>
          <h1 className="text-heading font-semibold">A consistent workspace</h1>
          <p className="text-body text-muted-foreground">Clear hierarchy, familiar controls, and calm surfaces.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu><Tooltip><TooltipTrigger asChild><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Actions"><SettingsRegular aria-hidden="true" /></Button></DropdownMenuTrigger></TooltipTrigger><TooltipContent>Actions</TooltipContent></Tooltip>
            <DropdownMenuContent><DropdownMenuItem>Rename</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
          <Dialog><Tooltip><TooltipTrigger asChild><DialogTrigger asChild><Button size="icon" aria-label="Create item"><AddRegular aria-hidden="true" /></Button></DialogTrigger></TooltipTrigger><TooltipContent>Create item</TooltipContent></Tooltip>
            <DialogContent><DialogHeader><DialogTitle>Create an item</DialogTitle><DialogDescription>Give the item a name to get started.</DialogDescription></DialogHeader>
              <Label htmlFor="dialog-item">Name</Label><Input id="dialog-item" placeholder="Untitled item" />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <Tabs defaultValue="foundations">
        <TabsList><TabsTrigger value="foundations">Foundations</TabsTrigger><TabsTrigger value="controls">Controls</TabsTrigger></TabsList>
        <TabsContent value="foundations" className="space-y-6 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle>Typography</CardTitle></CardHeader><CardContent className="space-y-3">
              <p className="text-heading font-semibold">Page heading</p><p className="text-title font-semibold">Dialog title</p>
              <p className="text-body-lg font-semibold">Section heading</p><p className="text-body">Readable body text at 14px.</p>
              <p className="text-label text-muted-foreground">Supporting text at 12px.</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Neutral surfaces</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-control border bg-background p-4 text-body">Canvas</div>
              <div className="rounded-control border bg-surface p-4 text-body">Surface</div>
              <div className="rounded-control border bg-muted p-4 text-body">Muted</div>
              <div className="rounded-control border border-transparent bg-primary-muted p-4 text-body text-primary-muted-foreground">Selected</div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Actions and sizes</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Subtle</Button><Button disabled>Disabled</Button></div>
              <div className="flex flex-wrap items-center gap-2"><Button size="sm">Compact</Button><Button>Default</Button><Button size="lg">Comfortable</Button></div>
              <Button variant="link" asChild><a href="#feedback">Learn about feedback</a></Button>
            </CardContent></Card>
            <Card id="feedback"><CardHeader><CardTitle>Feedback</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2"><Badge variant="info">Running</Badge><Badge variant="success"><CheckmarkCircleRegular className="size-3" /> Completed</Badge><Badge variant="warning"><WarningRegular className="size-3" /> Warning</Badge><Badge variant="destructive">Failed</Badge></div>
              <div className="flex items-center gap-2 text-body"><ProgressSpinner /><span>Loading items…</span></div>
              <p className="text-body text-muted-foreground">Status always includes a readable label.</p>
            </CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="controls" className="pt-4">
          <Card className="max-w-xl"><CardHeader><CardTitle>Workspace preferences</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="preview-name">Name</Label><Input id="preview-name" defaultValue="Workspace" /></div>
            <div className="space-y-2"><Label htmlFor="preview-disabled">Organization</Label><Input id="preview-disabled" disabled defaultValue="MolCrafts" /></div>
            <div className="space-y-2"><Label htmlFor="preview-invalid">Email</Label><Input id="preview-invalid" aria-invalid aria-describedby="email-error" defaultValue="invalid" /><p id="email-error" className="text-label text-status-failed-foreground">Enter a valid email address.</p></div>
            <div className="flex items-center gap-2"><Checkbox id="preview-check" defaultChecked /><Label htmlFor="preview-check">Receive notifications</Label></div>
            <div className="flex items-center gap-2"><Switch id="preview-switch" defaultChecked /><Label htmlFor="preview-switch">Auto save</Label></div>
            <div className="flex gap-2"><Button>Save changes</Button><Button variant="secondary">Cancel</Button></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

const meta = {
  title: "Foundations/Constitution",
  component: ConstitutionPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ConstitutionPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { globals: { theme: "light" } };
export const Dark: Story = { globals: { theme: "dark" } };
