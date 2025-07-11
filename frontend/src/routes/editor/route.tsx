import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "./-components/editor";
import { Inspector } from "./-components/inspector";
import { ReactFlowProvider } from "@xyflow/react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NodeActions } from "./-components/node-actions";
import { Library } from "./-components/library";

export const Route = createFileRoute("/editor")({
  component: EditorRoute,
});

function EditorRoute() {
  return (
    <main className="w-screen h-screen flex overflow-hidden">
      <Library />
      <ReactFlowProvider>
        <ContextMenu>
          <Inspector />
          <ContextMenuTrigger>
            <Editor />
          </ContextMenuTrigger>
          <NodeActions />
        </ContextMenu>
      </ReactFlowProvider>
    </main>
  );
}
