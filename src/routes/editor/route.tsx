import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "./-components/editor";
import { Inspector } from "./-components/inspector";
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NodeActions } from "./-components/node-actions";

export const Route = createFileRoute("/editor")({
  component: EditorRoute,
});

function EditorRoute() {
  const [isInspectorOpen, setInspector] = useState(false);

  return (
    <main>
      <ContextMenu>
        <Inspector open={isInspectorOpen} />
        <ContextMenuTrigger>
          <ReactFlowProvider>
            <Editor setInspector={setInspector} />
          </ReactFlowProvider>
        </ContextMenuTrigger>
        <NodeActions />
      </ContextMenu>
    </main>
  );
}
