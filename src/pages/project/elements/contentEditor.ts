import * as feather from "feather-icons";
import { E, bindToValue } from "../../../html";
import createIcon from "../../../icons";
import { BasicState, IReadonlyState, effectNow } from "../../../state";
import { Api } from "../api/api";

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
				E("textarea", (textareaEl) => bindToValue(textareaEl, node.content.text)),
			);
		}));
	});
	return state;
}
