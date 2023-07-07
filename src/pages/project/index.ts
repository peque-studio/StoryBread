import State, {
	ArrayState,
	ConstState,
	HTMLState,
	IReadonlyState,
	IState,
	dependentState,
	effectNow,
	joinedState,
} from "../../state";
import { Api, globalApi } from "./api/api";
import {
	E,
	Q,
	appendHTMLArrayState,
	appendHTMLState,
	makeDraggable,
} from "../../html";
import { getProject } from "./api/impl";
import "./assets/styles.css";
import "../common.css";
import { arrayDiff } from "../../util";
import { SVG } from "@svgdotjs/svg.js";

const NODE_WIDTH = 100;
const NODE_HEIGHT = 100;

type NodeConnection = {
	type: IState<"direct" | "transitive">;
	from: Api.Node;
	to: Api.Node;
};

const smoothLineDef = (x0: number, y0: number, x1: number, y1: number): string =>
	`M${x0} ${y0}
	 C${x0 + (x1 - x0) / 2} ${y0}
	  ${x1 - (x1 - x0) / 2} ${y1}
		${x1} ${y1}`;

const createNodeConnection = (con: NodeConnection) =>
	E(`div.node-con#${con.from.id}-${con.to.id}`, (e) => {
		const path = SVG().addTo(e).path();

		path.fill("transparent");

		effectNow(con.type, (type) =>
			path.stroke({
				width: 2,
				color: "#eee",
				...(type === "transitive" ? { dasharray: "4 4" } : {}),
			}),
		);

		effectNow(joinedState(con.from.ui.pos, con.to.ui.pos), ([fromPos, toPos]) => {
			path.plot(
				smoothLineDef(
					fromPos.x + NODE_WIDTH,
					fromPos.y + NODE_HEIGHT / 2,
					toPos.x,
					toPos.y + NODE_HEIGHT / 2,
				),
			);
		});
	});

const createNode = (project: Api.Project, parent: HTMLElement, node: Api.Node) => {
	return E(`div.node#${node.id}`, (e) => {
		e.style.width = `${NODE_WIDTH}px`;
		e.style.height = `${NODE_HEIGHT}px`;

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

		makeDraggable(e, { pos: node.ui.pos, dragWith: nodeBody });

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

const createNodeEditor = (project: IReadonlyState<Api.Project>) =>
	dependentState(project, (project) => {
		return E("div.node-editor", (e) => {
			appendHTMLArrayState(
				e,
				project.nodes,
				(a, b) => a.id === b.id,
				(node) => createNode(project, e, node),
			);
		});
	});

const createMenuBar = (project: IReadonlyState<Api.Project>) =>
	dependentState(project, (project) => {
		return E("div.menu-bar", (e) => {
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

window.addEventListener("load", async () => {
	const project = new ConstState(await getProject("test"));
	appendHTMLState(document.body, createMenuBar(project));
	appendHTMLState(document.body, createNodeEditor(project));
});
