import State, { ArrayState, HTMLState, IReadonlyState, dependentState, effectNow } from "../state";
import { Api, globalApi } from "../api/api";
import { E } from "../html";

class NodeEditor {
	constructor(public project: IReadonlyState<Api.Project>) {}

	create(): IReadonlyState<HTMLElement> {
		return dependentState(this.project, project => {
			return E('div.node-editor', e => {
				effectNow(project.nodes, (nodes, oldNodes) => {
					// TODO: difference between nodes and oldNodes.
					const newNodes = nodes.filter(n => !oldNodes?.find(oldNode => oldNode.id === n.id));
					const removedNodes = oldNodes?.filter(oldNode => !nodes?.find(n => oldNode.id === n.id)) ?? [];
				});
			});
		});
	}
}
