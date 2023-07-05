import { Socket, io } from "socket.io-client";
import { ArrayState, BasicState, IReadonlyState, IState } from "../state";

export namespace Api {
	export type UUID = string;

	export namespace UI {
		export interface Pos {
			x: number;
			y: number;
		}

		export interface Node {
			pos: Pos;
		}
	}

	export interface Node {
		id: UUID;
		name: string;
		ui: UI.Node;
	}
	
	export interface Project {
		id: IReadonlyState<string>;
		name: IState<string, string>;
		nodes: ArrayState<Node>;
		socket: Socket;
	}
}

export const globalApi = io('/api/global');
