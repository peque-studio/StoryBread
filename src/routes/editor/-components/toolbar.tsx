import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar";

interface ToolbarProps {
  createNode(): void;
}

export function Toolbar({ createNode }: ToolbarProps) {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Node</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={createNode}>
            New node <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
