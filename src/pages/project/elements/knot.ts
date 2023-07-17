import { E, appendHTMLArrayState, makeDraggable } from "../../../html";
import { dependentState, effectNow } from "statec";
import * as api from "../api";
import createKnotChoice from "./choice";
import { KNOT_HEIGHT, KNOT_WIDTH, coordToGrid } from "./projectEditor";

export interface KnotCallbacks {
	onOpen?: () => void;
}

export default function createKnot(
	project: api.Project,
	parent: HTMLElement,
	knot: api.Knot,
	cbs: KnotCallbacks = {},
) {
	return E(`div.knot#${knot.id}`, (e) => {
		e.style.width = `${KNOT_WIDTH}px`;
		e.style.height = `${KNOT_HEIGHT}px`;

		effectNow(knot.selected, (selected) => {
			if (selected) e.classList.add("selected");
			else e.classList.remove("selected");
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

		e.addEventListener("dblclick", (ev) => {
			cbs.onOpen?.();
			ev.stopPropagation();
		});

		e.addEventListener("click", (ev) => {
			// make sure clicking on another knot doesn't
			// deselect the current one. (event goes to the knotEditor, which deselects.)
			ev.stopPropagation();
		});

		makeDraggable(e, {
			pos: knot.ui.pos,
			dragWith: knotBody,
			onDragStart() {},
			onDrag() {
				e.style.transform = "scale(105%)";
			},
			onDragEnd() {
				e.style.transform = "scale(1)";
				knot.ui.pos.update({
					x: coordToGrid(knot.ui.pos.get().x),
					y: coordToGrid(knot.ui.pos.get().y),
				});
			},
		});

		e.append(
			knotBody,
			E("div.knot-pin.input", (pinEl) => {}),
			E("div.knot-pin.output", (pinEl) => {}),
		);

		appendHTMLArrayState(
			parent,
			dependentState(knot.content.choices, (a) =>
				// everything hangs if you do === "forward"
				// HACK: WTF
				a.filter((con) => con.direction === "backward"),
			),
			(a, b) =>
				a.direction === b.direction &&
				a.targetId === b.targetId &&
				a.type === b.type,
			(con) =>
				createKnotChoice({
					type: con.type,
					from: project.knots.get().find((n) => n.id.get() === con.targetId)!,
					to: knot,
				}),
		);
	});
}
