import * as feather from "feather-icons";
import { E, bindToValue } from "../../../html";
import createIcon from "../../../icons";
import { BasicState, IReadonlyState, effectNow } from "../../../state";
import { Api } from "../api/api";

import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import "prosemirror-view/style/prosemirror.css";
import { Schema, DOMParser } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import {
  schema as mdSchema,
  defaultMarkdownParser,
  defaultMarkdownSerializer
} from "prosemirror-markdown";
import "prosemirror-example-setup/style/style.css";
import "prosemirror-menu/style/menu.css";

function createContentInput(node: Api.Node) {
  const schema = mdSchema;
  const editorEl = E("div.content-editor-editor");
  const view = new EditorView(editorEl, {
    state: EditorState.create({
      doc: defaultMarkdownParser.parse(node.content.text.get())!,
      plugins: exampleSetup({ schema }),
    }),
    dispatchTransaction(tr) {
      view.updateState(view.state.apply(tr));
      node.content.text.update(defaultMarkdownSerializer.serialize(view.state.doc));
    },
  });
  return editorEl;
}

export default function createContentEditor(node: IReadonlyState<Api.Node | null>) {
  const state = new BasicState<HTMLElement | null>(null);
	effectNow(node, (node) => {
		if (!node) {
			state.update(null);
			return;
		}

		state.update(E("div.content-editor", (e) => {
			e.append(
				E("div.content-editor-header", (e) => {
					e.append(
						E("button.icon", (buttonEl) => {
							buttonEl.append(createIcon(feather.icons.x, { width: 16, height: 16 }));
							buttonEl.onclick = () => state.update(null);
						}),
						E("input", (inputEl) => {
							inputEl.placeholder = "Node name...";
							bindToValue(inputEl, node.name);
						}),
					);
				}),
				createContentInput(node),
			);
		}));
	});
	return state;
}
