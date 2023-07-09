import { E, appendHTMLArrayState, appendHTMLState } from "../../../html";
import { BasicState, IReadonlyState, dependentState } from "../../../state";
import { Api } from "../api/api";
import createContentEditor from "./contentEditor";
import createNode from "./node";

export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 100;
export const NODE_EDITOR_GRID = NODE_WIDTH / 4;

export const coordToGrid = (v: number) =>
	Math.round(v / NODE_EDITOR_GRID) * NODE_EDITOR_GRID;

export default function createNodeEditorIn(parent: HTMLElement, project: IReadonlyState<Api.Project>) {
	appendHTMLState(parent, dependentState(project, (project) => {
		const selectedNode = new BasicState<Api.Node | null>(null);
		selectedNode.effect((node, oldNode) => {
			oldNode?.selected.update(false);
			node?.selected.update(true);
		});

		return E("div.node-editor-wrap", (e) => {
			e.append(E("div.node-editor", (e) => {
				e.style.backgroundSize = `${NODE_EDITOR_GRID}px ${NODE_EDITOR_GRID}px`;
				e.style.backgroundPositionX = `${NODE_EDITOR_GRID / 2}px`;
				e.style.backgroundPositionY = `${NODE_EDITOR_GRID / 2}px`;

				e.addEventListener('click', () => selectedNode.update(null));
	
				appendHTMLArrayState(
					e,
					project.nodes,
					(a, b) => a.id === b.id,
					(node) => createNode(project, e, node, {
						onOpen() {
							selectedNode.update(node);
						}
					}),
				);
			}));
			appendHTMLState(e, createContentEditor(selectedNode));
		});
	}));
}
