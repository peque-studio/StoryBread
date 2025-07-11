import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "./-components/editor";
import { Inspector } from "./-components/inspector";
import { useState } from "react";

export const Route = createFileRoute("/editor")({
  component: EditorRoute,
});

function EditorRoute() {
  const [isInspectorOpen, setInspector] = useState(false);

  return (
    <main>
      <Inspector open={isInspectorOpen} />
      <Editor setInspector={setInspector} />
    </main>
  );
}
