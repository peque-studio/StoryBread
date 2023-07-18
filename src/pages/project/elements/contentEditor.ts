import { E, bindToValue } from "../../../html";
import { BasicState, IReadonlyState, effectNow } from "statec";
import * as api from "../api";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import "prosemirror-view/style/prosemirror.css";
import { exampleSetup } from "prosemirror-example-setup";
import {
	schema as mdSchema,
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from "prosemirror-markdown";
import "prosemirror-example-setup/style/style.css";
import { createIconButton } from "./buttons";
// import "prosemirror-menu/style/menu.css";

function createContentInput(knot: api.Knot) {
	const schema = mdSchema;
	const editorEl = E("div.content-editor-editor");
	const view = new EditorView(editorEl, {
		state: EditorState.create({
			doc: defaultMarkdownParser.parse(knot.content.text.get())!,
			plugins: exampleSetup({ schema }),
		}),
		dispatchTransaction(tr) {
			view.updateState(view.state.apply(tr));
			knot.content.text.update(defaultMarkdownSerializer.serialize(view.state.doc));
		},
	});
	return editorEl;
}

export default function createContentEditor(knot: IReadonlyState<api.Knot | null>) {
	const state = new BasicState<HTMLElement | null>(null);
	effectNow(knot, (knot) => {
		if (!knot) {
			state.update(null);
			return;
		}

		state.update(
			E("div.content-editor", (el) => {
				el.append(
					E("div.content-editor-header", (el) => {
						el.append(
							createIconButton("x", () => state.update(null)),
							createIconButton("image", () => {
								console.log("set image");
							}),
							E("input", (inputEl) => {
								inputEl.placeholder = "Knot name...";
								bindToValue(inputEl, knot.name);
							}),
						);
					}),
					createContentInput(knot),
				);
			}),
		);
	});
	return state;
}
