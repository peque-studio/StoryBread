import { SVG } from "@svgdotjs/svg.js";
import { E } from "../../../html";
import { IState, effectNow, joinedState } from "../../../state";
import { Api } from "../api/api";
import { NODE_HEIGHT, NODE_WIDTH } from "./nodeEditor";

export type NodeConnection = {
	type: IState<"direct" | "transitive">;
	from: Api.Node;
	to: Api.Node;
};

const smoothLineDef = (x0: number, y0: number, x1: number, y1: number): string =>
	`M${x0} ${y0}
	 C${x0 + (x1 - x0) / 2} ${y0}
	  ${x1 - (x1 - x0) / 2} ${y1}
		${x1} ${y1}`;

export default function createNodeConnection(con: NodeConnection) {
	return E(`div.node-con#${con.from.id}-${con.to.id}`, (e) => {
		const svg = SVG().addTo(e);
		const path = svg.path();

		path.fill("transparent");

		effectNow(con.type, (type) =>
			path.stroke({
				width: 2,
				color: "#eee",
				...(type === "transitive" ? { dasharray: "4 4" } : {}),
			}),
		);

		effectNow(joinedState(con.from.ui.pos, con.to.ui.pos), ([fromPos, toPos]) => {
			const pad = 10;

			path.plot(smoothLineDef(
				fromPos.x + NODE_WIDTH,
				fromPos.y + NODE_HEIGHT / 2,
				toPos.x,
				toPos.y + NODE_HEIGHT / 2
			));
			const bbox = path.bbox();

			svg.viewbox(bbox.x - pad, bbox.y - pad, bbox.w + pad * 2, bbox.h + pad * 2);
			e.style.left = `${bbox.x - pad}px`;
			e.style.top = `${bbox.y - pad}px`;
			svg.size(bbox.w + pad * 2, bbox.h + pad * 2);
		});
	});
}
