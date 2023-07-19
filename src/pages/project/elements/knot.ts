import { E, appendHTMLArrayState, makeDraggable } from "../../../html";
import { dependentState, effectNow } from "statec";
import * as api from "../api";
import createKnotChoice from "./choice";
import ProjectEditor, {
	KNOT_HEIGHT,
	KNOT_WIDTH,
	coordToGrid,
} from "./projectEditor";
import createContextMenuFor from "../../../html/contextMenu";

export interface KnotCallbacks {
	onOpen?: () => void;
}

export default function createKnot(
	editor: ProjectEditor,
	parent: HTMLElement,
	knot: api.Knot,
	cbs: KnotCallbacks = {},
) {
	return E(`div.knot#${knot.id}`, (el) => {
		el.style.width = `${KNOT_WIDTH}px`;
		el.style.height = `${KNOT_HEIGHT}px`;

		effectNow(knot.selected, (selected) => {
			if (selected) el.classList.add("selected");
			else el.classList.remove("selected");
		});

		const knotBody = E("div.knot-body.interact", (bodyEl) => {
			effectNow(knot.name, (name) => {
				bodyEl.textContent = name;
			});
			// bodyEl.append(
			// 	E("span.knot-bar", (barEl) => {
			// 	}),
			// );
		});

		el.addEventListener("dblclick", (ev) => {
			cbs.onOpen?.();
			ev.stopPropagation();
		});

		el.addEventListener("click", (ev) => {
			// make sure clicking on another knot doesn't
			// deselect the current one. (event goes to the knotEditor, which deselects.)
			ev.stopPropagation();
		});

		createContextMenuFor(el, () => {
			return [];
		});

		makeDraggable(el, {
			pos: knot.ui.pos,
			dragWith: knotBody,
			onDragStart() {},
			onDrag() {
				el.style.transform = "scale(105%)";
				el.style.zIndex = "999";
				el.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
			},
			onDragEnd() {
				el.style.transform = "scale(1)";
				el.style.zIndex = "";
				el.style.boxShadow = "";
				knot.ui.pos.update({
					x: coordToGrid(knot.ui.pos.get().x),
					y: coordToGrid(knot.ui.pos.get().y),
				});
			},
		});

		el.append(knotBody, E("div.knot-pin.input"), E("div.knot-pin.output"));

		appendHTMLArrayState(
			parent,
			dependentState(knot.content.choices, (a) =>
				// everything hangs if you do === "forward"
				// HACK: WTF
				a.filter((con) => con.direction === "backward"),
			),
			(c) => `${c.targetId}.${c.direction}.${c.type.get()}`,
			(con) =>
				createKnotChoice({
					type: con.type,
					from: editor.project.knots.get().find((n) => n.id.get() === con.targetId)!,
					to: knot,
				}),
		);
	});
}
