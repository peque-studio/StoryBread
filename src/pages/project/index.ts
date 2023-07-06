import State, {
	ArrayState,
	ConstState,
	HTMLState,
	IReadonlyState,
	dependentState,
	effectNow,
} from "../../state";
import { Api, globalApi } from "./api/api";
import { E, Q } from "../../html";
import "./assets/styles.css";
import { getProject } from "./api/impl";

const createNode = (node: Api.Node) => {
	return E(`div.node#${node.id}`, (e) => {
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
		e.addEventListener("dragstart", (ev) => {
			console.log("drag start:", {
				offsetX: ev.offsetX,
				offsetY: ev.offsetY,
				clientX: ev.clientX,
				clientY: ev.clientY,
			});
		});
		e.addEventListener("drag", (ev) => {
			e.style.left = `${ev.clientX}px`;
			e.style.top = `${ev.clientY}px`;
		});
		e.addEventListener("dragend", (ev) => {
			console.log("drag end:", {
				offsetX: ev.offsetX,
				offsetY: ev.offsetY,
				clientX: ev.clientX,
				clientY: ev.clientY,
			});
		});
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
