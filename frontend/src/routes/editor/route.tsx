import { createFileRoute } from "@tanstack/react-router";
import { Inspector } from "./-components/inspector";
import { ReactFlowProvider } from "@xyflow/react";
import { ContextMenu } from "@/components/ui/context-menu";
import { NodeActions } from "./-components/node-actions";
import { Library } from "./-components/library";
import { useCallback } from "react";
import { DockviewReact, type DockviewReadyEvent } from "dockview";
import { Canvas } from "./-components/canvas";

import "dockview/dist/styles/dockview.css";

export const Route = createFileRoute("/editor")({
  component: Editor,
});

const components = {
  library: () => <Library />,
  canvas: () => <Canvas />,
  inspector: () => <Inspector />,
};

function Editor() {
  const onReady = useCallback((e: DockviewReadyEvent) => {
    ["library", "canvas"].forEach((panel) => {
      e.api.addPanel({
        id: panel,
        component: panel,
        position: {
          direction: "right",
        },
        initialWidth:
          panel == "canvas" ? (window.innerWidth / 3) * 2 : undefined,
      });
    });
  }, []);

  return (
    <main className="w-screen h-screen">
      <ReactFlowProvider>
        <ContextMenu>
          <DockviewReact
            components={components}
            onReady={onReady}
            className="dockview-theme-abyss"
          />
          <NodeActions />
        </ContextMenu>
        <Inspector />
      </ReactFlowProvider>
    </main>
  );
}
