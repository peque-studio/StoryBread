import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

interface NodeActionsProps {}

export function NodeActions({}: NodeActionsProps) {
  return (
    <ContextMenuContent>
      <ContextMenuItem>Delete</ContextMenuItem>
      <ContextMenuItem>Duplicate</ContextMenuItem>
      <ContextMenuItem>Edit</ContextMenuItem>
      <ContextMenuItem>Connect</ContextMenuItem>
    </ContextMenuContent>
  );
}
