import { E, appendHTMLArrayState, makeDraggable } from "../../../html";
import { dependentState, effectNow } from "../../../state";
import { Api } from "../api/api";
import createNodeConnection from "./nodeConnection";
import { NODE_HEIGHT, NODE_WIDTH, coordToGrid } from "./nodeEditor";

export interface NodeCallbacks {
	onOpen?: () => void;
};

export default function createNode(project: Api.Project, parent: HTMLElement, node: Api.Node, cbs: NodeCallbacks = {}) {
	return E(`div.node#${node.id}`, (e) => {
		e.style.width = `${NODE_WIDTH}px`;
		e.style.height = `${NODE_HEIGHT}px`;

		effectNow(node.selected, (selected) => {
			if (selected) e.classList.add('selected');
			else e.classList.remove('selected');
		})

		const nodeBody = E("div.node-body.interact", (bodyEl) => {
			bodyEl.append(
				E("span.node-bar", (barEl) => {
					effectNow(node.name, (name) => {
						barEl.textContent = name;
					});
				}),
				E("div.node-content", (contentEl) => {
					effectNow(node.content.text, (text) => {
						contentEl.textContent = text;
					});
				}),
			);
		});

		e.addEventListener('click', (ev) => {
			cbs.onOpen?.();
			ev.stopPropagation();
		});

		makeDraggable(e, {
			pos: node.ui.pos,
			dragWith: nodeBody,
			onDragStart() {
				e.style.transform = "scale(105%)";
			},
			onDragEnd() {
				e.style.transform = "scale(1)";
				node.ui.pos.update({
					x: coordToGrid(node.ui.pos.get().x),
					y: coordToGrid(node.ui.pos.get().y),
				});
			},
		});

		e.append(
			nodeBody,
			E("div.node-pin.input", (pinEl) => {}),
			E("div.node-pin.output", (pinEl) => {}),
		);

		appendHTMLArrayState(
			parent,
			dependentState(node.content.connectsTo, (a) =>
				// everything hangs if you do === "forward"
				// HACK: WTF
				a.filter((con) => con.direction === "backward"),
			),
			(a, b) =>
				a.direction === b.direction &&
				a.targetId === b.targetId &&
				a.type === b.type,
			(con) =>
				createNodeConnection({
					type: con.type,
					from: project.nodes.get().find((n) => n.id.get() === con.targetId)!,
					to: node,
				}),
		);
	});
};

