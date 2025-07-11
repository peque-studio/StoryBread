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
import { useState } from "react";

interface InspectorProps {
  open: boolean;
}

const extensions = [StarterKit];

export function Inspector({ open }: InspectorProps) {
  const [content, setContent] = useState<JSONContent>();

  return (
    <Sheet open={open} modal={false}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Node Inspector</SheetTitle>
          <SheetDescription>
            {`You can enter some text below :)`}
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <EditorRoot>
            <EditorContent
              extensions={extensions}
              initialContent={content}
              onUpdate={({ editor }) => {
                const json = editor.getJSON();
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
