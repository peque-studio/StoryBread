import { E, appendHTMLArrayState, appendHTMLState } from "../../../html";
import {
	BasicState,
	IReadonlyState,
	IState,
	dependentState,
	effectNow,
} from "statec";
import * as api from "../api";
import createContentEditor from "./contentEditor";
import createKnot from "./knot";
import {
	createButton,
	createConfirmIconButton,
	createIconButton,
} from "../../../html/buttons";

export const KNOT_WIDTH = 100;
export const KNOT_HEIGHT = 100;
export const EDITOR_GRID_SIZE = KNOT_WIDTH / 4;

export const coordToGrid = (v: number) =>
	Math.round(v / EDITOR_GRID_SIZE) * EDITOR_GRID_SIZE;

export default class ProjectEditor {
	zoom: IState<number>;
	selectedKnot: IState<api.Knot | null>;
	editorEl: HTMLElement | undefined;
	newChoice: IState<null | {
		pos: IState<{ x: 0; y: 0 }>;
		from: string;
	}>;

	constructor(public readonly project: api.Project) {
		this.zoom = new BasicState(1.0);
		this.editorEl = undefined;
		this.selectedKnot = new BasicState<api.Knot | null>(null);
		this.selectedKnot.effect((knot, oldKnot) => {
			oldKnot?.selected.update(false);
			knot?.selected.update(true);
		});
		this.newChoice = new BasicState(null);
	}

	private createMenuBar() {
		return E("div.menu-bar", (el) => {
			el.append(
				createIconButton("arrow-left", "/home"),
				E("div.menu-bar-separator"),
				createButton("Test", () => {}, { kind: "important" }),
				createIconButton("upload", () => {}),
				E("div.menu-bar-separator"),
				createIconButton(
					"plus",
					() => {
						const bb = this.editorEl?.getBoundingClientRect();
						const [x, y] = bb ? [bb.width / 2, bb.height / 2] : [0, 0];
						this.project.addKnot(x, y);
					},
					{ kind: "important" },
				),
			);
			appendHTMLState(
				el,
				dependentState(this.selectedKnot, (selectedKnot) =>
					selectedKnot
						? createConfirmIconButton(
								"trash",
								() => {
									this.project.deleteKnot(selectedKnot.id.get());
									this.selectedKnot.update(null);
								},
								{ kind: "danger" },
						  )
						: null,
				),
			);
		});
	}

	private createMain() {
		return E("main", (el) => {
			el.append(
				E("div.knot-editor-wrap", (el) => {
					el.append(
						E("div.knot-editor", (el) => {
							this.editorEl = el;
							el.style.backgroundSize = `${EDITOR_GRID_SIZE}px ${EDITOR_GRID_SIZE}px`;
							el.style.backgroundPositionX = `${EDITOR_GRID_SIZE / 2}px`;
							el.style.backgroundPositionY = `${EDITOR_GRID_SIZE / 2}px`;

							el.addEventListener("click", () => this.selectedKnot.update(null));

							appendHTMLArrayState(
								el,
								this.project.knots,
								(e) => e.id.get(),
								(knot) =>
									createKnot(this, el, knot, {
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

	create() {
		const main = this.createMain();
		return [this.createMenuBar(), main];
	}
}
