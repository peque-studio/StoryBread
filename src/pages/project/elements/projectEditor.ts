import { E, appendHTMLArrayState, appendHTMLState } from "../../../html";
import { BasicState, IReadonlyState, dependentState } from "statec";
import * as api from "../api";
import createContentEditor from "./contentEditor";
import createKnot from "./knot";

export const KNOT_WIDTH = 100;
export const KNOT_HEIGHT = 100;
export const EDITOR_GRID_SIZE = KNOT_WIDTH / 4;

export const coordToGrid = (v: number) =>
	Math.round(v / EDITOR_GRID_SIZE) * EDITOR_GRID_SIZE;

export default function createProjectEditor(
	project: IReadonlyState<api.Project>,
) {
	return dependentState(project, (project) => {
		const selectedKnot = new BasicState<api.Knot | null>(null);
		selectedKnot.effect((knot, oldKnot) => {
			oldKnot?.selected.update(false);
			knot?.selected.update(true);
		});

		return E("div.knot-editor-wrap", (e) => {
			e.append(
				E("div.knot-editor", (e) => {
					e.style.backgroundSize = `${EDITOR_GRID_SIZE}px ${EDITOR_GRID_SIZE}px`;
					e.style.backgroundPositionX = `${EDITOR_GRID_SIZE / 2}px`;
					e.style.backgroundPositionY = `${EDITOR_GRID_SIZE / 2}px`;

					e.addEventListener("click", () => selectedKnot.update(null));

					appendHTMLArrayState(
						e,
						project.knots,
						(a, b) => a.id === b.id,
						(knot) =>
							createKnot(project, e, knot, {
								onOpen() {
									selectedKnot.update(knot);
								},
							}),
					);
				}),
			);
			appendHTMLState(e, createContentEditor(selectedKnot));
		});
	});
}
