import { Socket, io } from "socket.io-client";
import {
	ArrayState,
	BasicState,
	IReadonlyState,
	IState,
	effectNow,
	lazyState,
} from "statec";
import { StateInitialProps, arrayDiff } from "../../../util";

export type UUID = string;

export namespace UI {
	export interface Pos {
		x: number;
		y: number;
	}

	export interface KnotUI {
		pos: IState<Pos>;
	}
}

export interface KnotChoice {
	type: IState<"direct" | "transitive">;
	direction: "forward" | "backward";
	targetId: string;
}

export interface KnotContent {
	text: IState<string>;
	dialogue: ArrayState<string>;
	choices: ArrayState<KnotChoice>;
}

export interface Knot {
	id: IReadonlyState<UUID>;
	name: IState<string>;
	content: KnotContent;
	selected: IState<boolean>;
	ui: UI.KnotUI;
}

export interface Project {
	id: IReadonlyState<string>;
	name: IState<string>;
	knots: ArrayState<Knot>;
	socket: Socket;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;
}

export { getProject } from "./impl";
