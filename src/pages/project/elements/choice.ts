import { SVG } from "@svgdotjs/svg.js";
import { E } from "../../../html";
import { IState, effectNow, joinedState } from "statec";
import * as api from "../api";
import { KNOT_HEIGHT, KNOT_WIDTH } from "./projectEditor";

export type KnotChoice = {
	type: IState<"direct" | "transitive">;
	from: api.Knot;
	to: api.Knot;
};

const smoothLineDef = (x0: number, y0: number, x1: number, y1: number): string =>
	`M${x0} ${y0}
	 C${x0 + (x1 - x0) / 2} ${y0}
	  ${x1 - (x1 - x0) / 2} ${y1}
		${x1} ${y1}`;

export default function createKnotChoice(con: KnotChoice) {
	return E(`div.knot-con#${con.from.id}-${con.to.id}`, (el) => {
		const svg = SVG().addTo(el);
		const path = svg.path();

		path.fill("transparent");

		effectNow(
			joinedState(con.type, con.from.selected, con.to.selected),
			([type, fromSel, toSel]) =>
				path.stroke({
					width: 2,
					color: fromSel || toSel ? "#9c92fd" : "#787787",
					...(type === "transitive" ? { dasharray: "4 4" } : {}),
				}),
		);

		effectNow(joinedState(con.from.ui.pos, con.to.ui.pos), ([fromPos, toPos]) => {
			const pad = 10;

			path.plot(
				smoothLineDef(
					fromPos.x + KNOT_WIDTH,
					fromPos.y + KNOT_HEIGHT / 2,
					toPos.x,
					toPos.y + KNOT_HEIGHT / 2,
				),
			);
			const bbox = path.bbox();

			svg.viewbox(bbox.x - pad, bbox.y - pad, bbox.w + pad * 2, bbox.h + pad * 2);
			el.style.left = `${bbox.x - pad}px`;
			el.style.top = `${bbox.y - pad}px`;
			svg.size(bbox.w + pad * 2, bbox.h + pad * 2);
		});
	});
}
