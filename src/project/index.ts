import State, { ArrayState } from "../state";
import { Api } from "../api/api";

class NodeEditor {
	nodes: ArrayState<Api.Node>;

	constructor() {
		this.nodes = new ArrayState<Api.Node>([]);
	}
}
