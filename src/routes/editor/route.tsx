import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "./-components/editor";

export const Route = createFileRoute("/editor")({
  component: EditorRoute,
});

function EditorRoute() {
  return <Editor />;
}
