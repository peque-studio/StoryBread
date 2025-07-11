import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import {
  EditorContent,
  EditorRoot,
  handleCommandNavigation,
  type JSONContent,
  StarterKit,
} from "novel";
import { useCallback, useState, type FormEvent } from "react";
import { useStore, useUpdateNodeInternals } from "@xyflow/react";
import type { ActionNode } from "../-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const extensions = [StarterKit];

export function Inspector() {
  const updateNode = useUpdateNodeInternals();
  const [content, setContent] = useState<JSONContent>();
  const open = useStore(
    (state) => state.nodes.filter((node) => node.selected).length == 1
  );
  const [node] = useStore((state) =>
    state.nodes.filter((node) => node.selected)
  ) as ActionNode[];

  const onInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (!open || node === undefined) return;
      node.data.label = e.currentTarget.value;
      updateNode(node.id);
    },
    [open, node, updateNode]
  );

  return (
    <Sheet open={open} modal={false}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Node Inspector</SheetTitle>
          <SheetDescription>
            {`You can enter some text below :)`}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              placeholder="Node #69"
              id="label"
              value={node?.data?.label ?? ""}
              onInput={onInput}
            />
          </div>
          <Separator />
          <EditorRoot>
            <EditorContent
              extensions={extensions}
              initialContent={content}
              onUpdate={({ editor }) => {
                const json = editor.getJSON();
                node.data.label = editor.getText();
                setContent(json);
              }}
              editorProps={{
                handleDOMEvents: {
                  keydown: (_view, event) => handleCommandNavigation(event),
                },
                attributes: {
                  class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                },
              }}
            />
          </EditorRoot>
        </div>
      </SheetContent>
    </Sheet>
  );
}
