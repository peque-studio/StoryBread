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
import "./assets/styles.css";
import { getProject } from "./api/impl";

const createNode = (node: Api.Node) => {
	return E(`div.node#${node.id}`, (e) => {
		makeDraggable(e, { pos: node.ui.pos });
		e.append(
			E("span.node-name", (nameEl) => {
				effectNow(node.name, (name) => {
					nameEl.textContent = name;
				});
			}),
			E("div.node-body", (bodyEl) => {
				// effectNow(node.name, (name) => {
				// 	bodyEl.textContent = name;
				// });
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
		});
	});
};

window.addEventListener("load", async () => {
	const nodeEditor = createNodeEditor(new ConstState(await getProject("test")));
	document.body.appendChild(nodeEditor.get());
	nodeEditor.effect((newEl, oldEl) => oldEl.replaceWith(newEl));
});
