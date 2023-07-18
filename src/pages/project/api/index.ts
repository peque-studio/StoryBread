import { Socket, io } from "socket.io-client";
import { BasicState, IReadonlyState, IState, effectNow, lazyState } from "statec";
import { StateInitialProps, arrayDiff } from "../../../util";
import ArrayState, { ArrayStateTrans } from "../arrayState";

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
	dialogue: ArrayState<string, string>;
	choices: ArrayState<KnotChoice, string>;
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
	knots: ArrayState<Knot, string>;
	socket: Socket;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;

	deleteKnot(id: string): void;
	addKnot(x: number, y: number): Promise<Knot>;
}

export { getProject } from "./impl";
