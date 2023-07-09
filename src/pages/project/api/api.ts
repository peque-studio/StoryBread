import { Socket, io } from "socket.io-client";
import { ArrayState, IReadonlyState, IState } from "../../../state";

export declare namespace Api {
	export type UUID = string;

	export namespace UI {
		export interface Pos {
			x: number;
			y: number;
		}

		export interface Node {
			pos: IState<Pos>;
		}
	}

	export interface NodeConnection {
		type: IState<"direct" | "transitive">;
		direction: "forward" | "backward";
		targetId: string;
	}

	export interface NodeContent {
		text: IState<string>;
		connectsTo: ArrayState<NodeConnection>;
	}

	export interface Node {
		id: IReadonlyState<UUID>;
		name: IState<string>;
		content: NodeContent;
		selected: IState<boolean>;
		ui: UI.Node;
	}

	export interface Project {
		id: IReadonlyState<string>;
		name: IState<string>;
		nodes: ArrayState<Node>;
		socket: Socket;
		created: IReadonlyState<Date>;
		modified: IReadonlyState<Date>;
	}

	export function getProject(): Promise<Project>;
}

export declare const globalApi: Socket;
