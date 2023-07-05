import State, { ArrayState, HTMLState, IReadonlyState, dependentState, effectNow } from "../state";
import { Api, globalApi } from "../api/api";
import { E } from "../html";

class NodeEditor {
	constructor(public project: IReadonlyState<Api.Project>) {}

	create(): IReadonlyState<HTMLElement> {
		return dependentState(this.project, project => {
			return E('div', e => {
				e.classList.add('node-editor');
			});
		});
	}
}
