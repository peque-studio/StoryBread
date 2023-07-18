import { E, appendHTMLArrayState, appendHTMLState } from "../../../html";
import { BasicState, IReadonlyState, IState, dependentState } from "statec";
import * as api from "../api";
import createContentEditor from "./contentEditor";
import createKnot from "./knot";

export const KNOT_WIDTH = 100;
export const KNOT_HEIGHT = 100;
export const EDITOR_GRID_SIZE = KNOT_WIDTH / 4;

export const coordToGrid = (v: number) =>
	Math.round(v / EDITOR_GRID_SIZE) * EDITOR_GRID_SIZE;

class ProjectEditor {
	zoom: IState<number>;
	selectedKnot: IState<api.Knot | null>;

	constructor(public readonly project: api.Project) {
		this.zoom = new BasicState(1.0);
		this.selectedKnot = new BasicState<api.Knot | null>(null);
		this.selectedKnot.effect((knot, oldKnot) => {
			oldKnot?.selected.update(false);
			knot?.selected.update(true);
		});
	}

	create() {
		return E("main", (el) => {
			el.append(
				E("div.knot-editor-wrap", (el) => {
					el.append(
						E("div.knot-editor", (el) => {
							el.style.backgroundSize = `${EDITOR_GRID_SIZE}px ${EDITOR_GRID_SIZE}px`;
							el.style.backgroundPositionX = `${EDITOR_GRID_SIZE / 2}px`;
							el.style.backgroundPositionY = `${EDITOR_GRID_SIZE / 2}px`;

							el.addEventListener("click", () => this.selectedKnot.update(null));

							appendHTMLArrayState(
								el,
								this.project.knots,
								(a, b) => a.id === b.id,
								(knot) =>
									createKnot(this.project, el, knot, {
										onOpen: () => {
											this.selectedKnot.update(knot);
										},
									}),
							);
						}),
					);
					appendHTMLState(el, createContentEditor(this.selectedKnot));
				}),
			);
		});
	}
}

export default function createProjectEditor(project: IReadonlyState<api.Project>) {
	return dependentState(project, (project) => {
		const editor = new ProjectEditor(project);
		return editor.create();
	});
}
