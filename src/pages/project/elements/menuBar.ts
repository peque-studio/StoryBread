import { E } from "../../../html";
import { IReadonlyState, dependentState } from "../../../state";
import { Api } from "../api/api";

export default function createMenuBar(project: IReadonlyState<Api.Project>) {
	return dependentState(project, (project) => {
		return E("div.menu-bar", (e) => {
			e.append(
				E("button", (buttonEl) => {
					buttonEl.textContent = "Add Node";
				}),
				E("button.important", (buttonEl) => {
					buttonEl.textContent = "Test";
				}),
			);
		});
	});
}
