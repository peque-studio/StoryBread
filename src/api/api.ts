export namespace Api {
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
		name: string;
		ui: UI.Node;
	}
}
