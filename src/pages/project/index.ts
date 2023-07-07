import State, {
	ArrayState,
	ConstState,
	HTMLState,
	IReadonlyState,
	dependentState,
	effectNow,
} from "../../state";
import { Api, globalApi } from "./api/api";
import { E, Q, makeDraggable } from "../../html";
import { getProject } from "./api/impl";
import "./assets/styles.css";
import "../common.css";

const createNode = (node: Api.Node) => {
	return E(`div.node.interact#${node.id}`, (e) => {
		makeDraggable(e, { pos: node.ui.pos });
		e.append(
			E("span.node-name", (nameEl) => {
				effectNow(node.name, (name) => {
					nameEl.textContent = name;
				});
			}),
			E("div.node-body", (bodyEl) => {
				effectNow(node.content.text, (text) => {
					bodyEl.textContent = text;
				});
			}),
		);
	});
};

const createNodeEditor = (project: IReadonlyState<Api.Project>) => {
	return dependentState(project, (project) => {
		return E("div.node-editor", (e) => {
			effectNow(project.nodes, (nodes, oldNodes) => {
				const newNodes = nodes.filter((n) => !oldNodes?.find((oldNode) => oldNode.id === n.id));
				const removedNodes = oldNodes?.filter((oldNode) => !nodes?.find((n) => oldNode.id === n.id)) ?? [];

				for (const node of newNodes) {
					e.appendChild(createNode(node));
				}

				for (const node of removedNodes) {
					Q(`#node_${node.id}`)?.remove();
				}
			});
			e.append(
				E("button", (buttonEl) => {
					buttonEl.textContent = "Add Node";
				}),
				E("button.important", (buttonEl) => {
					buttonEl.textContent = "Test";
				}),
			);
		});
	});
};

window.addEventListener("load", async () => {
	const nodeEditor = createNodeEditor(new ConstState(await getProject("test")));
	document.body.appendChild(nodeEditor.get());
	nodeEditor.effect((newEl, oldEl) => oldEl.replaceWith(newEl));
});
