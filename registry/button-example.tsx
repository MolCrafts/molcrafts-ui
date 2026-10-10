import { AddRegular } from "@fluentui/react-icons";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/design";

export function AddActionExample() {
  return <Tooltip><TooltipTrigger asChild>
    <Button size="icon" aria-label="Add item"><AddRegular aria-hidden="true" /></Button>
  </TooltipTrigger><TooltipContent>Add item</TooltipContent></Tooltip>;
}
