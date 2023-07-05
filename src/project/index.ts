import State, { ArrayState, HTMLState, IReadonlyState, dependentState, effectNow } from "../state";
import { Api, globalApi } from "./api/api";
import { E, Q } from "../html";

const createNode = (node: Api.Node) => {
	return E(`div.node#${node.id}`, (e) => {
		e.appendChild(
			E("span.node-name", (nameSpan) => {
				effectNow(node.name, (name) => {
					nameSpan.textContent = name;
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
		});
	});
};

window.addEventListener("load", () => {
	// document.location.
	// const nodeEditor = createNodeEditor();
});
